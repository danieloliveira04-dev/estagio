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

import { Input } from '@/components/ui/input';

import {
    BreadcrumbItem,
    User,
} from '@/types';

import {
    Head,
    router,
} from '@inertiajs/react';

import {
    Search,
} from 'lucide-react';

import {
    useRef,
    useState,
} from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Relatórios',
        href: '#',
    },
    {
        title: 'Produtividade',
        href: '#',
    },
];

interface ProductivityItem {
    user: User;

    completedTasks: number;

    completedOnTime: number;

    lateTasks: number;

    averageCompletionTime: number;
}

interface Props {
    report: ProductivityItem[];

    filters: {
        search?: string;
    };
}

export default function ProductivityReport({
    report,
    filters,
}: Props) {

    const [search, setSearch] = useState(
        filters.search ?? ''
    );

    const timeout = useRef<
        ReturnType<typeof setTimeout> | null
    >(null);

    const handleSearch = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const value = e.target.value;

        setSearch(value);

        if (timeout.current) {
            clearTimeout(timeout.current);
        }

        timeout.current = setTimeout(() => {

            router.get(
                window.location.pathname,
                {
                    search: value,
                },
                {
                    preserveState: true,
                    replace: true,
                }
            );

        }, 500);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Relatório de produtividade" />

            <div className="px-4 py-6">

                <Heading
                    title="Relatório de produtividade"
                />

                <Table>

                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                Usuário
                            </TableHead>

                            <TableHead>
                                Concluídas
                            </TableHead>

                            <TableHead>
                                Dentro prazo
                            </TableHead>

                            <TableHead>
                                Atrasadas
                            </TableHead>

                            <TableHead>
                                Tempo médio
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
                                    {item.completedTasks}
                                </TableCell>

                                <TableCell>
                                    {item.completedOnTime}
                                </TableCell>

                                <TableCell>
                                    {item.lateTasks}
                                </TableCell>

                                <TableCell>
                                    {item.averageCompletionTime}h
                                </TableCell>

                            </TableRow>
                        ))}

                    </TableBody>

                </Table>
            </div>
        </AppLayout>
    );
}