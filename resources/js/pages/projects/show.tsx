import { Button } from '@/components/ui/button';
import { ProjectColumnDialog } from '@/layouts/project/dialog/project-column-dialog';
import { ProjectColumnDeleteAlertDialog } from '@/layouts/project/dialog/project-column-delete-alert-dialog';
import ProjectColumn from '@/layouts/project/project-column';
import ProjectLayout from '@/layouts/project/project-layout';
import projects from '@/routes/projects';
import { BreadcrumbItem, FlashType, Project, ProjectColumn as ProjectColumnType, Task as TaskType, SharedData, Tag, TaskStatus } from '@/types';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { moveColumn, moveTask } from '@/actions/App/Http/Controllers/ProjectController';
import { ProjectTaskDialog } from '@/layouts/project/dialog/project-task-dialog';
import { ProjectTaskDeleteAlertDialog } from '@/layouts/project/dialog/project-task-delete-alert-dialog';
import { DragDropProvider } from "@dnd-kit/react";

interface ProjectShowProps {
    project: Project;
    taskStatus: TaskStatus[];
    tags: Tag[];
    flash?: FlashType;
    app: SharedData;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Projetos",
        href: projects.list().url,
    },
    {
        title: '',
        href: '',
    }
];

export default function ProjectShow({ project: initialProject, taskStatus, tags }: ProjectShowProps) {
    const [project, setProject] = useState(initialProject);

    const [columnModal, setColumnModal] = useState(false);
    const [deleteColumnModal, setDeleteColumnModal] = useState(false);

    const [taskModal, setTaskModal] = useState(false);
    const [deleteTaskModal, setDeleteTaskModal] = useState(false);

    const [column, setColumn] = useState<ProjectColumnType>();
    const [task, setTask] = useState<Partial<TaskType>>();

    useEffect(() => {
        setProject(initialProject);
    }, [initialProject]);

    const handleEditColumn = (column: ProjectColumnType) => {
        setColumn(column);
        setColumnModal(true);
    };

    const handleCreateColumn = () => {
        setColumn(undefined);
        setColumnModal(true);
    };

    const handleDeleteColumn = (column: ProjectColumnType) => {
        setColumn(column);
        setDeleteColumnModal(true);
    };

    const handleMoveColumn = (column: ProjectColumnType, move: number) => {
        const newPosition = column.position + move;

        // if (newPosition < 0 || newPosition >= (project.columns?.length || 0)) {
        //     return;
        // }

        router.post(moveColumn({project: project.id, column: column.id}).url, {
            position: newPosition,
        }, {
            preserveScroll: true,
        });
    };
    
    //--

    const handleCreateTask = (column?: ProjectColumnType) => {
        setTask({ projectColumnId: column?.id });
        setTaskModal(true);
    };

    const handleEditTask = (task: TaskType) =>  {
        setTask(task);
        setTaskModal(true);
    };

    const handleDeleteTask = (task: TaskType) => {
        setTask(task);
        setDeleteTaskModal(true);
    }

    const handleMoveTask = (taskId: number, toColumnId: number, toPosition: number) => {
        router.post(moveTask({ project: project.id, task: taskId }), {projectColumnId: toColumnId, position: toPosition}, {
            preserveScroll: true,
            preserveState: true,
        });
    }

    return (
        <ProjectLayout tab="preview" breadcrumbs={breadcrumbs}>

            <div className="pl-4 h-full overflow-auto" style={{maxHeight: 'calc(100vh - 175px)'}}>
                <div className="flex gap-4 py-4">
                    <DragDropProvider
                        onDragEnd={(event) => {
                            const { source, target } = event.operation;

                            if(!source || !target) {
                                return;
                            }

                            const taskId = source.id as number;
                            const toColumnId = target.data.columnId;
                            const toTaskPosition = target.data.position;

                            handleMoveTask(taskId, toColumnId, toTaskPosition);
                        }}
                        onDragOver={(event) => {
                            const { source, target } = event.operation;

                            if(!source || !target) {
                                return;
                            }

                            const taskId = source.id;
                            const toTaskPosition = target.data.position;
                            const fromColumnId = source.data.columnId;
                            const toColumnId = target.data.columnId;

                            // const fromTaskPosition = source.data.position;
                            // console.log(`Dropped ${fromColumnId}/${fromTaskPosition} onto ${toColumnId}/${toTaskPosition}`);

                            setProject(prev => {
                                const task = prev.columns
                                    .find(c => c.id === fromColumnId)
                                    ?.tasks.find(t => t.id === taskId);

                                console.log(task, fromColumnId);

                                if (!task) return prev;

                                const movedTask = {
                                    ...task,
                                    projectColumnId: toColumnId,
                                };

                                const columns = prev.columns.map(col => {
                                    if (toColumnId === fromColumnId && col.id === toColumnId) {
                                        const newTasks = [...col.tasks].filter(t => t.id !== taskId);

                                        newTasks.splice(toTaskPosition, 0, movedTask);

                                        return {
                                            ...col,
                                            tasks: newTasks.map((t, index) => ({
                                                ...t,
                                                position: index + 1,
                                            })),
                                        };
                                    }

                                    if (col.id === fromColumnId) {
                                        return {
                                            ...col,
                                            tasks: col.tasks
                                                .filter(t => t.id !== taskId)
                                                .map((t, index) => ({
                                                    ...t,
                                                    position: index + 1,
                                                })),
                                        };
                                    }

                                    if (col.id === toColumnId) {
                                        const newTasks = [...col.tasks];

                                        newTasks.splice(toTaskPosition, 0, movedTask);

                                        return {
                                            ...col,
                                            tasks: newTasks.map((t, index) => ({
                                                ...t,
                                                position: index + 1,
                                            })),
                                        };
                                    }

                                    return col;
                                });

                                return {
                                    ...prev,
                                    columns,
                                };
                            });
                        }}
                    >
                        {project.columns.map((column) => (
                            <ProjectColumn 
                                key={column.id}
                                column={column} 
                                onEdit={handleEditColumn}
                                onDelete={handleDeleteColumn}
                                onMove={handleMoveColumn}
                                onTaskCreate={handleCreateTask}
                                onTaskEdit={handleEditTask}
                                onTaskDelete={handleDeleteTask}
                            />
                        ))}
                    </DragDropProvider>

                    <Button type="button" variant="outline" className="sticky top-0 justify-start min-w-[240px]" onClick={handleCreateColumn}>
                        <Plus />
                        Adicionar coluna
                    </Button>
                </div>
            </div>

            <ProjectColumnDialog open={columnModal} onOpenChange={setColumnModal} projectId={project.id} column={column} taskStatus={taskStatus} />
            <ProjectColumnDeleteAlertDialog open={deleteColumnModal} onOpenChange={setDeleteColumnModal} column={column} />

            <ProjectTaskDialog open={taskModal} onOpenChange={setTaskModal} projectId={project.id} tags={tags} task={task as TaskType} />
            <ProjectTaskDeleteAlertDialog open={deleteTaskModal} onOpenChange={setDeleteTaskModal} task={task as TaskType} />
        </ProjectLayout>
    );
}
