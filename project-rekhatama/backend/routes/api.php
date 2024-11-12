<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TransactionController;
use SebastianBergmann\CodeCoverage\Util\Percentage;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::middleware('auth:sanctum')->group(function () {
    // transaksi
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::put('/transactions/{id}', [TransactionController::class, 'update']);
    Route::delete('/transactions/{id}', [TransactionController::class, 'destroy']);

    // buat pdf
    Route::get('/export-transactions-pdf', [TransactionController::class, 'exportPDF']);

    // history
    Route::get('/transactions/status/{statusId}', [TransactionController::class, 'getTransactionsByStatus']);

    // persentase transaksi semua users (manejemen/admin)
    Route::get('/transactions/total-percentages-daily', [TransactionController::class, 'transactionTotalPercentagesDaily']); //harian
    Route::get('/transactions/total-percentages-monthly', [TransactionController::class, 'transactionTotalPercentagesMonthly']); //bulanan
    Route::get('/transactions/total-percentages-yearly', [TransactionController::class, 'transactionTotalPercentagesYearly']); //tahunan

    // persentase transaksi setiap users (sales)
    Route::get('/transactions/total-percentages-daily-user', [TransactionController::class, 'transactionTotalPercentagesDailyUsers']); //harian
    Route::get('/transactions/total-percentages-monthly-user', [TransactionController::class, 'transactionTotalPercentagesMonthlyUsers']); //bulanan
    Route::get('/transactions/total-percentages-yearly-user', [TransactionController::class, 'transactionTotalPercentagesYearlyUsers']); //tahunan

    Route::get('/transactions/quadrant-sales-percentages', [TransactionController::class, 'quadrantPercentagesSales']); //semua transaksi sales yang login
    Route::get('transactions/total-quadrant-percentages', [TransactionController::class, 'quadrantPercentagesTotal']); //total semua transaksi sales (admin/manejemen)
    Route::get('transactions/quadrant-percentages', [TransactionController::class, 'quadrantPercentages']); //semua transaksi setiap sales
});

// register
Route::post('/register', [UserController::class, 'store']); //tambah users

// users
Route::get('/users', [UserController::class, 'index']);  // get semua users
Route::get('/users/{id}', [UserController::class, 'show']);  //get user pake id
Route::put('/users/{id}', [UserController::class, 'update']);  //edit
Route::delete('/users/{id}', [UserController::class, 'destroy']); //hapus user
Route::post('/login', [AuthController::class, 'login']); // login


// roles
Route::post('/roles', [UserController::class, 'storeRole']);
Route::put('/roles/{id}', [UserController::class, 'updateRole']);
Route::delete('/roles/{id}', [UserController::class, 'destroyRole']);
Route::get('/roles', [UserController::class, 'indexRole']);
Route::get('roles/percentages', [UserController::class, 'rolePercentages']); //persentase role
