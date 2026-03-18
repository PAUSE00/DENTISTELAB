export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: 'dentist' | 'lab_owner' | 'lab_tech' | 'clinic_staff' | 'super_admin';
    clinic_id?: number;
    lab_id?: number;
    locale?: string;
    clinic?: Clinic;
    lab?: Lab;
}

export interface Patient {
    id: number;
    clinic_id: number;
    first_name: string;
    last_name: string;
    dob: string;
    phone: string;
    email?: string;
    external_id?: string;
    medical_notes?: string;
    blood_group?: string;
    allergies?: string;
    medical_history?: string;
    created_at: string;
    updated_at: string;
}

export type OrderStatus = 'new' | 'in_progress' | 'fitting' | 'finished' | 'shipped' | 'delivered' | 'rejected' | 'archived';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid';
export type Priority = 'normal' | 'urgent';

export interface Order {
    id: number;
    clinic_id: number;
    lab_id: number;
    patient_id: number;
    service_id: number;
    status: OrderStatus;
    priority: Priority;
    due_date: string;
    created_at: string;
    updated_at: string;
    teeth: number[];
    shade: string;
    material: string;
    instructions: string | null;
    price: number;
    final_price: number | null;
    payment_status: PaymentStatus;
    rejection_reason: string | null;
    is_overdue?: boolean;
    days_remaining?: number;
    // Relationships
    patient?: Patient;
    lab?: Lab;
    clinic?: Clinic;
    service?: Service;
    files?: OrderFile[];
    history?: OrderStatusHistory[];
}

export interface Lab {
    id: number;
    name: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    logo_path?: string;
    subscription_plan?: string;
    services?: Service[];
    created_at: string;
    updated_at: string;
}

export interface Clinic {
    id: number;
    name: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    logo_path?: string;
    created_at: string;
    updated_at: string;
}

export interface Service {
    id: number;
    lab_id: number;
    name: string;
    description?: string;
    price: number;
    production_days: number;
    created_at: string;
    updated_at: string;
}

export interface OrderFile {
    id: number;
    order_id: number;
    name: string;
    path: string;
    size: number;
    type: string;
    verified?: boolean;
    created_at: string;
}

export interface OrderStatusHistory {
    id: number;
    order_id: number;
    status: OrderStatus;
    changed_by_user_id?: number;
    created_at: string;
}

export interface Message {
    id: number;
    order_id: number;
    user_id: number;
    content: string;
    is_read: boolean;
    attachment_path?: string;
    created_at: string;
    user?: User;
}

export interface Notification {
    id: number;
    type: string;
    data: Record<string, unknown>;
    read_at: string | null;
    created_at: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash: {
        success: string | null;
        error: string | null;
    };
    locale: string;
};
