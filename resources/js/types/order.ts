export interface OrderFile {
    id: number;
    name: string;
    path: string;
    size: number;
    type: string;
    verified?: boolean;
}

export interface AllowedTransition {
    value: string;
    label: string;
}

export interface OrderHistoryEntry {
    id: number;
    status: string;
    created_at: string;
    user?: {
        id: number;
        name: string;
    };
}

export interface OrderNote {
    id: number;
    content: string;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
}

export interface OrderPatient {
    id: number;
    first_name: string;
    last_name: string;
}

export interface OrderEntity {
    id: number;
    name: string;
}

export interface FilterOption {
    value: string;
    label: string;
}

export interface OrderListItem {
    id: number;
    patient: { first_name: string; last_name: string };
    clinic?: { name: string };
    lab?: { name: string };
    service: { name: string };
    status: string;
    priority: string;
    due_date: string;
    created_at: string;
    is_overdue: boolean;
    days_remaining: number;
}
