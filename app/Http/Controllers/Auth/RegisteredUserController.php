<?php

namespace App\Http\Controllers\Auth;

use App\Helpers\LogHelper;
use App\Http\Controllers\Controller;
use App\Models\Invitation;
use App\Models\Role;
use App\Models\User;
use DB;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(string $uuid): Response
    {
        $invitation = \App\Models\Invitation::query()
            ->where('token', $uuid)
            ->firstOrFail();

        $isValid = $invitation->isValid();
        $flash = null;

        if(!$isValid) {
            $flash = [
                'type' => 'error',
                'message' => 'Esse convite não é mais válido',
            ];
        }

        return Inertia::render('auth/register', [
            'invitation' => $invitation,
            'isValid' => $isValid,
        ])->with('flash', $flash);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'invitation' => 'required|exists:invitations,token', 
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $invitation = Invitation::query()
            ->where('token', $request->invitation)
            ->first();

        if(!$invitation->isValid()) {
            return back()->withInput()->with('flash', [
                'type' => 'error',
                'message' => 'Esse convite não é mais válido',
            ]);
        }

        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'roleId' => $invitation->roleId,
                'status' => User::STATUS_ACTIVE,
            ]);

            $invitation->update([
                'status' => Invitation::STATUS_ACCEPTED,
            ]);

            DB::commit();

            event(new Registered($user));

            Auth::login($user);

            return redirect()->intended(route('dashboard', absolute: false));

         } catch (\Exception $ex) {
            DB::rollBack();

            LogHelper::exception($ex);

            $msg = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $msg .= ' Detalhes: ' . $ex->getMessage();
            }

            return back()->withInput()->with('flash', [
                'type' => 'error',
                'message' => 'Ocorreu um erro ao tentar salvar os dados.',
            ]);
        }
    }
}
