<?php
$inf = \App\Models\Inf::first();
$company = $inf->company;
$user = \App\Models\User::where('company_id', $company->id)->first();

$admins = \App\Models\User::where('role', 'admin')->get();
foreach ($admins as $admin) {
    try {
        \Illuminate\Support\Facades\Mail::to($admin->email)->send(new \App\Mail\FormEditRequestedMail(
            'INF',
            $inf->internship_title,
            $company->name,
            $user->name
        ));
        echo 'Mailed to ' . $admin->email . PHP_EOL;
    } catch (\Throwable $e) {
        echo 'ERROR: ' . $e->getMessage() . PHP_EOL;
    }
}
