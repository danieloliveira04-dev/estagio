<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    public const STATUS_ACTIVE  = 'active';
    public const STATUS_INACTIVE = 'inactive';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'photo',
        'roleId',
        'status',
        'invitationId',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isActive(): bool {
        return $this->status === self::STATUS_ACTIVE;
    }

    public function checkDeletionConstraints() {
        // Carrega projetos com membros e tarefas que ele gerencia
        $this->load([
            'projects' => function($query) {
                $query->with([
                    'members',
                    'tasks' => function($tasksQuery) {
                        $tasksQuery->where('pmUserId', $this->id);
                    }
                ]);
            }
        ]);

        $projectsData = $this->projects->map(function($project) {
            // Identifica papel do usuário nesse projeto
            $userMember = $project->members->firstWhere('userId', $this->id);

            return [
                'project' => $project,
                'roleId' => $userMember?->roleId,
                'tasks' => $project->tasks,
            ];
        });

        // Verifica se ele é o único gestor em algum projeto
        $projectsBlocked = $this->projects->filter(function ($project) {
            $managers = $project->members->filter(fn($member) => $member->roleId === Role::MANAGER);
            return $managers->count() === 1 && $managers->first()->userId === $this->id;
        });

        return [
            'isBlocked' => $projectsBlocked->isNotEmpty(),
            'blockedProjects' => $projectsBlocked,
            'projects' => $projectsData,
        ];
    }

    //--

    public function invitation()
    {
        return $this->belongsTo(Invitation::class, 'invitationId');
    }
    
    public function role() {
        return $this->belongsTo(Role::class, 'roleId');
    }

    public function projects() {
        return $this->belongsToMany(Project::class, 'projectsMembers', 'userId', 'projectId');
    }
}
