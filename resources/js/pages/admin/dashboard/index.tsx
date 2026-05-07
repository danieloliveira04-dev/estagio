import { TaskHistoryItem } from '@/components/task-history-item';
import AppLayout from '@/layouts/app-layout';
import { formatNumber, formatPercentage } from '@/lib/utils';
import dashboard from '@/routes/admin/dashboard';
import { getMetrics } from '@/services/dashboard';
import { DashboardMetrics, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { isToday } from 'date-fns';
import { AlarmClock, ArrowDown, ArrowUp, BadgeCheck, Check, ClipboardList, FolderKanban } from 'lucide-react';
import { ElementType, ReactNode, useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.index().url,
    },
];

export default function Dashboard() {
    const [data, setData] = useState<DashboardMetrics>();

    useEffect(() => {
        const getData = async () => {
            const response = await getMetrics();
            setData(response.data);
        };

        getData();
    }, []);

    if(!data) {
        return 'Carregando...';
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="p-8">
                <div className="grid grid-cols-4 gap-7">
                    <DashboardCard 
                        title="Projetos Ativos"
                        icon={FolderKanban}
                        value={data.activeProjects.value}
                        percentage={renderChange(data.activeProjects.change)}
                        percentageClass={getChangeColor(data.activeProjects.change.type)}
                        subtitle="v.s. mês anterior"
                    />

                    <DashboardCard 
                        title="Tarefas em Aberto"
                        icon={ClipboardList}
                        value={data.openTasks.value}
                        percentage={renderChange(data.openTasks.change)}
                        percentageClass={getChangeColor(data.openTasks.change.type)}
                        subtitle="v.s. mês anterior"
                    />

                    <DashboardCard 
                        title="Prazos Hoje"
                        icon={AlarmClock}
                        value={data.tasksDueToday.total}
                        subtitle={`${data.tasksDueToday.completed} de ${data.tasksDueToday.total} tarefas concluídas`}
                    />

                    <DashboardCard 
                        title="Conclusão Semanal"
                        icon={BadgeCheck}
                        value={formatPercentage(data.tasksCompletionWeek.rate)}
                        percentage={<><Check className="mr-0.5" /> Meta</>}
                        percentageClass="text-green-500"
                        subtitle={`${data.tasksCompletionWeek.completed} de ${data.tasksCompletionWeek.total} tarefas concluídas`}
                    />
                </div>

                <div className="grid grid-cols-12 gap-7 mt-7">
                    <div className="p-5 rounded-2xl shadow-lg border col-span-8">
                        <div className="mb-5">
                            <h2 className="text-base text-black">Evolução do Projeto</h2>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data.weeklyChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <XAxis
                                    dataKey="week"
                                    tickFormatter={(value, index) => {
                                        const item = data.weeklyChart[index];
                                        return `Sem ${item.week} / ${item.year.toString().substring(2)}`;
                                    }}
                                    tick={{ fontSize: 11, fill: "#9ca3af" }} // menor + cinza suave
                                    axisLine={false} // remove linha do eixo
                                    tickLine={false} // remove risquinhos
                                    padding={{ left: 10, right: 10 }} // menos espaçamento lateral
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={30} // mais compacto
                                />

                                <Tooltip
                                    labelFormatter={(value, payload) => {
                                        const item = payload?.[0]?.payload;
                                        if (!item) return "";
                                        return `Sem ${item.week}`;
                                    }}
                                    contentStyle={{
                                        borderRadius: "8px",
                                        border: "1px solid #e5e7eb",
                                        fontSize: "12px",
                                    }}
                                />

                                <CartesianGrid
                                    stroke="#e5e7eb" // cinza bem leve
                                    strokeDasharray="4 4"
                                    vertical={false} // remove linhas verticais (fica mais clean)
                                />

                                <Line
                                    type="monotone"
                                    dataKey="scope"
                                    stroke="#cbd5e1"
                                    strokeDasharray="5 5"
                                    name="Escopo"
                                />

                                <Line
                                    type="monotone"
                                    dataKey="done"
                                    stroke="#7c3aed"
                                    strokeWidth={3}
                                    dot={false}
                                    name="Realizado"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="p-5 rounded-2xl shadow-lg border col-span-4">
                        <div className="mb-5">
                            <h2 className="text-base text-black">Tarefas Críticas</h2>
                        </div>

                        <div className="max-h-[300px] overflow-auto">
                            {data.criticalTasks.map((task) => {
                                const isOverdue = task.endDate ? new Date(task.endDate) < new Date() : false;
                                const isDueToday = task.endDate ? isToday(new Date(task.endDate)) : false;
                                
                                return (
                                    <div key={task.id} className="p-4 rounded-sm transition cursor-pointer hover:bg-primary/5">
                                        <span className="text-xs font-medium text-muted-foreground tracking-widest">{task.code}</span>
                                        <h3 className="text-sm font-medium text-black mb-2">{task.title}</h3>
                                        <div className="flex items-center gap-2.5">
                                            {/* <Badge className="text-red-700 bg-red-700/10 uppercase">Crítica</Badge> */}
                                            {isOverdue && (
                                                <span className="text-xs text-red-700">
                                                    Atrasado
                                                </span>
                                            )}

                                            {!isOverdue && isDueToday && (
                                                <span className="text-xs text-yellow-700">
                                                    Vence hoje
                                                </span>
                                            )}

                                            {!isOverdue && !isDueToday && (
                                                <span className="text-xs text-neutral">
                                                    Próximo prazo
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl shadow-lg border col-span-8">
                        <div className="mb-5">
                            <h2 className="text-base text-black">Performance da Equipe</h2>
                        </div>

                        <div className="-mx-5">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="text-xs font-bold uppercase text-neutral bg-neutral/10 px-6 py-3 text-left">Membro</th>
                                        <th className="text-xs font-bold uppercase text-neutral bg-neutral/10 px-6 py-3 text-center w-12">Tarefas</th>
                                        <th className="text-xs font-bold uppercase text-neutral bg-neutral/10 px-6 py-3 text-left">Workload</th>
                                        <th className="text-xs font-bold uppercase text-neutral bg-neutral/10 px-6 py-3 text-center w-12">Index</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        data.teamPerformance.map((item) => (
                                            <tr key={item.id} className="shadow-2xs">
                                                <td className="text-sm font-medium text-black px-6 py-3">{item.name}</td>
                                                <td className="text-sm text-center text-neutral px-6 py-3">{item.tasks}</td>
                                                <td className="px-6 py-3">
                                                    <div className="relative w-full h-1.5 rounded-full bg-neutral/20 overflow-hidden">
                                                        <div className="absolute top-0 left-0 h-full bg-primary" style={{width: item.workload + '%'}}></div>
                                                    </div>
                                                </td>
                                                <td className="text-sm text-bold text-center px-6 py-3">{formatNumber(item.index, { decimals: 1 })}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>

                        </div>
                    </div>

                    <div className="p-5 rounded-2xl shadow-lg border col-span-4">
                        <div className="mb-5">
                            <h2 className="text-base text-black">Atividade Recente</h2>
                        </div>

                        <div className="space-y-2 [&>*]:last-of-type:pb-0! h-full overflow-auto">
                            {data.recentActivities.map(item => (
                                <TaskHistoryItem key={item.id} taskHistory={item} />
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}

interface DashboardCardProps {
    title: string;
    value: string | number;
    percentage?: ReactNode;
    percentageClass?: string;
    icon?: ElementType;
    subtitle?: string;
}

function DashboardCard({
    title,
    value,
    percentage,
    percentageClass,
    icon: Icon,
    subtitle,
}: DashboardCardProps) {
    return (
        <div className="p-5 rounded-2xl shadow-lg border">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-md font-medium text-neutral">
                    {title}
                </h2>

                <div className={`size-9 rounded-sm flex items-center justify-center bg-primary/10 text-primary`}>
                    {Icon && <Icon className="size-6" />}
                </div>
            </div>

            <div>
                <div className="flex items-end gap-2">
                    <p className="text-3xl text-black">
                        {value}
                    </p>

                    {percentage && (
                        <span className={`inline-flex items-center mb-1 text-sm font-semibold [&>svg]:size-3 ${percentageClass}`}>
                            {percentage}
                        </span>
                    )}
                </div>

                <p className="text-sm text-neutral">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}

function renderChange(change: {value: number, type: 'neutral' | 'increase' | 'decrease'}) {
    if (!change) return null;

    if (change.type === 'neutral') return null;

    if (change.type === 'increase') {
        return <><ArrowUp /> {change.value}%</>;
    }

    if (change.type === 'decrease') {
        return <><ArrowDown /> {change.value}%</>;
    }

    return <>{change.value}%</>;
}

function getChangeColor(type: 'neutral' | 'increase' | 'decrease') {
    switch (type) {
        case 'increase': return 'text-green-500';
        case 'decrease': return 'text-red-500';
        default: return '';
    }
}