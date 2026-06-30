import { useState, useEffect, useCallback } from 'react';
import { ticketsApi } from '../services/api';
import { Ticket, TicketFilter, PaginatedResponse } from '../types';

export const useTickets = (initialFilters: TicketFilter = {}) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 10,
    pages: 0,
  });
  const [filters, setFilters] = useState<TicketFilter>({
    ...initialFilters,
    page: 1,
    per_page: 10,
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ticketsApi.getAll(filters);
      const data = response.data;
      setTickets(data.data);
      setPagination({
        total: data.total,
        page: data.page,
        per_page: data.per_page,
        pages: data.pages,
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const updateFilters = useCallback((newFilters: Partial<TicketFilter>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page ?? 1,
    }));
  }, []);

  const createTicket = useCallback(async (data: TicketCreate) => {
    try {
      await ticketsApi.create(data);
      await fetchTickets();
      return null;
    } catch (err: any) {
      return err.response?.data?.detail || 'Failed to create ticket';
    }
  }, [fetchTickets]);

  const updateStatus = useCallback(async (id: number, status: TicketStatus) => {
    try {
      await ticketsApi.updateStatus(id, status);
      await fetchTickets();
      return null;
    } catch (err: any) {
      return err.response?.data?.detail || 'Failed to update status';
    }
  }, [fetchTickets]);

  const deleteTicket = useCallback(async (id: number) => {
    try {
      await ticketsApi.delete(id);
      await fetchTickets();
      return null;
    } catch (err: any) {
      return err.response?.data?.detail || 'Failed to delete ticket';
    }
  }, [fetchTickets]);

  return {
    tickets,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    createTicket,
    updateStatus,
    deleteTicket,
    refresh: fetchTickets,
  };
};