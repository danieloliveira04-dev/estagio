<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendQueuedEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $to;
    public $mailableClass;
    public $data;

    public function __construct(string $to, string $mailableClass, array $data = [])
    {
        $this->to = $to;
        $this->mailableClass = $mailableClass;
        $this->data = $data;
    }

    public function handle()
    {
        $mailable = new $this->mailableClass($this->data);
        Mail::to($this->to)->send($mailable);
    }
}
