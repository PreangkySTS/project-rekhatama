<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionHistory extends Model
{
    use HasFactory;

    protected $table = 'transaction_history';

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
        'status_id',
    ];

    /**
     * Relationship with User model.
     * One transaction belongs to one user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id'); // Pastikan kolom 'status_id' sesuai
    }
}