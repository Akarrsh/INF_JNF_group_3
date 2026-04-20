<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Smalot\PdfParser\Parser;

class JdParseController extends Controller
{
    /**
     * Parse an uploaded JD PDF using GPT-4o-mini and return
     * structured data to pre-fill the JNF / INF form.
     */
    public function parse(Request $request): JsonResponse
    {
        $company = $request->user()?->company;

        if (! $company) {
            return response()->json(['message' => 'Company profile not found.'], 404);
        }

        $request->validate([
            'file' => ['required', 'file', 'max:5120', 'mimes:pdf'],
        ]);

        // ── 1. Extract text from PDF ─────────────────────────────────────
        try {
            $parser = new Parser();
            $pdf    = $parser->parseFile($request->file('file')->getRealPath());
            $text   = $pdf->getText();
        } catch (\Throwable $e) {
            Log::warning('JdParseController: PDF text extraction failed', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Could not read this PDF. Please fill the form manually.',
            ], 422);
        }

        if (strlen(trim($text)) < 50) {
            return response()->json([
                'message' => 'The PDF appears to be image-based or empty. Please fill the form manually.',
            ], 422);
        }

        // Truncate to ~12 000 chars to stay safely within GPT token limits
        $text = substr($text, 0, 12000);

        // ── 2. Build prompts ─────────────────────────────────────────────
        $systemPrompt = <<<'PROMPT'
You are a structured data extractor for an Indian campus placement portal (IIT ISM Dhanbad CDC).
Extract information from the provided Job Description text and return ONLY valid JSON — no markdown fences, no extra keys.
Adhere exactly to the schema given. Use null for fields not mentioned.

Value constraints:
  - workMode: "onsite" | "remote" | "hybrid" (default "onsite" if unclear)
  - currency: "INR" | "USD" | "EUR" | "GBP" (default "INR" for Indian companies)
  - joiningMonth must be "YYYY-MM" format (e.g. "2025-07"); use null if not mentioned
  - All numeric fields must be plain integers (no currency symbols, no commas, no decimals)

CTC / Stipend conversion rules (CRITICAL — follow exactly):
  - 1 LPA = 100000 INR. So 32.58 LPA = 3258000, 12 LPA = 1200000.
  - "X Lac / Lakh" monthly = X * 100000. So "1 Lac" monthly stipend = 100000.
  - If annual CTC is given in LPA, multiply by 100000 to get ctcAnnual.
  - If monthly stipend is given, set stipendMonthly; also set ctcAnnual = stipendMonthly * 12.
  - Never multiply LPA by 1.2 or any other factor.

Hiring stage → selectionRounds mapping (use ONLY these values):
  - "Screening" / "Profile shortlist" / "Resume screening" → "resume"
  - "Online Assessment" / "Written test" / "Aptitude" → "aptitude_test"
  - "Technical test" / "Coding test" / "Tech assessment" → "technical_test"
  - "Technical Interview" / "Tech round" / "Engineering interview" → "technical_interview"
  - "HR Interview" / "Culture fit" / "Behavioral round" → "hr_interview"
  - "Group Discussion" / "GD" / "Case study" → "group_discussion"
  - "Pre-Placement Talk" / "PPT" / "Company presentation" → "ppt"
  - "Psychometric" / "Personality test" → "psychometric"
  - "Medical" → "medical"
  - Anything else → "other"
  Include ALL stages mentioned in the hiring process section.
PROMPT;

        $userPrompt = <<<PROMPT
Extract information from this Job Description and return JSON matching this exact schema:
{
  "jobTitle": "<string|null>",
  "jobDesignation": "<string|null — formal title like SDE-1, Data Engineer I>",
  "jobLocation": "<string|null — city/cities or Remote>",
  "workMode": "<onsite|remote|hybrid|null>",
  "expectedHires": <number|null>,
  "joiningMonth": "<YYYY-MM|null>",
  "jobDescription": "<string|null — comprehensive description up to 2500 chars: include role summary, responsibilities, and what the candidate will do>",
  "skills": ["<skill1>", "<skill2>"],
  "currency": "<INR|USD|EUR|GBP|null>",
  "ctcAnnual": <number|null — full integer in INR (e.g. 3258000 for 32.58 LPA)>,
  "stipendMonthly": <number|null — full integer in INR (e.g. 100000 for 1 Lac/month)>,
  "bonusAmount": <number|null — joining or performance bonus in INR>,
  "esopMentioned": <true|false — true if ESOPs, RSUs, or stock options are mentioned>,
  "esopNotes": "<string|null — brief note about ESOP/stock, e.g. 'ESOPs included in CTC'>",
  "selectionRounds": ["<type1>", "<type2>"],
  "teamMembers": <number|null>,
  "roomsRequired": <number|null>
}

JD TEXT:
{$text}
PROMPT;

        // ── 3. Call OpenAI ────────────────────────────────────────────────
        $apiKey = config('services.openai.key');
        $model  = config('services.openai.model', 'gpt-4o-mini');

        if (empty($apiKey)) {
            Log::error('JdParseController: OPENAI_API_KEY is not configured.');

            return response()->json([
                'message' => 'AI service is not configured. Please contact the administrator.',
            ], 503);
        }

        try {
            $certPath = base_path('cacert.pem');

            $response = Http::withToken($apiKey)
                ->timeout(45)
                ->withOptions(['verify' => file_exists($certPath) ? $certPath : true])
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model'           => $model,
                    'response_format' => ['type' => 'json_object'],
                    'messages'        => [
                        ['role' => 'system', 'content' => $systemPrompt],
                        ['role' => 'user',   'content' => $userPrompt],
                    ],
                    'max_tokens'  => 1500,
                    'temperature' => 0.1,
                ]);
        } catch (\Throwable $e) {
            Log::error('JdParseController: OpenAI HTTP request failed', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'AI service is unreachable. Please fill the form manually.',
            ], 503);
        }

        if ($response->failed()) {
            $errBody = $response->json();
            Log::warning('JdParseController: OpenAI returned error', ['body' => $errBody]);

            return response()->json([
                'message' => 'AI service returned an error. Please fill the form manually.',
            ], 503);
        }

        // ── 4. Decode and return ─────────────────────────────────────────
        $content   = $response->json('choices.0.message.content', '{}');
        $extracted = json_decode($content, true);

        if (json_last_error() !== JSON_ERROR_NONE || ! is_array($extracted)) {
            Log::warning('JdParseController: Could not parse AI JSON response', ['content' => $content]);

            return response()->json([
                'message' => 'AI returned an unexpected response. Please fill the form manually.',
            ], 500);
        }

        return response()->json(['extracted' => $extracted]);
    }
}
