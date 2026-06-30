import axios from 'axios';
import { Ticket, TicketCreate, TicketFilter, PaginatedResponse, TicketStatus } from '../types';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginResponse {
  access_token: string;
  token_type: string;
  username: string;
  is_admin: boolean;
}

export const ticketsApi = {
  create: (data: TicketCreate) => 
    api.post<Ticket>('/tickets', data),
  
  getAll: (filters: TicketFilter) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.sort_order) params.append('sort_order', filters.sort_order);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.per_page) params.append('per_page', String(filters.per_page));
    
    return api.get<PaginatedResponse>(`/tickets?${params}`);
  },
  
  updateStatus: (id: number, status: TicketStatus) =>
    api.patch<Ticket>(`/tickets/${id}/status`, { status }),
  
  delete: (id: number) =>
    api.delete(`/tickets/${id}`),
};

export const authApi = {
  login: (username: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { username, password }),
  
  register: (username: string, password: string) =>
    api.post<{ message: string; username: string }>('/auth/register', { username, password }),
};