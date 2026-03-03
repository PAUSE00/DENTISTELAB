<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TeamMemberInvitationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $invitedUser;
    public $password;
    public $inviter;

    /**
     * Create a new message instance.
     */
    public function __construct(User $invitedUser, string $password, User $inviter)
    {
        $this->invitedUser = $invitedUser;
        $this->password = $password;
        $this->inviter = $inviter;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Bienvenue dans notre équipe sur DentalLab',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.team-invitation',
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
