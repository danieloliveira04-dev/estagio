import { Button } from '@/components/ui/button';
import { ProjectColumnDialog } from '@/layouts/project/dialog/project-column-dialog';
import { ProjectColumnDeleteAlertDialog } from '@/layouts/project/dialog/project-column-delete-alert-dialog';
import ProjectColumn from '@/layouts/project/project-column';
import ProjectLayout from '@/layouts/project/project-layout';
import projects from '@/routes/projects';
import { BreadcrumbItem, FlashType, Project, ProjectColumn as ProjectColumnType, SharedData, TaskStatus } from '@/types';
import { Plus } from 'lucide-react';
import { useState } from 'react';

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
    }

    return (
        <ProjectLayout tab="preview" breadcrumbs={breadcrumbs}>
            {/* <pre>{JSON.stringify(project, null, 2)}</pre> */}

            <div className="flex gap-4 overflow-x-auto pb-4 pr-4 -mr-4">            
                {project.columns?.map((column) => (
                    <ProjectColumn 
                        key={column.id}
                        column={column} 
                        onEdit={handleEditColumn}
                        onDelete={handleDeleteColumn}
                    />
                ))}

                <Button type="button" variant="outline" className="justify-start min-w-[240px]" onClick={handleCreateColumn}>
                    <Plus />
                    Adicionar coluna
                </Button>
            </div>
            
            <ProjectColumnDialog open={columnModal} onOpenChange={setColumnModal} projectId={project.id} column={column} taskStatus={taskStatus} />
            <ProjectColumnDeleteAlertDialog open={deleteColumnModal} onOpenChange={setDeleteColumnModal} column={column} />
        </ProjectLayout>
    );
}
