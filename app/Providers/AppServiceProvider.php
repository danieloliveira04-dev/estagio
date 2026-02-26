<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $keys = [
            'roleManagerId',
            'roleCustomerId',
        ];

        Inertia::share('app', collect($keys)->mapWithKeys(fn($key) => [$key => env($key)]));
    }
}
