<?php

use App\Http\Controllers\AlumniOutreachController;
use App\Http\Controllers\AdminCompanyController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminFormReviewController;
use App\Http\Controllers\AdminProgrammeBranchController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyAuthController;
use App\Http\Controllers\CompanyDashboardController;
use App\Http\Controllers\CompanyFileUploadController;
use App\Http\Controllers\CompanyInfController;
use App\Http\Controllers\CompanyJnfController;
use App\Http\Controllers\JdParseController;
use App\Http\Controllers\CompanyProfileController;
use App\Http\Controllers\EligibilityCatalogueController;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:api')->group(function () {

// Public alumni outreach submission route
Route::post('/alumni-outreach', [AlumniOutreachController::class, 'store']);

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::post('/admin/register', [AuthController::class, 'registerAdmin']);
    Route::post('/company/register', [CompanyAuthController::class, 'register']);
    Route::post('/company/recruiter-email/verification-link', [CompanyAuthController::class, 'sendRecruiterEmailVerificationLink']);
    Route::get('/company/recruiter-email/verify', [CompanyAuthController::class, 'verifyRecruiterEmail']);
    Route::get('/company/recruiter-email/verification-status', [CompanyAuthController::class, 'recruiterEmailVerificationStatus']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);

        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    });
});

Route::middleware('auth:sanctum')->get('/programme-branches', [EligibilityCatalogueController::class, 'programmeBranches']);

Route::middleware(['auth:sanctum', 'role:admin'])->get('/admin/ping', function () {
    return response()->json([
        'message' => 'Admin route access granted.',
    ]);
});

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index']);

    Route::get('/programme-branches', [AdminProgrammeBranchController::class, 'index']);
    Route::post('/programme-branches', [AdminProgrammeBranchController::class, 'store']);
    Route::patch('/programme-branches/status', [AdminProgrammeBranchController::class, 'updateExistingStatus']);
    Route::delete('/programme-branches/{programmeBranch}', [AdminProgrammeBranchController::class, 'destroy']);

    Route::get('/jnfs', [AdminFormReviewController::class, 'jnfQueue']);
    Route::get('/jnfs/{jnf}', [AdminFormReviewController::class, 'showJnf']);
    Route::patch('/jnfs/{jnf}/status', [AdminFormReviewController::class, 'updateJnfStatus']);
    Route::put('/jnfs/{jnf}/edit', [AdminFormReviewController::class, 'updateJnf']);

    Route::get('/infs', [AdminFormReviewController::class, 'infQueue']);
    Route::get('/infs/{inf}', [AdminFormReviewController::class, 'showInf']);
    Route::patch('/infs/{inf}/status', [AdminFormReviewController::class, 'updateInfStatus']);
    Route::put('/infs/{inf}/edit', [AdminFormReviewController::class, 'updateInf']);

    Route::get('/alumni-outreach', [AlumniOutreachController::class, 'index']);
    Route::get('/alumni-outreach/{outreach}', [AlumniOutreachController::class, 'show']);

    Route::get('/companies', [AdminCompanyController::class, 'index']);
    Route::get('/companies/{company}', [AdminCompanyController::class, 'show']);
    Route::put('/companies/{company}', [AdminCompanyController::class, 'update']);
});

Route::middleware(['auth:sanctum', 'role:company'])->get('/company/ping', function () {
    return response()->json([
        'message' => 'Company route access granted.',
    ]);
});

Route::middleware(['auth:sanctum', 'role:company'])->prefix('company')->group(function () {
    Route::get('/dashboard', [CompanyDashboardController::class, 'index']);

    Route::get('/profile', [CompanyProfileController::class, 'show']);
    Route::put('/profile', [CompanyProfileController::class, 'update']);

    Route::post('/uploads', [CompanyFileUploadController::class, 'store']);
    Route::post('/jd-parse', [JdParseController::class, 'parse']);

    Route::post('/jnfs/autosave', [CompanyJnfController::class, 'autosave']);
    Route::post('/jnfs/{jnf}/duplicate', [CompanyJnfController::class, 'duplicate']);
    Route::post('/jnfs/{jnf}/request-edit', [CompanyJnfController::class, 'requestEdit']);
    Route::apiResource('jnfs', CompanyJnfController::class);

    Route::post('/infs/autosave', [CompanyInfController::class, 'autosave']);
    Route::post('/infs/{inf}/duplicate', [CompanyInfController::class, 'duplicate']);
    Route::post('/infs/{inf}/request-edit', [CompanyInfController::class, 'requestEdit']);
    Route::apiResource('infs', CompanyInfController::class);
});
});
