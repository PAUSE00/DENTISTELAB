<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewUserCredentials extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $name,
        public string $email,
        public string $password,
        public string $role,       // 'dentist' | 'lab_owner' etc.
        public string $loginUrl,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🦷 Vos identifiants DentalLabPro — Bienvenue !',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.new-user-credentials',
        );
    }
}
