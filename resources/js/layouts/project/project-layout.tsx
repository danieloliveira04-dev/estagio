import { PropsWithChildren } from "react";
import AppLayout from '@/layouts/app-layout';
import { FlashType, Project, SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import projects from '@/routes/projects';
import Flash from '@/components/flash';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppWindowIcon, Users } from 'lucide-react';
import { PageProps, router } from '@inertiajs/core';
import { Separator } from "@/components/ui/separator";

interface ProjectLayoutProps extends PageProps {
    tab?: string;
    breadcrumbs: BreadcrumbItem[];
}

interface ProjectLayoutPageProps extends PageProps {
    project: Project;
    flash?: FlashType;
    app: SharedData;
}

export default function ProjectLayout({ children, tab, breadcrumbs }: PropsWithChildren<ProjectLayoutProps>) {
    const { project, flash } = usePage<ProjectLayoutPageProps>().props;

    breadcrumbs[1].title = project.name;
    breadcrumbs[1].href = breadcrumbs.length > 2 ? projects.show(project.id).url : '';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Projeto - ${project.name}`} />
            
            <div className="px-4 pt-2">
                <Flash flash={flash} className="mb-6" />
                
                <div className="mb-1">
                    <span className="text-xs text-muted-foreground">Projeto</span>
                    <h1 className="text-lg font-bold -mt-1">{project.name}</h1>
                </div>

                <Tabs defaultValue={tab} className="mb-2">
                    <TabsList variant="line" className="[&>button]:cursor-pointer">
                        <TabsTrigger value="preview" onClick={() => router.get(projects.show(project.id).url)}>
                            <AppWindowIcon />
                            Kanban
                        </TabsTrigger>

                        <TabsTrigger value="members" onClick={() => router.get(projects.members(project.id).url)}>
                            <Users />
                            Membros
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            
            <Separator className="-mt-2" />

            {children}
        </AppLayout>
    );
}