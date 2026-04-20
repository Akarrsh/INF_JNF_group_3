# IIT ISM Dhanbad - Career Development Centre (CDC) Placement Portal

A comprehensive, state-of-the-art placement portal enabling companies to securely register, verify their identities, and submit Job Notification Forms (JNF) and Internship Notification Forms (INF). It includes a powerful administrative interface for the CDC team to manage submissions, directly edit forms, and track alumni outreach programs.

---

## 🎯 Features

### 🏢 Company Portal
- **Premium SaaS Dashboard**: A highly polished, responsive interface built with Material-UI, featuring dynamic glassmorphic navigation, gradient welcome headers with perfected text contrast, and unified card-based data presentation.
- **Guided Form Wizards**: Massive, multi-step JNF (Job Notification Forms) and INF (Internship Notification Forms) built with interactive UI patterns, animated progress bars, and structured sub-sections.
- **Advanced Registration Setup**: Companies register via a 6-digit OTP email verification system to ensure identity authenticity.
- **Secure Authentication**: Session-based login utilizing NextAuth.js interconnected with Laravel Sanctum API Tokens.
- **Auto-Saving Drafts**: Forms save automatically in the background as the recruiter types, ensuring no data loss during long completion sessions.
- **Form Tracking**: Track submission status (Pending, Under Review, Accepted, Rejected) in real-time with clean status chips, loading skeletons, and interactive empty states.
- **Strict Edit Governance**: Implementing a one-time edit restriction post-submission with a formal "Request to Edit" workflow to prevent unauthorized continuous modifications.
- **Email Notifications**: Instant confirmation emails upon successful form submission and when admins change form statuses.

### 🛡️ Admin Portal
- **Operations Dashboard**: A responsive, sidebar-based layout that mirrors the premium company interface for seamless internal administration, complete with skeleton loading states and clean data tables.
- **Comprehensive Review Queue**: Review, manage, filter, and sort all incoming JNF/INF submissions within an optimized UI featuring improved hover states and structured typography.
- **Admin Direct Edit**: Admins can directly modify submitted INFs/JNFs (bypassing company lockouts) using the native form builder.
- **Deep-Diff Notification Engine**: When an admin edits a form, a custom recursive JSON diff algorithm detects the *exact* field changed (e.g., `Eligibility > B.Tech > CSE changed from false to true`) and sends a beautifully formatted email highlighting the change to the recruiter.
- **Alumni Outreach Tracker**: View, filter, and review mentorship applications submitted by Alumni, complete with 1-click LinkedIn redirection and email capabilities.

### 🎓 Alumni Outreach Program
- **Public Registration Form**: Custom landing page module for alumni to register as mentors.
- **Dual-Action Mailers**: Submitting the form queues a personalized confirmation email to the alumni and a detailed breakdown email + in-app notification to all CDC administrators.

---

## 🛠️ Tech Stack

### Frontend Architecture
- **Framework**: Next.js 15 (App Router)
- **UI Library**: Material-UI (MUI v6) with a custom premium theme matching IIT ISM branding.
- **Strict Typing**: Comprehensive TypeScript interfaces mapping directly to backend data structures (`types/forms.ts`).
- **Authentication**: NextAuth.js configured with a custom credentials provider.
- **API Proxy**: Next.js custom route rewrites (`/api/backend/*`) to gracefully handle CORS and cookie forwarding to the backend API.
- **Form Management**: `react-hook-form` coupled with `yup` for complex nested schema validations.

### Backend Architecture
- **Framework**: Laravel 11/12
- **Database**: SQLite (default for local development, production-ready for MySQL/MariaDB).
- **Authentication**: Laravel Sanctum (Stateful Cookie Auth).
- **Asynchronous Processing**: Database Queue Drivers (`queue:work`) to handle heavy email dispatching without blocking user requests.
- **Diff Engine**: Custom recursive array/JSON differencing algorithms to parse heavily nested form data.

---

## 🚀 Getting Started

### 1. Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 18+ and NPM
- Git

### 2. Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Configure your local database in `backend/.env` (SQLite is default).
**Important**: Ensure the MAIL variables are set, otherwise background queues will fail:
```env
DB_CONNECTION=sqlite

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-gmail-account@gmail.com
MAIL_PASSWORD=your-16-char-gmail-app-password
MAIL_FROM_ADDRESS=your-gmail-account@gmail.com
MAIL_FROM_NAME="IIT ISM CDC Portal"
```

Initialize the database and run the server:
```bash
php artisan migrate --seed
php artisan serve
```

**⚠️ CRITICAL: Start the Queue Worker**
Because all emails (OTP, Registration, Form Edits, Status changes) are queued to keep the portal fast, you MUST run the queue worker in a separate terminal:
```bash
cd backend
php artisan queue:work
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
```

