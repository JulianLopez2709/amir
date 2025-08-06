export interface StatusConfig {
    text: string;
    color: 'purple' | 'orange' | 'blue' | 'green' | 'red' | 'gray';
    tailwindClasses: {
        bg: string;
        text: string;
        border: string;
    };
}

export const STATUS_CONFIG: Record<string, StatusConfig> = {
    NEW: {
        text: 'Nuevo',
        color: 'purple',
        tailwindClasses: {
            bg: 'bg-purple-100',
            text: 'text-purple-800',
            border: 'border-purple-500',
        }
    },
    PENDING: {
        text: 'Nuevo',
        color: 'purple',
        tailwindClasses: {
            bg: 'bg-purple-100',
            text: 'text-purple-800',
            border: 'border-purple-500',
        }
    },
    IN_PROGRESS: {
        text: 'En Progreso',
        color: 'orange',
        tailwindClasses: {
            bg: 'bg-orange-100',
            text: 'text-orange-800',
            border: 'border-orange-500',
        }
    },
    READY: {
        text: 'Listo para Entregar',
        color: 'blue',
        tailwindClasses: {
            bg: 'bg-blue-100',
            text: 'text-blue-800',
            border: 'border-blue-500',
        }
    },
    COMPLETED: {
        text: 'Finalizado',
        color: 'green',
        tailwindClasses: {
            bg: 'bg-green-100',
            text: 'text-green-800',
            border: 'border-green-500',
        }
    },
    CANCELED: {
        text: 'Cancelado',
        color: 'red',
        tailwindClasses: {
            bg: 'bg-red-100',
            text: 'text-red-800',
            border: 'border-red-500',
        }
    },
    DEFAULT: {
        text: 'Desconocido',
        color: 'gray',
        tailwindClasses: {
            bg: 'bg-gray-100',
            text: 'text-gray-800',
            border: 'border-gray-500',
        }
    },
    EXPENSE: {
        text: 'Gasto',
        color: 'gray',
        tailwindClasses: {
            bg: 'bg-gray-100',
            text: 'text-gray-800',
            border: 'border-gray-500',
        }
    },
};