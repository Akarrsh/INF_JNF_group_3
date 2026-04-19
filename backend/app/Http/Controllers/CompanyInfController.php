<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInfRequest;
use App\Mail\FormEditRequestedMail;
use App\Mail\FormSubmittedMail;
use App\Models\EmailLog;
use App\Models\FormStatusHistory;
use App\Models\Inf;
use App\Models\PortalNotification;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class CompanyInfController extends Controller
{
    /** Statuses where the company is never allowed to directly edit. */
    private const LOCKED_STATUSES = ['submitted', 'under_review', 'accepted', 'rejected', 'edit_requested'];

    /** Whether an INF is directly editable by the company right now. */
    private function isDirectlyEditable(Inf $inf): bool
    {
        if ($inf->status === 'draft') {
            return true; // Always editable in draft
        }
        // After submission: allowed ONE time (has_edited_once = false means unused)
        if ($inf->status === 'submitted' && ! $inf->has_edited_once) {
            return true;
        }
        return false;
    }

    public function index(Request $request): JsonResponse
    {
        $company = $request->user()?->company;

        if (! $company) {
            return response()->json(['message' => 'Company profile not found.'], 404);
        }

        $items = $company->infs()->latest()->get();

        return response()->json(['infs' => $items]);
    }

    public function show(Request $request, Inf $inf): JsonResponse
    {
        $company = $request->user()?->company;

        if (! $company || $inf->company_id !== $company->id) {
            return response()->json(['message' => 'INF not found.'], 404);
        }

        return response()->json([
            'inf' => $inf,
            'status_history' => $inf->statusHistories()->latest()->get(),
            'can_edit' => $this->isDirectlyEditable($inf),
        ]);
    }

    public function store(StoreInfRequest $request): JsonResponse
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

        $inf = Inf::create($data);

        FormStatusHistory::create([
            'form_type' => Inf::class,
            'form_id' => $inf->id,
            'old_status' => null,
            'new_status' => $status,
            'changed_by' => $request->user()?->id,
            'remarks' => $status === 'draft' ? 'Auto-saved draft created.' : 'Form created.',
        ]);

        if ($status === 'submitted') {
            $this->sendSubmissionEmailAndNotify($request, $inf);
        }

        return response()->json([
            'message' => $status === 'draft' ? 'INF draft saved.' : 'INF created successfully.',
            'inf' => $inf,
        ], 201);
    }

    public function update(StoreInfRequest $request, Inf $inf): JsonResponse
    {
        $company = $request->user()?->company;

        if (! $company || $inf->company_id !== $company->id) {
            return response()->json(['message' => 'INF not found.'], 404);
        }

        // --- Backend enforcement of edit control ---
        if (! $this->isDirectlyEditable($inf)) {
            return response()->json([
                'message' => 'This INF cannot be edited directly. Please use the "Request to Edit" option.',
            ], 403);
        }

        $oldStatus = $inf->status;
        $newStatus = $request->input('status', $oldStatus);

        // If editing a submitted form for the first time, mark the flag
        $wasSubmitted = $oldStatus === 'submitted';
        $extraFields = [];
        if ($wasSubmitted && ! $inf->has_edited_once) {
            $extraFields['has_edited_once'] = true;
        }

        $inf->update(array_merge($request->validated(), ['status' => $newStatus], $extraFields));

        if ($oldStatus !== $newStatus) {
            FormStatusHistory::create([
                'form_type' => Inf::class,
                'form_id' => $inf->id,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
                'changed_by' => $request->user()?->id,
                'remarks' => $wasSubmitted ? 'One-time post-submission edit used.' : 'Status updated.',
            ]);
        }

        if ($oldStatus !== 'submitted' && $newStatus === 'submitted') {
            $this->sendSubmissionEmailAndNotify($request, $inf);
        }

        return response()->json([
            'message' => $newStatus === 'draft' ? 'INF draft auto-saved.' : 'INF updated successfully.',
            'inf' => $inf->fresh(),
        ]);
    }

    public function destroy(Request $request, Inf $inf): JsonResponse
    {
        $company = $request->user()?->company;

        if (! $company || $inf->company_id !== $company->id) {
            return response()->json(['message' => 'INF not found.'], 404);
        }

        $inf->delete();

        return response()->json(['message' => 'INF deleted successfully.']);
    }

    public function autosave(Request $request): JsonResponse
    {
        $company = $request->user()?->company;

        if (! $company) {
            return response()->json(['message' => 'Company profile not found.'], 404);
        }

        $validated = $request->validate([
            'id' => ['nullable', 'integer', 'exists:infs,id'],
            'internship_title' => ['required', 'string', 'max:255'],
            'internship_description' => ['required', 'string', 'max:5000'],
            'internship_location' => ['nullable', 'string', 'max:255'],
            'stipend' => ['nullable', 'integer', 'min:0'],
            'internship_duration_weeks' => ['nullable', 'integer', 'min:1'],
            'vacancies' => ['nullable', 'integer', 'min:1'],
            'application_deadline' => ['nullable', 'date'],
            'admin_remarks' => ['nullable', 'string', 'max:2000'],
            'form_data' => ['nullable', 'string'],
        ]);

        $id = $validated['id'] ?? null;
        unset($validated['id']);

        if (isset($validated['form_data']) && is_string($validated['form_data'])) {
            $validated['form_data'] = json_decode($validated['form_data'], true);
        }

        if ($id !== null) {
            $inf = Inf::where('id', $id)->where('company_id', $company->id)->first();

            if (! $inf) {
                return response()->json(['message' => 'INF not found.'], 404);
            }

            // Block autosave if the form is not directly editable
            if (! $this->isDirectlyEditable($inf)) {
                return response()->json(['message' => 'Cannot autosave a locked INF.'], 403);
            }

            // For submitted forms: flip has_edited_once on first autosave so the
            // one-time edit slot is consumed immediately when they start typing.
            $extraFields = [];
            if ($inf->status === 'submitted' && ! $inf->has_edited_once) {
                $extraFields['has_edited_once'] = true;
            }

            $inf->update(array_merge($validated, ['status' => $inf->status], $extraFields));

            return response()->json([
                'message' => 'INF auto-saved.',
                'inf' => $inf->fresh(),
            ]);
        }

        $inf = Inf::create(array_merge($validated, [
            'company_id' => $company->id,
            'status' => 'draft',
        ]));

        FormStatusHistory::create([
            'form_type' => Inf::class,
            'form_id' => $inf->id,
            'old_status' => null,
            'new_status' => 'draft',
            'changed_by' => $request->user()?->id,
            'remarks' => 'Auto-saved draft created.',
        ]);

        return response()->json([
            'message' => 'INF draft auto-saved.',
            'inf' => $inf,
        ], 201);
    }

    public function duplicate(Request $request, Inf $inf): JsonResponse
    {
        $company = $request->user()?->company;

        if (! $company || $inf->company_id !== $company->id) {
            return response()->json(['message' => 'INF not found.'], 404);
        }

        $newInf = Inf::create([
            'company_id' => $company->id,
            'internship_title' => 'Copy of ' . $inf->internship_title,
            'internship_description' => $inf->internship_description,
            'internship_location' => $inf->internship_location,
            'stipend' => $inf->stipend,
            'internship_duration_weeks' => $inf->internship_duration_weeks,
            'vacancies' => $inf->vacancies,
            'application_deadline' => $inf->application_deadline,
            'form_data' => $inf->form_data,
            'status' => 'draft',
            'has_edited_once' => false,
        ]);

        FormStatusHistory::create([
            'form_type' => Inf::class,
            'form_id' => $newInf->id,
            'old_status' => null,
            'new_status' => 'draft',
            'changed_by' => $request->user()?->id,
            'remarks' => 'Duplicated from INF #' . $inf->id,
        ]);

        return response()->json([
            'message' => 'INF duplicated successfully.',
            'id' => $newInf->id,
            'inf' => $newInf,
        ], 201);
    }

    public function requestEdit(Request $request, Inf $inf): JsonResponse
    {
        $company = $request->user()?->company;

        if (! $company || $inf->company_id !== $company->id) {
            return response()->json(['message' => 'INF not found.'], 404);
        }

        // Already editable — no need to request
        if ($this->isDirectlyEditable($inf)) {
            return response()->json(['message' => 'Form is already directly editable.'], 400);
        }

        // Already requested — don't double-request
        if ($inf->status === 'edit_requested') {
            return response()->json(['message' => 'Edit request already pending.'], 400);
        }

        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:1000'],
            'comments' => ['nullable', 'string', 'max:2000'],
        ]);

        $oldStatus = $inf->status;
        $inf->update(['status' => 'edit_requested']);

        $remarks = 'Reason: ' . $validated['reason'];
        if (! empty($validated['comments'])) {
            $remarks .= ' | Comments: ' . $validated['comments'];
        }

        FormStatusHistory::create([
            'form_type' => Inf::class,
            'form_id' => $inf->id,
            'old_status' => $oldStatus,
            'new_status' => 'edit_requested',
            'changed_by' => $request->user()?->id,
            'remarks' => $remarks,
        ]);

        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            try {
                Mail::to($admin->email)->send(new FormEditRequestedMail(
                    'INF',
                    $inf->internship_title,
                    $company->name,
                    $request->user()->name
                ));
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::error('FormEditRequestedMail failed', [
                    'to' => $admin->email,
                    'error' => $e->getMessage(),
                ]);
            }
            PortalNotification::create([
                'user_id' => $admin->id,
                'title' => 'Edit Requested for INF',
                'message' => sprintf('%s requested to edit INF: %s. Reason: %s', $company->name, $inf->internship_title, $validated['reason']),
                'type' => 'warning',
            ]);
        }

        return response()->json([
            'message' => 'Edit request submitted successfully. The CDC admin will review your request.',
            'inf' => $inf->fresh(),
        ]);
    }

    private function sendSubmissionEmailAndNotify(Request $request, Inf $inf): void
    {
        $company = $request->user()?->company;

        if (! $company) {
            return;
        }

        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            try {
                Mail::to($admin->email)->send(new FormSubmittedMail('INF', $company->name, $inf->internship_title));

                EmailLog::create([
                    'user_id' => $admin->id,
                    'recipient_email' => $admin->email,
                    'subject' => sprintf('INF Submitted: %s', $inf->internship_title),
                    'template' => 'form-submitted',
                    'status' => 'sent',
                    'sent_at' => now(),
                ]);
            } catch (\Throwable $exception) {
                EmailLog::create([
                    'user_id' => $admin->id,
                    'recipient_email' => $admin->email,
                    'subject' => sprintf('INF Submitted: %s', $inf->internship_title),
                    'template' => 'form-submitted',
                    'status' => 'failed',
                    'error_message' => $exception->getMessage(),
                ]);
            }

            PortalNotification::create([
                'user_id' => $admin->id,
                'title' => 'New INF Submission',
                'message' => sprintf('%s submitted an INF: %s', $company->name, $inf->internship_title),
                'type' => 'info',
            ]);
        }
    }
}
