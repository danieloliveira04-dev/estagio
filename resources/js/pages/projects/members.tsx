import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useInitials } from "@/hooks/use-initials";
import { ProjectInviteMemberDialog } from "@/layouts/project/dialog/project-invite-member-dialog";
import ProjectLayout from "@/layouts/project/project-layout";
import { projectInvitationStatusColor } from "@/lib/colors";
import { projectInvitationStatusDescription } from "@/lib/descriptions";
import { capitalize, formatDate } from "@/lib/utils";
import projects from "@/routes/projects";
import { BreadcrumbItem, Project, PROJECT_INVITATION_STATUS, Role } from "@/types";
import { Edit, SquareX, UserPlus } from "lucide-react";
import { useState } from "react";

interface ProjectMembersProps {
    project: Project;
    roles: Role[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Projetos",
        href: projects.list().url,
    },
    {
        title: '',
        href: '',
    },
    {
        title: 'Membros',
        href: '',
    }
];

export default function ProjectMembers({project, roles} : ProjectMembersProps) {
    const getInitials = useInitials();

    const [inviteModal, setInviteModal] = useState(false);

    /** 📌 Abrir modal para convidar */
    const handleOpenInviteModal = () => {
        setInviteModal(true);
    };

    return (
        <ProjectLayout tab="members" breadcrumbs={breadcrumbs}>
            <h2 className="text-xl font-bold">Membros</h2>

            <div className="text-right mb-2">
                <Button onClick={handleOpenInviteModal}>
                    <UserPlus /> Adicionar membro
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-4/12">Membro</TableHead>
                        <TableHead className="w-4/12">Cargo</TableHead>
                        <TableHead className="w-2/12">E-mail</TableHead>
                        <TableHead className="w-2/12"></TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {project.members?.map(member => member.user && (
                        <TableRow key={member.userId}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="size-12 rounded-full">
                                        <AvatarImage src={member.user.photo} alt={member.user.name} />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(member.user.name)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div>
                                        <span className="block text-lg font-medium truncate -mb-1">{member.user.name}</span>
                                        <span className="text-muted-foreground">Desde {capitalize(formatDate(member.created_at, 'MMM yyyy'))}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge>{member.role?.name}</Badge>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {member.description}
                                </p>
                            </TableCell>
                            <TableCell>
                                {member.user.email}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-end gap-2 min-h-9">
                                    <Button size="icon" variant="outline" title="Editar">
                                        <Edit />
                                    </Button>

                                    <Button size="icon" variant="destructive" title="Remover membro">
                                        <SquareX />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <hr className="mt-6 mb-4" />

            <h3 className="text-lg font-bold">Convites</h3>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-4/12">Usuário</TableHead>
                        <TableHead className="w-3/12">Cargo</TableHead>
                        <TableHead className="w-3/12">Status</TableHead>
                        <TableHead className="w-2/12"></TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {project.invitations?.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3}>
                                <p className="text-muted-foreground text-md text-center py-3">
                                    Sem convites encontrados
                                </p>
                            </TableCell>
                        </TableRow>
                    )}

                    {project.invitations?.map(invitation => (
                        <TableRow key={invitation.id}>
                            <TableCell>
                                {invitation.user ? (
                                    <div className="flex items-center gap-3">
                                        <Avatar className="size-12 rounded-full">
                                            <AvatarImage src={invitation.user.photo} alt={invitation.user.name} />
                                            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                {getInitials(invitation.user.name)}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div>
                                            <span className="block text-lg font-medium truncate -mb-1">{invitation.user.name}</span>
                                            <span className="text-muted-foreground">{invitation.user.email}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="block text-lg font-medium truncate -mb-1">{invitation.invitation?.email}</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <Badge>{invitation.role?.name}</Badge>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {invitation.description}
                                </p>
                            </TableCell>
                            <TableCell>
                                <Badge className={projectInvitationStatusColor(invitation.status)}>{projectInvitationStatusDescription(invitation.status)}</Badge>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Convite enviado em {formatDate(invitation.created_at, "dd/MM/yyyy 'às' HH:mm")}
                                </p>
                            </TableCell>
                            <TableCell className="text-right">
                                {invitation.status === PROJECT_INVITATION_STATUS.PENDING && (
                                    <Button size="icon" variant="destructive" title="Cancelar">
                                        <SquareX />
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <ProjectInviteMemberDialog open={inviteModal} onOpenChange={setInviteModal} projectId={project.id} roles={roles} />
        </ProjectLayout>  
    );
}