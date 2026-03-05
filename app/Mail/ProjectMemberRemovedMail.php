<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ProjectMemberRemovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public array $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function build()
    {
        $memberName = $this->data['member']['user']['name'] ?? 'Desconhecido';

        return $this
            ->subject("Membro {$memberName} removido do projeto {$this->data['project']['name']}")
            ->view('emails.project_member_removed')
            ->with([
                'project' => $this->data['project'],
                'member' => $this->data['member'],
                'tasks' => $this->data['tasks'],
            ]);
    }
}