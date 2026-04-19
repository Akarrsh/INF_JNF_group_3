<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJnfRequest;
use App\Mail\FormSubmittedMail;
use App\Models\EmailLog;
use App\Models\FormStatusHistory;
use App\Models\Jnf;
use App\Models\PortalNotification;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class CompanyJnfController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $company = $request->user()?->company;

        if (! $company) {
            return response()->json(['message' => 'Company profile not found.'], 404);
        }

        $items = $company->jnfs()->latest()->get();

        return response()->json(['jnfs' => $items]);
    }

    public function show(Request $request, Jnf $jnf): JsonResponse
    {
        $company = $request->user()?->company;

        if (! $company || $jnf->company_id !== $company->id) {
            return response()->json(['message' => 'JNF not found.'], 404);
        }

        return response()->json([
            'jnf' => $jnf,
            'status_history' => $jnf->statusHistories()->latest()->get(),
        ]);
    }

    public function store(StoreJnfRequest $request): JsonResponse
    {
        $company = $request->user()?->company;

        if (! $company) {
            return response()->json(['message' => 'Company profile not found.'], 404);
        }

        $status = $request->input('status', 'draft');
        $data = array_merge($request->validated(), [
            'company_id' => $company->id,
            'status' => $status,
        ]);

        $jnf = Jnf::create($data);

        FormStatusHistory::create([
            'form_type' => Jnf::class,
            'form_id' => $jnf->id,
            'old_status' => null,
            'new_status' => $status,
            'changed_by' => $request->user()?->id,
            'remarks' => $status === 'draft' ? 'Auto-saved draft created.' : 'Form created.',
        ]);

        if ($status === 'submitted') {
            $this->sendSubmissionEmailAndNotify($request, $jnf);
        }

        return response()->json([
            'message' => $status === 'draft' ? 'JNF draft saved.' : 'JNF created successfully.',
            'jnf' => $jnf,
        ], 201);
    }

    public function update(StoreJnfRequest $request, Jnf $jnf): JsonResponse
    {
        $company = $request->user()?->company;

        if (! $company || $jnf->company_id !== $company->id) {
            return response()->json(['message' => 'JNF not found.'], 404);
        }

        $oldStatus = $jnf->status;
        $newStatus = $request->input('status', $oldStatus);
        $jnf->update(array_merge($request->validated(), ['status' => $newStatus]));

        if ($oldStatus !== $newStatus) {
            FormStatusHistory::create([
                'form_type' => Jnf::class,
                'form_id' => $jnf->id,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
                'changed_by' => $request->user()?->id,
                'remarks' => 'Status updated.',
            ]);
        }

        if ($oldStatus !== 'submitted' && $newStatus === 'submitted') {
            $this->sendSubmissionEmailAndNotify($request, $jnf);
        }

        return response()->json([
            'message' => $newStatus === 'draft' ? 'JNF draft auto-saved.' : 'JNF updated successfully.',
            'jnf' => $jnf->fresh(),
        ]);
    }

    public function destroy(Request $request, Jnf $jnf): JsonResponse
    {
        $company = $request->user()?->company;

        if (! $company || $jnf->company_id !== $company->id) {
            return response()->json(['message' => 'JNF not found.'], 404);
        }

        $jnf->delete();

        return response()->json(['message' => 'JNF deleted successfully.']);
    }

    public function autosave(Request $request): JsonResponse
    {
        $company = $request->user()?->company;

        if (! $company) {
            return response()->json(['message' => 'Company profile not found.'], 404);
        }

        $validated = $request->validate([
            'id' => ['nullable', 'integer', 'exists:jnfs,id'],
            'job_title' => ['required', 'string', 'max:255'],
            'job_description' => ['required', 'string', 'max:5000'],
            'job_location' => ['nullable', 'string', 'max:255'],
            'ctc_min' => ['nullable', 'integer', 'min:0'],
            'ctc_max' => ['nullable', 'integer', 'min:0', 'gte:ctc_min'],
            'vacancies' => ['nullable', 'integer', 'min:1'],
            'application_deadline' => ['nullable', 'date'],
            'admin_remarks' => ['nullable', 'string', 'max:2000'],
            'form_data' => ['nullable', 'string'],
        ]);

        $id = $validated['id'] ?? null;
        unset($validated['id']);

        // Parse form_data if it's a JSON string
        if (isset($validated['form_data']) && is_string($validated['form_data'])) {
            $validated['form_data'] = json_decode($validated['form_data'], true);
        }

        if ($id !== null) {
            $jnf = Jnf::where('id', $id)->where('company_id', $company->id)->first();

            if (! $jnf) {
                return response()->json(['message' => 'JNF not found.'], 404);
            }

            $jnf->update(array_merge($validated, ['status' => 'draft']));

            return response()->json([
                'message' => 'JNF draft auto-saved.',
                'jnf' => $jnf->fresh(),
            ]);
        }

        $jnf = Jnf::create(array_merge($validated, [
            'company_id' => $company->id,
            'status' => 'draft',
        ]));

        FormStatusHistory::create([
            'form_type' => Jnf::class,
            'form_id' => $jnf->id,
            'old_status' => null,
            'new_status' => 'draft',
            'changed_by' => $request->user()?->id,
            'remarks' => 'Auto-saved draft created.',
        ]);

        return response()->json([
            'message' => 'JNF draft auto-saved.',
            'jnf' => $jnf,
        ], 201);
    }

    public function duplicate(Request $request, Jnf $jnf): JsonResponse
    {
        $company = $request->user()?->company;

        if (! $company || $jnf->company_id !== $company->id) {
            return response()->json(['message' => 'JNF not found.'], 404);
        }

        // Create a copy with "Copy of" prefix
        $newJnf = Jnf::create([
            'company_id' => $company->id,
            'job_title' => 'Copy of ' . $jnf->job_title,
            'job_description' => $jnf->job_description,
            'job_location' => $jnf->job_location,
            'ctc_min' => $jnf->ctc_min,
            'ctc_max' => $jnf->ctc_max,
            'vacancies' => $jnf->vacancies,
            'application_deadline' => $jnf->application_deadline,
            'form_data' => $jnf->form_data,
            'status' => 'draft',
        ]);

        FormStatusHistory::create([
            'form_type' => Jnf::class,
            'form_id' => $newJnf->id,
            'old_status' => null,
            'new_status' => 'draft',
            'changed_by' => $request->user()?->id,
            'remarks' => 'Duplicated from JNF #' . $jnf->id,
        ]);

        return response()->json([
            'message' => 'JNF duplicated successfully.',
            'id' => $newJnf->id,
            'jnf' => $newJnf,
        ], 201);
    }

    private function sendSubmissionEmailAndNotify(Request $request, Jnf $jnf): void
    {
        $company = $request->user()?->company;

        if (! $company) {
            return;
        }

        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            try {
                Mail::to($admin->email)->send(new FormSubmittedMail('JNF', $company->name, $jnf->job_title));

                EmailLog::create([
                    'user_id' => $admin->id,
                    'recipient_email' => $admin->email,
                    'subject' => sprintf('JNF Submitted: %s', $jnf->job_title),
                    'template' => 'form-submitted',
                    'status' => 'sent',
                    'sent_at' => now(),
                ]);
            } catch (\Throwable $exception) {
                EmailLog::create([
                    'user_id' => $admin->id,
                    'recipient_email' => $admin->email,
                    'subject' => sprintf('JNF Submitted: %s', $jnf->job_title),
                    'template' => 'form-submitted',
                    'status' => 'failed',
                    'error_message' => $exception->getMessage(),
                ]);
            }

            PortalNotification::create([
                'user_id' => $admin->id,
                'title' => 'New JNF Submission',
                'message' => sprintf('%s submitted a JNF: %s', $company->name, $jnf->job_title),
                'type' => 'info',
            ]);
        }
    }
}
