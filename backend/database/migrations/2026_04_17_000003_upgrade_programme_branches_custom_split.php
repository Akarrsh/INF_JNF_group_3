<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // This migration is now a no-op because the create_programme_branches_table
        // migration already includes is_custom and the correct unique index.
    }

    public function down(): void
    {
        // No-op
    }
};
