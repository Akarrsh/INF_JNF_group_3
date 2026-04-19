<?php

namespace App\Http\Controllers;

use App\Mail\FormStatusChangedMail;
use App\Models\FormStatusHistory;
use App\Models\Inf;
use App\Models\Jnf;
use App\Services\PortalNotificationService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminFormReviewController extends Controller
{
    public function __construct(private readonly PortalNotificationService $notificationService)
    {
    }

    public function jnfQueue(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['nullable', 'in:submitted,under_review,accepted,rejected,draft'],
        ]);

        $query = Jnf::with('company:id,name,hr_name,hr_email')->latest();

        if (! empty($validated['status'])) {
            $query->where('status', $validated['status']);
        } else {
            $query->whereIn('status', ['submitted', 'under_review']);
        }

        return response()->json([
            'jnfs' => $query->get(),
        ]);
    }

    public function infQueue(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['nullable', 'in:submitted,under_review,accepted,rejected,draft'],
        ]);

        $query = Inf::with('company:id,name,hr_name,hr_email')->latest();

        if (! empty($validated['status'])) {
            $query->where('status', $validated['status']);
        } else {
            $query->whereIn('status', ['submitted', 'under_review']);
        }

        return response()->json([
            'infs' => $query->get(),
        ]);
    }

    public function showJnf(Jnf $jnf): JsonResponse
    {
        return response()->json([
            'jnf' => $jnf->load('company'),
            'status_history' => $jnf->statusHistories()->with('changedBy:id,name,email')->latest()->get(),
        ]);
    }

    public function showInf(Inf $inf): JsonResponse
    {
        return response()->json([
            'inf' => $inf->load('company'),
            'status_history' => $inf->statusHistories()->with('changedBy:id,name,email')->latest()->get(),
        ]);
    }

    public function updateJnfStatus(Request $request, Jnf $jnf): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:under_review,accepted,rejected'],
            'admin_remarks' => ['nullable', 'string'],
        ]);

        $this->transitionFormStatus(
            request: $request,
            form: $jnf,
            formType: Jnf::class,
            title: 'JNF',
            subject: $jnf->job_title,
            status: $validated['status'],
            remarks: $validated['admin_remarks'] ?? null,
        );

        return response()->json([
            'message' => 'JNF status updated successfully.',
            'jnf' => $jnf->fresh(),
        ]);
    }

    public function updateInfStatus(Request $request, Inf $inf): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:under_review,accepted,rejected'],
            'admin_remarks' => ['nullable', 'string'],
        ]);

        $this->transitionFormStatus(
            request: $request,
            form: $inf,
            formType: Inf::class,
            title: 'INF',
            subject: $inf->internship_title,
            status: $validated['status'],
            remarks: $validated['admin_remarks'] ?? null,
        );

        return response()->json([
            'message' => 'INF status updated successfully.',
            'inf' => $inf->fresh(),
        ]);
    }

    public function updateJnf(Request $request, Jnf $jnf): JsonResponse
    {
        $validated = $request->validate([
            'job_title' => ['required', 'string', 'max:255'],
            'job_description' => ['required', 'string'],
            'job_location' => ['nullable', 'string', 'max:255'],
            'ctc' => ['nullable', 'numeric'],
            'vacancies' => ['nullable', 'integer', 'min:1'],
            'form_data' => ['required', 'string'],
        ]);

        $this->processFormEdit(
            form: $jnf,
            formType: 'JNF',
            title: $validated['job_title'],
            validatedData: $validated
        );

        return response()->json([
            'message' => 'JNF updated successfully.',
            'jnf' => $jnf->fresh(),
        ]);
    }

    public function updateInf(Request $request, Inf $inf): JsonResponse
    {
        $validated = $request->validate([
            'internship_title' => ['required', 'string', 'max:255'],
            'internship_description' => ['required', 'string'],
            'internship_location' => ['nullable', 'string', 'max:255'],
            'stipend' => ['nullable', 'numeric'],
            'internship_duration_weeks' => ['nullable', 'integer', 'min:1'],
            'vacancies' => ['nullable', 'integer', 'min:1'],
            'form_data' => ['required', 'string'],
        ]);

        $this->processFormEdit(
            form: $inf,
            formType: 'INF',
            title: $validated['internship_title'],
            validatedData: $validated
        );

        return response()->json([
            'message' => 'INF updated successfully.',
            'inf' => $inf->fresh(),
        ]);
    }

    private function processFormEdit(Model $form, string $formType, string $title, array $validatedData): void
    {
        $oldFormData = is_string($form->form_data) ? json_decode($form->form_data, true) : ($form->form_data ?? []);
        $newFormData = json_decode($validatedData['form_data'], true) ?? [];

        $changes = $this->getHumanReadableDiff($oldFormData, $newFormData);

        // Include top-level basic fields if there's any flat structure changes (like title, description)
        foreach ($validatedData as $key => $newValue) {
            if ($key === 'form_data') {
                continue;
            }
            $oldValue = $form->getAttribute($key);
            if ($oldValue !== $newValue) {
                $humanKey = ucfirst(str_replace('_', ' ', $key));
                $changes[$humanKey] = [
                    'old' => $oldValue,
                    'new' => $newValue,
                ];
            }
        }

        // Only send email if there are actual diffs
        if (count($changes) > 0) {
            $form->update($validatedData);

            $company = $form->company;
            if ($company) {
                foreach ($company->users as $user) {
                    $this->notificationService->sendLoggedEmail(
                        user: $user,
                        mailable: new \App\Mail\FormEditedByAdminMail(
                            formType: $formType,
                            title: $title,
                            changes: $changes
                        ),
                        subject: sprintf('%s Edited by Admin: %s', $formType, $title),
                        template: 'form-edited-by-admin'
                    );
                }
            }
        } else {
            $form->update($validatedData);
        }
    }

    private function getHumanReadableDiff(array $oldData, array $newData, string $prefix = ''): array
    {
        $changes = [];

        foreach ($newData as $key => $newValue) {
            $ident = is_array($newValue) ? ($newValue['programme'] ?? $newValue['branch'] ?? $newValue['id'] ?? $newValue['type'] ?? $key) : $key;
            $keyName = is_numeric($ident) ? ($prefix ? "(Item $ident)" : "Item $ident") : ucfirst(preg_replace('/(?<!^)[A-Z]/', ' $0', (string) $ident));
            $fullPath = $prefix ? "$prefix > $keyName" : $keyName;

            if (!array_key_exists($key, $oldData)) {
                $changes[$fullPath] = ['old' => null, 'new' => $newValue];
                continue;
            }

            $oldValue = $oldData[$key];

            if (is_array($newValue) && is_array($oldValue)) {
                $nestedChanges = $this->getHumanReadableDiff($oldValue, $newValue, $fullPath);
                foreach ($nestedChanges as $nKey => $nVal) {
                    $changes[$nKey] = $nVal;
                }
            } elseif ($oldValue !== $newValue) {
                $changes[$fullPath] = ['old' => $oldValue, 'new' => $newValue];
            }
        }

        foreach ($oldData as $key => $oldValue) {
            if (!array_key_exists($key, $newData)) {
                $ident = is_array($oldValue) ? ($oldValue['programme'] ?? $oldValue['branch'] ?? $oldValue['id'] ?? $oldValue['type'] ?? $key) : $key;
                $keyName = is_numeric($ident) ? ($prefix ? "(Item $ident)" : "Item $ident") : ucfirst(preg_replace('/(?<!^)[A-Z]/', ' $0', (string) $ident));
                $fullPath = $prefix ? "$prefix > $keyName" : $keyName;

                $changes[$fullPath] = ['old' => $oldValue, 'new' => null];
            }
        }

        return $changes;
    }

    private function transitionFormStatus(
        Request $request,
        Model $form,
        string $formType,
        string $title,
        string $subject,
        string $status,
        ?string $remarks
    ): void {
        $oldStatus = (string) $form->getAttribute('status');

        if ($oldStatus === $status && $remarks === null) {
            return;
        }

        $form->setAttribute('status', $status);
        if ($remarks !== null) {
            $form->setAttribute('admin_remarks', $remarks);
        }
        $form->save();

        FormStatusHistory::create([
            'form_type' => $formType,
            'form_id' => $form->getKey(),
            'old_status' => $oldStatus,
            'new_status' => $status,
            'changed_by' => $request->user()?->id,
            'remarks' => $remarks ?? 'Status updated by admin.',
        ]);

        $company = $form->company;
        if (! $company) {
            return;
        }

        foreach ($company->users as $user) {
            $notificationType = $status === 'accepted' ? 'success' : ($status === 'rejected' ? 'error' : 'info');

            $this->notificationService->createInAppNotification(
                user: $user,
                title: sprintf('%s Status Updated', $title),
                message: sprintf('%s status changed to %s for "%s".', $title, $status, $subject),
                type: $notificationType
            );

            $this->notificationService->sendLoggedEmail(
                user: $user,
                mailable: new FormStatusChangedMail(
                    formType: $title,
                    title: $subject,
                    status: $status,
                    remarks: $remarks,
                ),
                subject: sprintf('%s Status Updated: %s', $title, $subject),
                template: 'form-status-changed'
            );
        }
    }
}