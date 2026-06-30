import React from 'react';
import { Ticket, TicketFilter } from '../types';
import { TicketCard } from './TicketCard';
import { TicketFilters } from './TicketFilters';
import { TicketForm } from './TicketForm';

interface TicketListProps {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  filters: TicketFilter;
  pagination: {
    total: number;
    page: number;
    per_page: number;
    pages: number;
  };
  isAdmin: boolean;
  onFilterChange: (filters: Partial<TicketFilter>) => void;
  onCreateTicket: (data: any) => Promise<string | null>;
  onStatusChange: (id: number, status: string) => Promise<string | null>;
  onDeleteTicket: (id: number) => Promise<string | null>;
}

export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  loading,
  error,
  filters,
  pagination,
  isAdmin,
  onFilterChange,
  onCreateTicket,
  onStatusChange,
  onDeleteTicket,
}) => {
  if (loading && tickets.length === 0) {
    return <div className="loading">Загрузка заявок...</div>;
  }

  if (error && tickets.length === 0) {
    return <div className="error">Ошибка: {error}</div>;
  }

  return (
    <div className="ticket-list">
      <TicketForm onSubmit={onCreateTicket} />
      
      <TicketFilters filters={filters} onFilterChange={onFilterChange} />
      
      {tickets.length === 0 ? (
        <div className="empty-state">
          {filters.search || filters.status || filters.priority
            ? 'Нет заявок по вашим фильтрам'
            : 'Еще нет заявок'}
        </div>
      ) : (
        <>
          <div className="tickets-grid">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                isAdmin={isAdmin}
                onStatusChange={onStatusChange}
                onDelete={onDeleteTicket}
              />
            ))}
          </div>
          
          <div className="pagination">
            <button
              onClick={() => onFilterChange({ page: pagination.page - 1 })}
              disabled={pagination.page <= 1}
            >
              Пред.
            </button>
            <span>
              Стр {pagination.page} из {pagination.pages}<br/>
              (Всего: {pagination.total})
            </span>
            <button
              onClick={() => onFilterChange({ page: pagination.page + 1 })}
              disabled={pagination.page >= pagination.pages}
            >
              След.
            </button>
          </div>
        </>
      )}
    </div>
  );
};