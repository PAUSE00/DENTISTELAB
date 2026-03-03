<?php

namespace App\Mail;

use App\Models\Invitation;
use App\Models\Lab;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ClinicInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Invitation $invitation,
        public Lab $lab,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "{$this->lab->name} vous invite à rejoindre DentalLab",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.clinic-invitation',
            with: [
                'labName' => $this->lab->name,
                'invitationUrl' => url("/invitation/{$this->invitation->token}"),
                'expiresAt' => $this->invitation->expires_at->format('d/m/Y'),
            ],
        );
    }
}
