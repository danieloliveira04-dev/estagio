<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserStatusChangedMail extends Mailable
{
    use Queueable, SerializesModels;

    public array $userData;

    /**
     * Cria uma nova instância do Mailable.
     *
     * @param array $userData Contém: 
     *  - 'user' => User
     *  - 'projects' => array de projetos com tasks
     */
    public function __construct(array $userData)
    {
        $this->userData = $userData;
    }

    public function build()
    {
        $status = $this->userData['user']['deleted_at'] ? 'excluído' : 'inativado';

        return $this
            ->subject("O usuário {$this->userData['user']['name']} foi {$status}")
            ->view('emails.user_status_changed')
            ->with([
                'user' => $this->userData['user'],
                'project' => $this->userData['project'],
                'status' => $status,
            ]);
    }
}
