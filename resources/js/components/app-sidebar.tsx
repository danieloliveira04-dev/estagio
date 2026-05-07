import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, FolderKanban, LayoutGrid, LayoutTemplate, ListChecks, Tags, User, UserCog } from 'lucide-react';
import AppLogo from './app-logo';
import users from '@/routes/admin/users';
import roles from '@/routes/admin/roles';
import taskStatus from '@/routes/admin/taskStatus';
import projectStatus from '@/routes/admin/projectStatus';
import tags from '@/routes/admin/tags';
import templates from '@/routes/admin/templates';
import projects from '@/routes/admin/projects';
import dashboard from '@/routes/admin/dashboard';
import reports from '@/routes/admin/reports';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.index(),
        icon: LayoutGrid,
    },
    {
        title: 'Usuários',
        href: users.list().url,
        icon: User,
    },
    {
        title: 'Perfis',
        href: roles.list().url,
        icon: UserCog,
    },
    {
        title: 'Status da tarefa',
        href: taskStatus.list().url,
        icon: ListChecks,
    },
    {
        title: 'Status do projeto',
        href: projectStatus.list().url,
        icon: ListChecks,
    },
    {
        title: 'Tags',
        href: tags.list().url,
        icon: Tags,
    },
    {
        title: 'Modelos',
        href: templates.list().url,
        icon: LayoutTemplate,
    },
    {
        title: 'Projetos',
        href: projects.list().url,
        icon: FolderKanban,
    },
    {
        title: 'Relatórios',
        href: '#',
        icon: FolderKanban,
        items: [
            {
                title: 'Produtividade',
                href: reports.productivity.index().url,
            },
            {
                title: 'Alocação de recursos',
                href: reports.resourceAllocation.index().url,
            },
            {
                title: 'Aderência a prazos',
                href: reports.deadlineAdherence.index().url,
            },
        ],
    }
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            render={<Link href={dashboard.index()} prefetch><AppLogo /></Link>}
                            size="lg"
                        />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
