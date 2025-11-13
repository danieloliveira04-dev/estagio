<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public array $invitation;

    public function __construct(array $data)
    {
        $this->invitation = $data['invitation'];
    }

    public function build()
    {
        return $this
            ->subject('Você foi convidado!')
            ->view('emails.invitation')
            ->with(['invitation' => $this->invitation]);
    }
}