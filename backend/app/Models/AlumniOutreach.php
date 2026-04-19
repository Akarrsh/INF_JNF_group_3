<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AlumniOutreach extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone_number',
        'completion_year',
        'degree',
        'degree_other',
        'branch',
        'current_job',
        'areas_of_interest',
        'linkedin_profile',
        'general_comments',
        'willing_to_visit',
        'current_location',
    ];
}
