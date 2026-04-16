<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaskHistory extends Model
{
    use SoftDeletes;

    public const ACTION_CREATED = 'created';                 // tarefa criada
    public const ACTION_UPDATED = 'updated';                 // tarefa atualizada (genérico)
    public const ACTION_STATUS_CHANGED = 'status_changed';   // status/coluna alterado
    public const ACTION_ASSIGNED = 'assigned';               // tarefa atribuída a um usuário
    public const ACTION_UNASSIGNED = 'unassigned';           // tarefa removida de um usuário
    public const ACTION_REASSIGNED = 'reassigned';           // tarefa reatribuída
    public const ACTION_COMMENTED = 'commented';             // comentário adicionado
    public const ACTION_PRIORITY_CHANGED = 'priority_changed'; // prioridade alterada
    public const ACTION_DUE_DATE_CHANGED = 'due_date_changed'; // data de entrega alterada
    public const ACTION_ARCHIVED = 'archived';               // tarefa arquivada
    public const ACTION_RESTORED = 'restored';               // tarefa restaurada
    public const ACTION_DELETED = 'deleted';                 // tarefa excluída

    protected $table = 'taskHistory';

    protected $fillable = ['id', 'taskId', 'startDate', 'endDate', 'taskStatusId', 'projectMemberId', 'userId', 'action', 'description'];

    //--

    public function tasks() {
        return $this->belongsTo(Task::class, 'id', 'taskStatusId');
    }

    public function assignee() {
        return $this->belongsTo(ProjectMember::class, 'projectMemberId');
    }
}
