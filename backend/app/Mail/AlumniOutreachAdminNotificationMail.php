<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AlumniOutreachAdminNotificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $alumniName,
        public string $alumniEmail,
        public string $phone,
        public int    $completionYear,
        public string $degree,
        public string $branch,
        public string $currentJob,
        public string $areasOfInterest,
        public string $linkedinProfile,
        public ?string $currentLocation,
        public ?string $willingToVisit,
        public ?string $generalComments,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: sprintf('New Alumni Outreach Submission: %s', $this->alumniName),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.alumni-outreach-admin',
        );
    }
}
