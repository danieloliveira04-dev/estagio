<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Log;

class LogHelper
{
    public static function exception(\Throwable $ex, array $context = []): void
    {
        // Monta o identificador (classe@método)
        $caller = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 2)[1] ?? null;
        $location = isset($caller['class'], $caller['function'])
            ? $caller['class'] . '@' . $caller['function']
            : 'unknown';

        // Monta mensagem
        $message = "{$location}: " . $ex->getMessage();

        // Loga com contexto extra
        Log::error($message, array_merge([
            'exception' => $ex,
            'file' => $ex->getFile(),
            'line' => $ex->getLine(),
        ], $context));
    }
}
