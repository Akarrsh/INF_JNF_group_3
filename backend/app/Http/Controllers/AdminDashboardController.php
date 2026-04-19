<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Inf;
use App\Models\Jnf;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $jnfCounts = Jnf::query()
            ->selectRaw('status, COUNT(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');
        $infCounts = Inf::query()
            ->selectRaw('status, COUNT(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $jnfTotal = (int) array_sum($jnfCounts->all());
        $infTotal = (int) array_sum($infCounts->all());
        $jnfSubmitted = (int) ($jnfCounts['submitted'] ?? 0);
        $jnfUnderReview = (int) ($jnfCounts['under_review'] ?? 0);
        $jnfAccepted = (int) ($jnfCounts['accepted'] ?? 0);
        $jnfRejected = (int) ($jnfCounts['rejected'] ?? 0);
        $infSubmitted = (int) ($infCounts['submitted'] ?? 0);
        $infUnderReview = (int) ($infCounts['under_review'] ?? 0);
        $infAccepted = (int) ($infCounts['accepted'] ?? 0);
        $infRejected = (int) ($infCounts['rejected'] ?? 0);

        return response()->json([
            'stats' => [
                'companies_total' => Company::count(),
                'companies_with_submissions' => Company::where(function (Builder $query): void {
                    $query->whereHas('jnfs')->orWhereHas('infs');
                })->count(),
                'jnf_total' => $jnfTotal,
                'jnf_submitted' => $jnfSubmitted,
                'jnf_under_review' => $jnfUnderReview,
                'jnf_accepted' => $jnfAccepted,
                'jnf_rejected' => $jnfRejected,
                'inf_total' => $infTotal,
                'inf_submitted' => $infSubmitted,
                'inf_under_review' => $infUnderReview,
                'inf_accepted' => $infAccepted,
                'inf_rejected' => $infRejected,
                'pending_reviews' => $jnfSubmitted + $jnfUnderReview + $infSubmitted + $infUnderReview,
            ],
            'recent_submissions' => [
                'jnfs' => Jnf::with('company:id,name')->latest()->limit(5)->get(),
                'infs' => Inf::with('company:id,name')->latest()->limit(5)->get(),
            ],
        ]);
    }
}