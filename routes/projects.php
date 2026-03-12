<?php

use App\Http\Controllers\ProjectController;

Route::prefix('projects')->middleware('auth')->group(function() {

    Route::get('', function() {
        return ''; 
    })->name('projects.list');

    Route::get('{project}', [ProjectController::class, 'show'])
        ->name('projects.show');

    // Columns
    Route::post('{project}/columns', [ProjectController::class, 'storeColumn'])
        ->name('projects.columns.store');

    Route::put('{project}/columns/{column}', [ProjectController::class, 'updateColumn'])
        ->scopeBindings()
        ->name('projects.columns.update');

    Route::delete('{project}/columns/{column}', [ProjectController::class, 'deleteColumn'])
        ->scopeBindings()
        ->name('projects.columns.delete');

    Route::post('{project}/columns/{column}/move', [ProjectController::class, 'moveColumn'])
        ->scopeBindings()
        ->name('projects.column.move');

    // Members
    Route::get('{project}/members', [ProjectController::class, 'members'])
        ->name('projects.members');

    Route::put('{project}/members/{member}', [ProjectController::class, 'updateMember'])
        ->scopeBindings()    
        ->name('projects.members.update');

    Route::delete('{project}/members/{member}', [ProjectController::class, 'deleteMember'])
        ->scopeBindings()
        ->name('projects.members.delete');

    Route::post('{project}/members/invite', [ProjectController::class, 'inviteMember'])
        ->name('projects.members.invite');

    Route::delete('{project}/members/invite/{invitation}', [ProjectController::class, 'deleteInviteMember'])
        ->scopeBindings()
        ->name('projects.members.deleteInvite');

    Route::get('{project}/invitation/accept', [ProjectController::class, 'acceptInvitation'])
        ->name('projects.invitation.accept');

    // Route::post('{project}/invitation/decline', [ProjectController::class, 'declineInvitation'])
    //     ->name('projects.invitation.decline');

});