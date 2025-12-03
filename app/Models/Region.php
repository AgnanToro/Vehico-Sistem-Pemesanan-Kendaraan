<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    protected $fillable = ['name', 'address'];

    public function offices()
    {
        return $this->hasMany(Office::class);
    }
}
