<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // SQLite does not support modifying enum columns, so we use a workaround:
        // Add the new column, then handle the status enum by using string type.
        // Since SQLite doesn't enforce enums, existing "enum" columns are actually TEXT.
        // We simply add the has_edited_once column.

        Schema::table('jnfs', function (Blueprint $table) {
            $table->boolean('has_edited_once')->default(false)->after('status');
        });

        Schema::table('infs', function (Blueprint $table) {
            $table->boolean('has_edited_once')->default(false)->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('jnfs', function (Blueprint $table) {
            $table->dropColumn('has_edited_once');
        });
        Schema::table('infs', function (Blueprint $table) {
            $table->dropColumn('has_edited_once');
        });
    }
};
