export enum TicketStatus {
    NEW = 'new',
    IN_PROGRESS = 'in_progress',
    DONE = 'done'
}

export enum TicketPriority {
    LOW = 'low',
    NORMAL = 'normal',
    HIGH = 'high'
}

export interface Ticket {
    id: number;
    title: string;
    description?: string;
    status: TicketStatus;
    priority: TicketPriority;
    created_at: string;
    updated_at?: string;
}

export interface TicketCreate {
    title: string;
    description?: string;
    status?: TicketStatus;
    priority?: TicketPriority;
}

export interface TicketFilter {
    status?: TicketStatus;
    priority?: TicketPriority;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
}

export interface PaginatedResponse {
    data: Ticket[];
    total: number;
    page: number;
    per_page: number;
    pages: number;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    username: string;
}