import { PropsWithChildren } from "react";
import AppLayout from '@/layouts/app-layout';
import { FlashType, Project, SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import projects from '@/routes/projects';
import Heading from '@/components/heading';
import Flash from '@/components/flash';
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppWindowIcon, Users } from 'lucide-react';
import { PageProps, router } from '@inertiajs/core';

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
    const getInitials = useInitials();
    const { project, flash, app } = usePage<ProjectLayoutPageProps>().props;

    breadcrumbs[1].title = project.name;
    breadcrumbs[1].href = breadcrumbs.length > 2 ? projects.show(project.id).url : '';

    const managers = project.members?.filter(u => u.roleId == app.roleManagerId);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Projeto - ${project.name}`} />
            
            <div className="px-4 py-6">
                <Flash flash={flash} className="mb-6" />
                
                <Heading title={project.name} description={project.description} />

                <div className="flex items-center gap-5 mb-2">
                    {project.customer && (
                        <div className="flex items-center gap-2">
                            <strong>Cliente:</strong>
                            <Avatar className="size-10 rounded-full">
                                <AvatarImage src={project.customer.photo} alt={project.customer.name} />
                                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                    {getInitials(project.customer.name)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    )}

                    {managers?.length ? (
                        <div className="flex items-center gap-2">
                            <strong>Gestores:</strong>
                            <AvatarGroup>
                                {managers.map(({user}) => user && (
                                    <Avatar className="size-10 rounded-full" key={user.id}>
                                        <AvatarImage src={user.photo} alt={user.name} />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                ))}
                            </AvatarGroup>
                        </div>
                    ) : null}
                </div>

                <Tabs defaultValue={tab} className="mb-2">
                    <TabsList variant="line">
                        <TabsTrigger value="preview" onClick={() => router.get(projects.show(project.id).url)}>
                            <AppWindowIcon />
                            Preview
                        </TabsTrigger>

                        <TabsTrigger value="members" onClick={() => router.get(projects.members(project.id).url)}>
                            <Users />
                            Membros
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <div>
                    {children}
                </div>
                
            </div>
        </AppLayout>
    );
}