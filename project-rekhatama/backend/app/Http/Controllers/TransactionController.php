<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\TransactionHistory;
use App\Models\Status;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf as FacadePdf;

// ieu ge pull
class TransactionController extends Controller
{
    // post
    public function store(Request $request)
    {
        if (Auth::user()->role->level != 1) {
            return response()->json(['message' => 'Unauthorized access'], 403);
        }

        // Validasi data
        $request->validate([
            'perusahaan' => 'required|string|max:255',
            'quadrant'=> 'required|integer|max:255',
            'pic'=> 'required|string|max:255',
            'jabatan'=> 'required|string|max:255',
            'progress'=> 'required|string|max:255',
        ]);

        // inset data ke tabel history pake user_id
        $transactionHistory = TransactionHistory::create([
            'user_id' => Auth::id(),// Mengambil user_id dari user yang sedang login
            'perusahaan'  => $request->perusahaan,
            'quadrant' => $request->quadrant,
            'pic' => $request->pic,
            'jabatan' => $request->jabatan,
            'progress' => $request->progress,
            'status_id'=> 1,
        ]);

        // Insert data ke tabel transactions pake user_id dari auth /atau bearer token
        $transaction = Transaction::create([
            'user_id' => Auth::id(),// Mengambil user_id dari user yang sedang login
            'perusahaan'  => $request->perusahaan,
            'quadrant' => $request->quadrant,
            'pic' => $request->pic,
            'jabatan' => $request->jabatan,
            'progress' => $request->progress,
        ]);

        return response()->json(['message' => 'Transaction created successfully', 'transaction' => $transaction], 201);
    }

    // put
    public function update(Request $request, $id)
    {
        if (Auth::user()->role->level != 1) {
            return response()->json(['message' => 'Unauthorized access'], 403);
        }
        // Validasi data
        $request->validate([
            'perusahaan' => 'required|string|max:255',
            'quadrant'=> 'required|integer|max:255',
            'pic'=> 'required|string|max:255',
            'jabatan'=> 'required|string|max:255',
            'progress'=> 'required|string|max:255',
        ]);

        // Temukan user berdasarkan ID
        $transaction = Transaction::findOrFail($id);

        if ($transaction->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized access to update this transaction'], 403);
        }

        // Update data user
        $transaction->perusahaan = $request->perusahaan;
        $transaction->quadrant = $request->quadrant;
        $transaction->pic = $request->pic;
        $transaction->jabatan = $request->jabatan;
        $transaction->progress = $request->progress;
        $transaction->save(); // Simpan perubahan

        return response()->json(['message' => 'transaksi diperbarui', 'transaction' => $transaction], 200);
    }

    // delete
    public function destroy($id)
    {
        if (Auth::user()->role->level != 1) {
            return response()->json(['message' => 'Unauthorized access'], 403);
        }
        // Temukan user berdasarkan ID
        $transaction = Transaction::findOrFail($id);

        // Hapus user dari database
        $transaction->delete();

        return response()->json(['message' => 'data deleted successfully'], 200);
    }

    // get
    public function index()
    {
        $transactions = Transaction::where('user_id', Auth::id())->get();

    // Memisahkan tanggal menjadi tanggal, bulan, dan tahun
    $transactions->transform(function($transaction) {
        // Pastikan ada kolom created_at atau transaksi_date untuk diolah
        $transaction->day = $transaction->created_at->day; // Ambil hari
        $transaction->month = $transaction->created_at->month; // Ambil bulan
        $transaction->year = $transaction->created_at->year; // Ambil tahun

        // Jika ingin format custom
        $transaction->formatted_date = $transaction->created_at->format('Y-m-d'); // Format tanggal

        return $transaction;
    });

    // Kembalikan data transaksi dalam format JSON
    return response()->json(['transactions' => $transactions], 200);
    }

    public function getTransactionsByStatus($statusId)
{
    // Ambil transaksi berdasarkan status_id dan user_id
    $transactions = DB::table('transaction_history')
                      ->where('status_id', $statusId)
                      ->where('user_id', Auth::id())
                      ->get();

    // Format tanggal transaksi menggunakan Carbon
    $transactions->transform(function($transaction) {
        // Pastikan ada kolom created_at
        $transaction->day = Carbon::parse($transaction->created_at)->day; // Mengambil tanggal
        $transaction->month = Carbon::parse($transaction->created_at)->month; // Mengambil bulan
        $transaction->year = Carbon::parse($transaction->created_at)->year; // Mengambil tahun
        $transaction->formatted_date = Carbon::parse($transaction->created_at)->format('Y-m-d'); // Format tanggal

        return $transaction;
    });

    return response()->json(['transactions' => $transactions], 200);
}


