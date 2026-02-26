<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Hash;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Auth;

class InvitationController extends Controller
{
    
    public function create(string $uuid): Response {
        $invitation = \App\Models\Invitation::query()
            ->where('token', $uuid)
            ->firstOrFail();

        return Inertia::render('auth/register', [
            'invitation' => $invitation,
        ]);
    }

    public function store(Request $request): RedirectResponse {
        $request->validate([
            'name' => 'required|string|max:225',
            'email' => 'required|string|lowercase|email|max:225|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => Role::USER,
            'status' => User::STATUS_ACTIVE,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->intended(route('dashboard', absolute: false));
    }

}
