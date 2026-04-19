<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class FormEditRequestedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $formType;
    public $formTitle;
    public $companyName;
    public $requestedBy;

    /**
     * Create a new message instance.
     */
    public function __construct(string $formType, string $formTitle, string $companyName, string $requestedBy)
    {
        $this->formType = $formType;
        $this->formTitle = $formTitle;
        $this->companyName = $companyName;
        $this->requestedBy = $requestedBy;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Edit Requested: ' . $this->companyName . ' - ' . $this->formType,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.form-edit-requested',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
