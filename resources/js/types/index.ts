import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface FlashType {
    type: string;
    message: string;
    description?: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationResponse<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

export interface Role {
    id: number;
    name: string;
    type: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    roleId: number;
    status: string;
    phone?: string;
    photo?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;

    role?: Role;

    [key: string]: unknown; // This allows for additional properties...
};

export interface ProjectMember {
    id: number;
    projectId: number;
    userId: number;
    roleId: number;
    description?: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;

    user?: User;
    role?: Role;
};

export interface Project {
    id: number;
    name: string;
    description?: string;
    customerUserId?: number;
    projectStatusId: number;
    expectedEndAt?: Date;
    finishedAt?: Date;
    closeReason?: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;

    project_status?: ProjectStatus;
    customer?: User;
    members?: ProjectMember[];
    invitations?: ProjectInvitation[];
};

export const INVITATION_STATUS = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    EXPIRED: 'expired',
} as const;

export type InvitationStatus = typeof INVITATION_STATUS[keyof typeof INVITATION_STATUS];

export interface Invitation {
    id: number;
    expiredAt: Date;
    email: string;
    token: string;
    status: InvitationStatus;
    createdByUserId: number;

    created_by_user?: User;
};

export const PROJECT_INVITATION_STATUS = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    DECLINED: 'declined',
} as const;

export type ProjectInvitationStatus = typeof PROJECT_INVITATION_STATUS[keyof typeof PROJECT_INVITATION_STATUS];

export interface ProjectInvitation {
    id: number;
    projectId: number;
    userId?: number;
    invitationId?: number;
    roleId: number;
    description?: number;
    status: ProjectInvitationStatus;
    createdByUserId: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;

    user?: User;
    invitation?: Invitation;
    role?: Role;
    created_by_user?: User;
};

export interface Tag {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    taskStatusId: number;
    projectId: number;
    pmProjectId?: number;
    pmUserId?: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
};

export interface TaskStatus {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
};

export interface ProjectStatus {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
};

export interface TemplateColumn {
    id: number;
    name: string;
    templateId: number;
    taskStatusId?: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
};

export interface Template {
    id: number;
    name: string;
    columns?: TemplateColumn[];
    created_at: string;
    updated_at: string;
    deleted_at?: string;
};