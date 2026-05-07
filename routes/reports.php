<?php

use App\Http\Controllers\Admin\Reports\DeadlineAdherenceReportController;
use App\Http\Controllers\Admin\Reports\ProductivityReportController;
use App\Http\Controllers\Admin\Reports\ResourceAllocationReportController;

Route::prefix('admin/reports')->middleware('auth')
    ->name('admin.reports.')
    ->group(function () {

        Route::get(
            '/productivity',
            [ProductivityReportController::class, 'index']
        )->name('productivity.index');

        Route::get(
            '/resource-allocation',
            [ResourceAllocationReportController::class, 'index']
        )->name('resource-allocation.index');

        Route::get(
            '/deadline-adherence',
            [DeadlineAdherenceReportController::class, 'index']
        )->name('deadline-adherence.index');
        
    });