import { Button } from '@/components/ui/button';
import { ProjectColumnDialog } from '@/layouts/project/dialog/project-column-dialog';
import { ProjectColumnDeleteAlertDialog } from '@/layouts/project/dialog/project-column-delete-alert-dialog';
import ProjectColumn from '@/layouts/project/project-column';
import ProjectLayout from '@/layouts/project/project-layout';
import projects from '@/routes/projects';
import { BreadcrumbItem, FlashType, Project, ProjectColumn as ProjectColumnType, SharedData, TaskStatus } from '@/types';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { moveColumn } from '@/actions/App/Http/Controllers/ProjectController';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface ProjectShowProps {
    project: Project;
    taskStatus: TaskStatus[];
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

export default function ProjectShow({ project, taskStatus }: ProjectShowProps) {

    const [columnModal, setColumnModal] = useState(false);
    const [deleteColumnModal, setDeleteColumnModal] = useState(false);

    const [column, setColumn] = useState<ProjectColumnType>();

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

    return (
        <ProjectLayout tab="preview" breadcrumbs={breadcrumbs}>
            {/* <pre>{JSON.stringify(project, null, 2)}</pre> */}

            <ScrollArea className="h-screen -mb-6 pt-6 pb-6 -mr-4" >
                <div className="flex gap-4">            
                    {project.columns?.map((column) => (
                        <ProjectColumn 
                            key={column.id}
                            column={column} 
                            onEdit={handleEditColumn}
                            onDelete={handleDeleteColumn}
                            onMove={handleMoveColumn}
                        />
                    ))}

                    <Button type="button" variant="outline" className="sticky top-0 justify-start min-w-[240px]" onClick={handleCreateColumn}>
                        <Plus />
                        Adicionar coluna
                    </Button>
                </div>

                <ScrollBar orientation="vertical" className="z-50" />
                <ScrollBar orientation="horizontal" />
            </ScrollArea>


            <ProjectColumnDialog open={columnModal} onOpenChange={setColumnModal} projectId={project.id} column={column} taskStatus={taskStatus} />
            <ProjectColumnDeleteAlertDialog open={deleteColumnModal} onOpenChange={setDeleteColumnModal} column={column} />
        </ProjectLayout>
    );
}
