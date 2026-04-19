<?php

namespace App\Http\Controllers;

use App\Mail\AlumniOutreachAdminNotificationMail;
use App\Mail\AlumniOutreachConfirmationMail;
use App\Models\AlumniOutreach;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AlumniOutreachController extends Controller
{
    /** Admin: list all submissions */
    public function index(): JsonResponse
    {
        $outreaches = AlumniOutreach::orderByDesc('created_at')->get();

        return response()->json(['alumni_outreaches' => $outreaches]);
    }

    /** Admin: view a single submission */
    public function show(AlumniOutreach $outreach): JsonResponse
    {
        return response()->json(['alumni_outreach' => $outreach]);
    }

    /** Public: store a new submission */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'              => ['required', 'string', 'max:255'],
            'email'             => ['required', 'email', 'max:255'],
            'phone_number'      => ['required', 'string', 'max:30'],
            'completion_year'   => ['required', 'integer', 'min:1900', 'max:' . (date('Y') + 10)],
            'degree'            => ['required', 'string', 'max:100'],
            'degree_other'      => ['nullable', 'string', 'max:255'],
            'branch'            => ['required', 'string', 'max:255'],
            'current_job'       => ['required', 'string', 'max:255'],
            'areas_of_interest' => ['required', 'string'],
            'linkedin_profile'  => ['required', 'url', 'max:500'],
            'general_comments'  => ['nullable', 'string'],
            'willing_to_visit'  => ['nullable', 'string', 'in:yes,no,maybe'],
            'current_location'  => ['nullable', 'string', 'max:255'],
        ]);

        $outreach = AlumniOutreach::create($validated);

        $degreeLabel = $validated['degree'] === 'other'
            ? ($validated['degree_other'] ?? $validated['degree'])
            : $validated['degree'];

        // 1. Confirmation email to the alumni
        try {
            Mail::to($validated['email'])->queue(new AlumniOutreachConfirmationMail(
                alumniName:      $validated['name'],
                degree:          $degreeLabel,
                branch:          $validated['branch'],
                completionYear:  (int) $validated['completion_year'],
            ));
        } catch (\Throwable $e) {
            Log::warning('Alumni confirmation email failed to queue.', [
                'email' => $validated['email'],
                'error' => $e->getMessage(),
            ]);
        }

        // 2. Notification email to the CDC admin address + in-app notifications
        try {
            $adminEmail = config('mail.from.address', 'iitismcdc@gmail.com');

            Mail::to($adminEmail)->queue(new AlumniOutreachAdminNotificationMail(
                alumniName:      $validated['name'],
                alumniEmail:     $validated['email'],
                phone:           $validated['phone_number'],
                completionYear:  (int) $validated['completion_year'],
                degree:          $degreeLabel,
                branch:          $validated['branch'],
                currentJob:      $validated['current_job'],
                areasOfInterest: $validated['areas_of_interest'],
                linkedinProfile: $validated['linkedin_profile'],
                currentLocation: $validated['current_location'] ?? null,
                willingToVisit:  $validated['willing_to_visit'] ?? null,
                generalComments: $validated['general_comments'] ?? null,
            ));

            User::where('role', 'admin')->each(function (User $admin) use ($validated) {
                \App\Models\PortalNotification::create([
                    'user_id' => $admin->id,
                    'title'   => 'New Alumni Outreach Submission',
                    'message' => sprintf(
                        '%s (%s, %s) has registered for the Alumni Outreach program.',
                        $validated['name'],
                        $validated['branch'],
                        $validated['completion_year']
                    ),
                    'type'    => 'info',
                ]);
            });
        } catch (\Throwable $e) {
            Log::warning('Alumni admin notification failed to queue.', [
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'message' => 'Thank you for your submission! We will get back to you soon.',
            'id'      => $outreach->id,
        ], 201);
    }
}
