import { Button } from '@/components/ui/button';
import { ProjectColumnDialog } from '@/layouts/project/dialog/project-column-dialog';
import { ProjectColumnDeleteAlertDialog } from '@/layouts/project/dialog/project-column-delete-alert-dialog';
import ProjectColumn from '@/layouts/project/project-column';
import ProjectLayout from '@/layouts/project/project-layout';
import projects from '@/routes/projects';
import { BreadcrumbItem, FlashType, Project, ProjectColumn as ProjectColumnType, Task as TaskType, SharedData, Tag, TaskStatus } from '@/types';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { moveColumn } from '@/actions/App/Http/Controllers/ProjectController';
import { ProjectTaskDialog } from '@/layouts/project/dialog/project-task-dialog';
import { ProjectTaskDeleteAlertDialog } from '@/layouts/project/dialog/project-task-delete-alert-dialog';

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

export default function ProjectShow({ project, taskStatus, tags }: ProjectShowProps) {

    const [columnModal, setColumnModal] = useState(false);
    const [deleteColumnModal, setDeleteColumnModal] = useState(false);

    const [taskModal, setTaskModal] = useState(false);
    const [deleteTaskModal, setDeleteTaskModal] = useState(false);

    const [column, setColumn] = useState<ProjectColumnType>();
    const [task, setTask] = useState<Partial<TaskType>>();

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

    return (
        <ProjectLayout tab="preview" breadcrumbs={breadcrumbs}>

            <div className="pl-4 h-full overflow-auto" style={{maxHeight: 'calc(100vh - 175px)'}}>
                <div className="flex gap-4 py-4">
                    {project.columns?.map((column) => (
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
