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
        title: 'Prazos',
        href: '#',
    },
];

interface DeadlineItem {
    project: Project;

    completedOnTime: number;

    completedLate: number;

    complianceRate: number;

    status: string;
}

interface Props {
    report: DeadlineItem[];
}

export default function DeadlineAdherenceReport({
    report,
}: Props) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Relatório de aderência" />

            <div className="px-4 py-6">

                <Heading
                    title="Relatório de aderência a prazos"
                />

                <Table>

                    <TableHeader>
                        <TableRow>

                            <TableHead>
                                Projeto
                            </TableHead>

                            <TableHead>
                                No prazo
                            </TableHead>

                            <TableHead>
                                Atrasadas
                            </TableHead>

                            <TableHead>
                                Taxa
                            </TableHead>

                            <TableHead>
                                Status
                            </TableHead>

                        </TableRow>
                    </TableHeader>

                    <TableBody>

                        {report.map((item) => (
                            <TableRow
                                key={item.project.id}
                            >

                                <TableCell>
                                    {item.project.name}
                                </TableCell>

                                <TableCell>
                                    {item.completedOnTime}
                                </TableCell>

                                <TableCell>
                                    {item.completedLate}
                                </TableCell>

                                <TableCell>
                                    {item.complianceRate}%
                                </TableCell>

                                <TableCell>
                                    <Badge>
                                        {item.status}
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