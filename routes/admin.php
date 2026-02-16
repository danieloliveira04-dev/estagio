<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectStatusController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\TaskStatusController;
use App\Http\Controllers\TemplateController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('admin')->middleware('auth')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('admin.dashboard');
 
    //Users
    Route::get('users', [UserController::class, 'show'])
        ->name('admin.users.list');

    Route::get('users/invite', [UserController::class, 'inviteForm'])
        ->name('admin.users.invite.form');

    Route::post('users/invite', [UserController::class, 'inviteStore'])
        ->name('admin.users.invite.store');

    Route::get('users/getDetails/{id}', [UserController::class, 'getDetails'])
        ->name('admin.users.getDetails');

    Route::Get('users/autocomplete', [UserController::class, 'autocomplete'])
        ->name('admin.users.autocomplete');

    Route::get('users/{user}', [UserController::class, 'edit'])
        ->name('admin.users.edit');

    Route::put('users/{user}', [UserController::class, 'update'])
        ->name('admin.users.update');

    Route::delete('users/{user}', [UserController::class, 'delete'])
        ->name('admin.users.delete');

    //Roles
    Route::get('roles', [RoleController::class, 'show'])
        ->name('admin.roles.list');

    Route::get('roles/create', [RoleController::class, 'form'])
        ->name('admin.roles.form');

    Route::post('roles/store', [RoleController::class, 'store'])
        ->name('admin.roles.store');

    Route::get('roles/getDetails/{id}', [RoleController::class, 'getDetails'])
        ->name('admin.roles.getDetails');

    Route::get('roles/{role}', [RoleController::class, 'edit'])
        ->name('admin.roles.edit');

    Route::put('roles/{role}', [RoleController::class, 'update'])
        ->name('admin.roles.update');

    Route::delete('roles/{role}', [RoleController::class, 'delete'])
        ->name('admin.roles.delete');

    //TaskStatus
    Route::get('taskStatus', [TaskStatusController::class, 'show'])
        ->name('admin.taskStatus.list');

    Route::get('taskStatus/create', [TaskStatusController::class, 'form'])
        ->name('admin.taskStatus.form');

    Route::post('taskStatus/store', [TaskStatusController::class, 'store'])
        ->name('admin.taskStatus.store');

    Route::get('taskStatus/getDetails/{id}', [TaskStatusController::class, 'getDetails'])
        ->name('admin.taskStatus.getDetails');

    Route::get('taskStatus/{taskStatus}', [TaskStatusController::class, 'edit'])
        ->name('admin.taskStatus.edit');

    Route::put('taskStatus/{taskStatus}', [TaskStatusController::class, 'update'])
        ->name('admin.taskStatus.update');

    Route::delete('taskStatus/{taskStatus}', [TaskStatusController::class, 'delete'])
        ->name('admin.taskStatus.delete');

    //ProjectStatus
    Route::get('projectStatus', [ProjectStatusController::class, 'show'])
        ->name('admin.projectStatus.list');

    Route::get('projectStatus/create', [ProjectStatusController::class, 'form'])
        ->name('admin.projectStatus.form');

    Route::post('projectStatus/store', [ProjectStatusController::class, 'store'])
        ->name('admin.projectStatus.store');

    Route::get('projectStatus/getDetails/{id}', [ProjectStatusController::class, 'getDetails'])
        ->name('admin.projectStatus.getDetails');

    Route::get('projectStatus/{projectStatus}', [ProjectStatusController::class, 'edit'])
        ->name('admin.projectStatus.edit');

    Route::put('projectStatus/{projectStatus}', [ProjectStatusController::class, 'update'])
        ->name('admin.projectStatus.update');

    Route::delete('projectStatus/{projectStatus}', [ProjectStatusController::class, 'delete'])
        ->name('admin.projectStatus.delete');


    //Tag
    Route::get('tags', [TagController::class, 'show'])
        ->name('admin.tags.list');

    Route::get('tags/create', [TagController::class, 'form'])
        ->name('admin.tags.form');

    Route::post('tags/store', [TagController::class, 'store'])
        ->name('admin.tags.store');

    Route::get('tags/getDetails/{id}', [TagController::class, 'getDetails'])
        ->name('admin.tags.getDetails');

    Route::get('tags/{tag}', [TagController::class, 'edit'])
        ->name('admin.tags.edit');

    Route::put('tags/{tag}', [TagController::class, 'update'])
        ->name('admin.tags.update');

    Route::delete('tags/{tag}', [TagController::class, 'delete'])
        ->name('admin.tags.delete');

    //Template
    Route::get('templates', [TemplateController::class, 'index'])
        ->name('admin.templates.list');

    Route::get('templates/create', [TemplateController::class, 'form'])
        ->name('admin.templates.form');

    Route::post('templates/store', [TemplateController::class, 'store'])
        ->name('admin.templates.store');

    Route::get('templates/getDetails/{id}', [TemplateController::class, 'getDetails'])
        ->name('admin.templates.getDetails');

    Route::get('templates/{template}', [TemplateController::class, 'edit'])
        ->name('admin.templates.edit');

    Route::put('templates/{template}', [TemplateController::class, 'update'])
        ->name('admin.templates.update');

    Route::delete('templates/{template}', [TemplateController::class, 'delete'])
        ->name('admin.templates.delete');

    //Project
    Route::get('projects', [ProjectController::class, 'index'])
        ->name('admin.projects.list');

    Route::get('projects/create', [ProjectController::class, 'form'])
        ->name('admin.projects.form');

    Route::post('projects/store', [ProjectController::class, 'store'])
        ->name('admin.projects.store');

    Route::get('projects/getDetails/{id}', [ProjectController::class, 'getDetails'])
        ->name('admin.projects.getDetails');

    Route::get('projects/{project}', [ProjectController::class, 'edit'])
        ->name('admin.projects.edit');

    Route::put('projects/{project}', [ProjectController::class, 'update'])
        ->name('admin.projects.update');

    Route::post('projects/{project}/terminate', [ProjectController::class, 'terminate'])
        ->name('admin.projects.terminate');
    
});