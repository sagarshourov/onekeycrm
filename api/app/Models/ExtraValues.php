<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExtraValues extends Model
{

    protected $table = 'extra_values';
    public $timestamps = true;

    use SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'id', 'field', 'value', 'ext_id'
    ];


    public function ExtraGroups()
    {
        return $this->belongsTo(ExtraGroups::class, 'ext_id', 'id')->select('id', 'groups', 'call_id');
    }
}
