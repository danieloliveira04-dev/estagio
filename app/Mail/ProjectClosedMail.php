<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ProjectClosedMail extends Mailable
{
    use Queueable, SerializesModels;

    public array $data;

    /**
     * Cria uma nova instância do Mailable.
     *
     * @param array $data Contém: 
     *  - 'project' => array do projeto encerrado
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function build()
    {
        return $this
            ->subject("O projeto \"{$this->data['project']['name']}\" foi encerrado")
            ->view('emails.project_closed')
            ->with([
                'project' => $this->data['project'],
            ]);
    }
}
