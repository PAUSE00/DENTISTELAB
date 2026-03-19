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

export interface OrderPayment {
    id: number;
    amount: number;
    payment_method: string;
    notes: string | null;
    paid_at: string;
    recorded_by?: {
        id: number;
        name: string;
    };
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
    price: number | null;
    paid_amount: number;
    payment_status: string;
    remaining_balance: number;
}

export interface Order {
    id: number;
    status: string;
    priority: string;
    due_date: string;
    created_at: string;
    teeth: number[] | null;
    shade: string | null;
    material: string | null;
    instructions: string | null;
    rejection_reason: string | null;
    patient: { id: number; first_name: string; last_name: string };
    clinic: { id: number; name: string };
    lab: { id: number; name: string; email?: string };
    service: { id: number; name: string; price: number };
    files: OrderFile[];
    history: OrderHistoryEntry[];
    notes: OrderNote[];
    payments: OrderPayment[];
    price: number | null;
    final_price: number | null;
    paid_amount: number;
    payment_status: string;
    remaining_balance: number;
    is_fully_paid: boolean;
    is_overdue: boolean;
    days_remaining: number;
}
