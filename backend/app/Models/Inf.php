<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Inf extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'company_id',
        'internship_title',
        'internship_description',
        'internship_location',
        'stipend',
        'internship_duration_weeks',
        'vacancies',
        'application_deadline',
        'status',
        'has_edited_once',
        'admin_remarks',
        'form_data',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'application_deadline' => 'date',
            'stipend' => 'integer',
            'internship_duration_weeks' => 'integer',
            'vacancies' => 'integer',
            'form_data' => 'array',
            'has_edited_once' => 'boolean',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function statusHistories(): MorphMany
    {
        return $this->morphMany(FormStatusHistory::class, 'form');
    }
}
