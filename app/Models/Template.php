<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Template extends Model
{
    use SoftDeletes;

    protected $table = 'templates';

    protected $fillable = ['name'];

    //--

    public function columns() {
        return $this->hasMany(TemplateColumn::class, 'templateId');
    }

}
