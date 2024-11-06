<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // Jika menggunakan soft deletes

class Transaction extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'perusahaan',
        'quadrant',
        'pic',
        'jabatan',
        'progress',
    ];

    /**
     * Relationship with User model.
     * One transaction belongs to one user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Boot method to handle model events.
     */
    protected static function boot()
    {
        parent::boot();

        // Event saat update data
        static::updating(function ($transaction) {
            // Simpan data ke transaction_history dengan status_id 2 (updated)
            DB::table('transaction_history')->insert([
                'user_id'    => $transaction->user_id,
                'perusahaan' => $transaction->perusahaan,
                'quadrant'   => $transaction->quadrant,
                'pic'        => $transaction->pic,
                'jabatan'    => $transaction->jabatan,
                'progress'   => $transaction->progress,
                'status_id'  => 2, // status updated
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });

        // Event saat delete data
        static::deleting(function ($transaction) {
            // Simpan data ke transaction_history dengan status_id 3 (deleted)
            DB::table('transaction_history')->insert([
                'user_id'    => $transaction->user_id,
                'perusahaan' => $transaction->perusahaan,
                'quadrant'   => $transaction->quadrant,
                'pic'        => $transaction->pic,
                'jabatan'    => $transaction->jabatan,
                'progress'   => $transaction->progress,
                'status_id'  => 3, // status deleted
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });
    }
}
