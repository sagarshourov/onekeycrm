<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExtraGroups extends Model
{

    protected $table = 'extra_groups';
    public $timestamps = true;

    use SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'id', 'groups', 'call_id', 'user_id', 'created_at'
    ];

    public function next()
    {
        return $this->hasMany(ExtraValues::class, 'ext_id', 'id')->select('id', 'ext_id', 'field', 'value');
    }


    public function values()
    {
        return $this->hasMany(ExtraValues::class, 'ext_id', 'id')->select('id', 'ext_id', 'field', 'value');
    }
    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id')->select('id', 'first_name', 'last_name', 'is_admin');
    }

    public function calls()
    {
        return $this->hasOne(Calls::class, 'id', 'call_id')->select('id', 'first_name', 'last_name');
    }


    public function extraValues()
    {
        return $this->hasMany(ExtraValues::class, 'ext_id', 'id')->select('id', 'ext_id', 'field', 'value');
    }

  


    public function call()
    {
        return $this->belongsTo(Calls::class,'call_id','id');
    }
}