    // ekspor ke pdf
    public function exportPDF()
    {
        // Ambil data transaksi dari pengguna yang login
        $transactions = Transaction::where('user_id', Auth::id())->get();

        // Muat tampilan PDf di folder pdf/transactions.blade.php
        $pdf = FacadePdf::loadView('pdf.transactions', compact('transactions'));

        // downlaod PDF
        return $pdf->download('user-transactions.pdf');
    }

    // persentase
public function quadrantPercentagesSales()
{
    $userId = Auth::id();

    // 1. Persentase quadrant untuk user yang login
    $userTotalTransactions = Transaction::where('user_id', $userId)->count();

    $userQuadrantCounts = Transaction::select('quadrant', DB::raw('count(*) as count'))
        ->where('user_id', $userId)
        ->groupBy('quadrant')
        ->pluck('count', 'quadrant')
        ->toArray();

    $userPercentages = [];
    foreach ([1, 2, 3, 4] as $quadrant) {
        $userPercentages[$quadrant] = isset($userQuadrantCounts[$quadrant])
            ? ($userQuadrantCounts[$quadrant] / $userTotalTransactions) * 100
            : 0;
    }

    return response()->json([
        'Transaction_percentages' => $userPercentages
    ]);
}

public function quadrantPercentagesTotal()
{
    if (!in_array(Auth::user()->role->level, [10, 9])) {
            return response()->json(['message' => 'Unauthorized access'], 403);
        }

    $totalTransactions = Transaction::count();

    $totalQuadrantCounts = Transaction::select('quadrant', DB::raw('count(*) as count'))
        ->groupBy('quadrant')
        ->pluck('count', 'quadrant')
        ->toArray();

    $totalPercentages = [];
    foreach ([1, 2, 3, 4] as $quadrant) {
        $totalPercentages[$quadrant] = isset($totalQuadrantCounts[$quadrant])
            ? ($totalQuadrantCounts[$quadrant] / $totalTransactions) * 100
            : 0;
    }

    return response()->json([
        'total_percentages' => $totalPercentages
    ]);
}

public function quadrantPercentages()
{
    $usersQuadrantPercentages = [];

    $allUsersTransactions = Transaction::select('user_id', 'quadrant', DB::raw('count(*) as count'))
        ->groupBy('user_id', 'quadrant')
        ->get();

    $userTransactionCounts = Transaction::select('user_id', DB::raw('count(*) as total'))
        ->groupBy('user_id')
        ->pluck('total', 'user_id')
        ->toArray();

    foreach ($allUsersTransactions as $transaction) {
        $userId = $transaction->user_id;
        $quadrant = $transaction->quadrant;

        if (!isset($usersQuadrantPercentages[$userId])) {
            $usersQuadrantPercentages[$userId] = [1 => 0, 2 => 0, 3 => 0, 4 => 0];
        }

        $userTotal = $userTransactionCounts[$userId] ?? 1;
        $usersQuadrantPercentages[$userId][$quadrant] = ($transaction->count / $userTotal) * 100;
    }

    return response()->json([
        'users_quadrant_percentages' => $usersQuadrantPercentages
    ]);
}

public function transactionTotalPercentagesDaily()
    {
        $today = Carbon::today();
        return $this->calculateQuadrantPercentages($today, 'day');
    }

    public function transactionTotalPercentagesMonthly()
    {
        $currentMonth = Carbon::now()->startOfMonth();
        return $this->calculateQuadrantPercentages($currentMonth, 'month');
    }

    public function transactionTotalPercentagesYearly()
    {
        $currentYear = Carbon::now()->startOfYear();
        return $this->calculateQuadrantPercentages($currentYear, 'year');
    }

    private function calculateQuadrantPercentages($startDate, $period)
    {
        $endDate = $period === 'day' ? Carbon::today()->endOfDay() :
                   ($period === 'month' ? Carbon::now()->endOfMonth() : Carbon::now()->endOfYear());

        $totalTransactions = DB::table('transactions')
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->count();

        $quadrantCounts = DB::table('transactions')
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->select('quadrant', DB::raw('count(*) as count'))
            ->groupBy('quadrant')
            ->pluck('count', 'quadrant')
            ->toArray();

        $percentages = [];
        foreach ([1, 2, 3, 4] as $quadrant) {
            $percentages[$quadrant] = isset($quadrantCounts[$quadrant])
                ? ($quadrantCounts[$quadrant] / $totalTransactions) * 100
                : 0;
        }

        return response()->json([
            'period' => $period,
            'start_date' => $startDate->toDateString(),
            'end_date' => $endDate->toDateString(),
            'percentages' => $percentages
        ]);
    }
}
