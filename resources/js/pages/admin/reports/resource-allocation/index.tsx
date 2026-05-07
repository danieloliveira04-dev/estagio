import AppLayout from '@/layouts/app-layout';

import Heading from '@/components/heading';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';

import {
    BreadcrumbItem,
    Project,
    User,
} from '@/types';

import {
    Head,
} from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Relatórios',
        href: '#',
    },
    {
        title: 'Alocação',
        href: '#',
    },
];

interface ProjectDistribution {
    project: Project;

    tasksCount: number;
}

interface ResourceItem {
    user: User;

    tasksCount: number;

    completedTasks: number;

    pendingTasks: number;

    projectsDistribution: ProjectDistribution[];

    workloadStatus: string;
}

interface Props {
    report: ResourceItem[];
}

export default function ResourceAllocationReport({
    report,
}: Props) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Relatório de alocação" />

            <div className="px-4 py-6">

                <Heading
                    title="Relatório de alocação"
                />

                <Table>

                    <TableHeader>
                        <TableRow>

                            <TableHead>
                                Usuário
                            </TableHead>

                            <TableHead>
                                Total tarefas
                            </TableHead>

                            <TableHead>
                                Concluídas
                            </TableHead>

                            <TableHead>
                                Pendentes
                            </TableHead>

                            <TableHead>
                                Projetos
                            </TableHead>

                            <TableHead>
                                Situação
                            </TableHead>

                        </TableRow>
                    </TableHeader>

                    <TableBody>

                        {report.map((item) => (
                            <TableRow key={item.user.id}>

                                <TableCell>
                                    {item.user.name}
                                </TableCell>

                                <TableCell>
                                    {item.tasksCount}
                                </TableCell>

                                <TableCell>
                                    {item.completedTasks}
                                </TableCell>

                                <TableCell>
                                    {item.pendingTasks}
                                </TableCell>

                                <TableCell>

                                    <div className="flex flex-col gap-1">

                                        {item.projectsDistribution.map((project) => (
                                            <span key={project.project.id}>

                                                {project.project.name}
                                                {' '}
                                                ({project.tasksCount})

                                            </span>
                                        ))}

                                    </div>

                                </TableCell>

                                <TableCell>

                                    <Badge
                                        variant={
                                            item.workloadStatus === 'Sobrecarga'
                                                ? 'destructive'
                                                : item.workloadStatus === 'Ocioso'
                                                    ? 'secondary'
                                                    : 'default'
                                        }
                                    >
                                        {item.workloadStatus}
                                    </Badge>

                                </TableCell>

                            </TableRow>
                        ))}

                    </TableBody>

                </Table>

            </div>
        </AppLayout>
    );
}