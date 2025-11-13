<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TemplateColumn extends Model
{
    use SoftDeletes;

    protected $table = 'templateColumns';

    protected $fillable = ['name', 'templateId', 'taskStatusId'];

    //--

    public function template() {
        return $this->belongsTo(Template::class, 'templateId');
    }

}
