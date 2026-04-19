<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AlumniOutreachConfirmationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $alumniName,
        public string $degree,
        public string $branch,
        public int    $completionYear
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Thank You for Registering – IIT (ISM) Alumni Outreach Program',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.alumni-outreach-confirmation',
        );
    }
}
