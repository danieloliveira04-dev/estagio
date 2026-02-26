import { INVITATION_STATUS } from "@/types";

export function projectInvitationStatusColor(status: string): string {
    switch(status) {
        case INVITATION_STATUS.PENDING:
            return "bg-amber-400 hover:bg-amber-400";
        case INVITATION_STATUS.ACCEPTED:
            return "bg-green-600 hover:bg-green-600";
        case INVITATION_STATUS.EXPIRED:
            return "bg-red-600 hover:bg-red-600";
        default:
            return "";
    }
}