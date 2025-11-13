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