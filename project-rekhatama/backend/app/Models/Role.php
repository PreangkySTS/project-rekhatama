<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'role_name',
        'level',
    ];

    /**
     * Relationship with User model.
     * One role has many users.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