Ensure `frontend/.env.local` contains:
```env
NEXTAUTH_SECRET="generate-a-random-32-char-string"
NEXTAUTH_URL="http://127.0.0.1:3000"
NEXT_PUBLIC_API_URL="/api/backend"
INTERNAL_API_URL="http://127.0.0.1:8000/api"
```

Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://127.0.0.1:3000`.

---

## 🤖 Architecture & Maintainer Context (For AI Agents & New Devs)

If you are an AI assistant or a new developer jumping into this codebase, this section provides the structural "cheat sheet" to understand exactly how the puzzle pieces fit together.

### 1. Authentication Flow (NextAuth + Laravel Sanctum)
The system uses a custom dual-authentication flow:
1. The user logs into the Next.js frontend via NextAuth (`frontend/auth.ts`).
2. NextAuth calls Laravel's `/api/auth/login`. 
3. Laravel returns a `token` (Sanctum PAT) alongside the user's role (`company` or `admin`).
4. NextAuth saves this string in the encrypted JWT session.
5. All future API calls wrap Next.js's native `fetch` (see `frontend/lib/adminApi.ts` and `frontend/lib/companyApi.ts`), automatically attaching the `Authorization: Bearer <token>` header.

**CORS Bypass**: To bypass heavy CORS issues locally, the frontend does not hit port `8000` directly from the client. Instead, it hits `/api/backend/*` (port 3000), and `next.config.ts` intercepts this and rewrites the request securely to the Laravel backend.

### 2. Next.js App Router Structure
The frontend is strictly siloed into three main permission bounds:
- `/frontend/app/auth/*` — Public unauthenticated routes.
- `/frontend/app/company/*` — Company routes. Enforced by Next.js layouts checking `session?.user?.role === "company"`.
- `/frontend/app/admin/*` — Admin Dashboard. Enforced by Next.js layouts checking `session?.user?.role === "admin"`.

### 3. The INF & JNF Master Forms (`react-hook-form`)
The JNF (`JnfFormPro.tsx`) and INF (`InfFormPro.tsx`) forms are massive multi-step wizards.
- **State**: The entire wizard state is stored in a single React context provided by `react-hook-form`'s `<FormProvider>`.
- **Validation**: Schema validation uses `yup` and happens instantly on tab switches and final submission.
- **Auto-Save**: Inside the component, a `useEffect` watches the form context. If the user stops typing for 2 seconds (debounced), a PATCH request secretly saves the JSON payload to the database as `status: 'draft'`.

### 4. Admin Edit & The Recursive JSON Deep-Diff Engine
Admins have the capability to edit forms originally submitted by companies. Because INFs/JNFs are massive JSON tree structures stored in the DB, simply alerting a user that "Your form changed" is unhelpful. 

When an Admin edits a form:
1. `AdminFormReviewController.php` receives the exact same JSON structure.
2. It executes a custom method: `getHumanReadableDiff($oldData, $newData)`.
3. This algorithm recursively walks down the multi-level arrays (e.g., parsing through Eligibility Arrays -> Degree -> Branch -> Object Properties).
4. If it detects a mismatch, it extracts the exact path, transforming `"programme.B.Tech.branches.0.selected"` into highly readable English: `"Eligibility > B.Tech > Branches > CSE > Selected"`.
5. Only these precise changes are bundled into the `FormEditedByAdminMail` and dispatched via the `database` queue worker to the company recruiter.

### 5. Edit Governance & Request to Edit
To prevent companies from bypassing reviews with continuous stealth edits, the system operates on a **One-Time Edit Paradigm**:
1. **Unrestricted Drafts**: Forms in `draft` state can be edited infinitely.
2. **One-Time Access**: Once a form transitions to `submitted`, it is flagged with `has_edited_once=false`. The next time the user saves or autosaves, the database consumes this privilege (`has_edited_once=true`) and immediately locks the form out of direct edit access (`403 Forbidden`).
3. **Request to Edit**: Locked forms require the company to click **"Request to Edit"**. This dispatches a formal request via the `POST /api/company/(jnfs|infs)/{id}/request-edit` endpoint, requiring a mandatory reason.
4. **Notifications**: The CDC Admin receives a warning notification in their dashboard and a detailed email highlighting the company's reason for the request, allowing manual un-locking if appropriate.

### 6. Backend Controllers & Route Prefixes
`routes/api.php` enforces the domains:
- `Route::prefix('company')` -> Resolved by `CompanyAuthController`, `CompanyInfController`, `CompanyJnfController`.
- `Route::prefix('admin')` -> Resolved by `AdminCompanyController`, `AdminFormReviewController`, `AdminDashboardController`.

*Always ensure modifications to routes respect this siloed structure.*

---

**Developed with ❤️ for IIT ISM Dhanbad**
