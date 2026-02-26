import { PROJECT_INVITATION_STATUS } from "@/types";

export function roleTypeDescription(type: string): string {
    switch (type) {
        case 'profile':
            return 'Perfil';
        case 'function':
            return 'Função';
        default:
            return 'Desconhecido';
    }
}

export function projectInvitationStatusDescription(status: string): string {
    switch(status) {
        case PROJECT_INVITATION_STATUS.PENDING:
            return 'Pendente';
        case PROJECT_INVITATION_STATUS.ACCEPTED:
            return 'Aceito';
        case PROJECT_INVITATION_STATUS.DECLINED:
            return 'Recusado';
        default:
            return 'Desconhecido';
    }
}