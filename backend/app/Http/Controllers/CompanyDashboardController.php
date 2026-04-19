<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompanyDashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $company = $request->user()?->company;

        if (! $company) {
            return response()->json(['message' => 'Company profile not found.'], 404);
        }

        $jnfs = $company->jnfs();
        $infs = $company->infs();

        return response()->json([
            'company' => [
                'name' => $company->name,
                'logo' => $company->logo,
            ],
            'stats' => [
                'jnf_total' => (clone $jnfs)->count(),
                'jnf_submitted' => (clone $jnfs)->where('status', 'submitted')->count(),
                'jnf_accepted' => (clone $jnfs)->where('status', 'accepted')->count(),
                'jnf_rejected' => (clone $jnfs)->where('status', 'rejected')->count(),
                'jnf_draft' => (clone $jnfs)->where('status', 'draft')->count(),
                'inf_total' => (clone $infs)->count(),
                'inf_submitted' => (clone $infs)->where('status', 'submitted')->count(),
                'inf_accepted' => (clone $infs)->where('status', 'accepted')->count(),
                'inf_rejected' => (clone $infs)->where('status', 'rejected')->count(),
                'inf_draft' => (clone $infs)->where('status', 'draft')->count(),
            ],
            'recent_jnfs' => (clone $jnfs)->latest()->limit(10)->get(['id', 'job_title', 'status', 'updated_at']),
            'recent_infs' => (clone $infs)->latest()->limit(10)->get(['id', 'internship_title', 'status', 'updated_at']),
        ]);
    }
}
