<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Http\Kernel::class)->bootstrap();

try {
    $admin = \App\Models\User::where('role', 'admin')->first();
    \Illuminate\Support\Facades\Mail::to($admin->email)->send(new \App\Mail\FormEditRequestedMail(
        'JNF',
        'Test Job',
        'Test Company',
        'Test HR'
    ));
    echo "SUCCESS: Mail sent to " . $admin->email . "\n";
} catch (\Exception $e) {
    echo "FAILED: " . $e->getMessage() . "\n";
}
