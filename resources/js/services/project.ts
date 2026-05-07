import members from '@/routes/projects/members';
import api from './api';
import { ProjectMember } from '@/types';

export const getProjectMembersAutocomplete = (projectId: number, params?: Record<string, unknown>) => {
    return api.get<ProjectMember[]>(members.autocomplete({ project: projectId }).url, {
        params,
    });
};
