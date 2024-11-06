<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;

class Status extends Model
{
    use HasFactory;

    protected $table = 'statuses';

    // Disable mass assignment for 'name' to prevent new inserts
    protected $guarded = [];

    // Override delete method to prevent deletion
    public function delete()
    {
        // Prevent deletion by throwing an exception or returning false
        throw new \Exception('Data in statuses table cannot be deleted.');
    }

    // Prevent insertion of new records by listening for the creating event
    protected static function booted()
    {
        static::creating(function ($model) {
            throw new \Exception('Inserting new data into statuses table is not allowed.');
        });
    }

    protected $fillable = ['name'];
}