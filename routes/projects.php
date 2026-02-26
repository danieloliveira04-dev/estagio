<?php

use App\Http\Controllers\ProjectController;

Route::prefix('projects')->middleware('auth')->group(function() {

    Route::get('', function() {
        return ''; 
    })->name('projects.list');

    Route::get('{project}', [ProjectController::class, 'show'])
        ->name('projects.show');

    Route::get('{project}/members', [ProjectController::class, 'members'])
        ->name('projects.members');

    Route::post('{project}/members/invite', [ProjectController::class, 'inviteMember'])
        ->name('projects.members.invite');

    Route::get('{project}/invitation/accept', [ProjectController::class, 'acceptInvitation'])
        ->name('projects.invitation.accept');

    // Route::post('{project}/invitation/decline', [ProjectController::class, 'declineInvitation'])
    //     ->name('projects.invitation.decline');

});