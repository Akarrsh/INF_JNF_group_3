# CDC Portal User Guide

## Overview
This guide is for two user roles:
- Admin (CDC team)
- Company (HR/recruitment users)

The portal supports company onboarding, JNF/INF submission, review workflows, and notifications.

## Company User Flow

### 1. Register
1. Open the frontend URL.
2. Go to Company Register.
3. Fill company and HR details.
4. Submit registration.
5. Wait for admin review or sign in if account is already active.

### 2. Sign In
1. Open the login page.
2. Enter company credentials.
3. You are redirected to the premium SaaS company dashboard.

### 3. Manage Company Profile
1. Open Company Profile.
2. Update contact and organization details.
3. Save changes.

### 4. Submit JNF
1. Open New JNF.
2. Fill form fields using the guided multi-step wizard. Use the interactive progress pills to navigate between sections.
3. Use autosave while drafting.
4. Upload attachments if required.
5. Review the final generated preview and submit when ready.

### 5. Submit INF
1. Open New INF.
2. Fill internship details using the guided multi-step wizard.
3. Use autosave while drafting.
4. Review the final generated preview and submit for review.

### 6. Track Submission Status & Request Edits
1. Open Submissions.
2. Check each form status (`draft`, `submitted`, `under_review`, `accepted`, `rejected`, `edit_requested`).
3. **One-Time Edit**: If your form is `submitted` and you haven't edited it post-submission, you can click **Edit**. Warning: saving an edit locks the form permanently.
4. **Request to Edit**: If your form is locked out from direct editing, click the **Request to Edit** button. Provide a mandatory reason. Your request will be sent to the CDC Admins.

### 7. Notifications
1. Open Notifications.
2. Read status changes and system alerts.
3. Mark individual notifications as read, or mark all.

## Admin User Flow

### 1. Sign In
1. Open login page.
2. Enter admin credentials.
3. You are redirected to admin dashboard.

### 2. Review JNF Queue
1. Open Admin -> JNFs.
2. Filter by status.
3. Open a submission.
4. Add remarks and approve/reject/under-review update.

### 3. Review INF Queue
1. Open Admin -> INFs.
2. Filter by status.
3. Open a submission.
4. Update status and remarks.

### 4. Manage Companies
1. Open Admin -> Companies.
2. Search by company or HR.
3. Open company detail.
4. Update company metadata if needed.

### 5. Notifications & Edit Requests
1. Open Admin -> Notifications.
2. Review in-app events, including **Edit Requested** alerts from companies (which display their specific reason for wanting to edit a locked form).
3. Mark read as required.

## Troubleshooting

### Login fails
- Verify email/password.
- Confirm your role is correct for the route.

### Cannot access admin/company pages
- Ensure you are signed in.
- Ensure token/session is valid.
- Check role-based access restrictions.

### Form submit fails
- Check required fields.
- Verify uploaded file type/size.
- Retry after refreshing session.

### Missing notifications
- Refresh notifications page.
- Confirm backend API is running.

## Support
For CDC support, contact internal administrators or the project maintainers with:
- role (admin/company)
- page URL
- timestamp
- screenshot/error message
