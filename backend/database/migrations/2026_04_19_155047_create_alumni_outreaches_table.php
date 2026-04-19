<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('alumni_outreaches', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone_number');
            $table->integer('completion_year');
            $table->string('degree');
            $table->string('degree_other')->nullable();
            $table->string('branch');
            $table->string('current_job');
            $table->text('areas_of_interest');
            $table->string('linkedin_profile');
            $table->text('general_comments')->nullable();
            $table->string('willing_to_visit')->nullable();
            $table->string('current_location')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alumni_outreaches');
    }
};
