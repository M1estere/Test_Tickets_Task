import React from 'react';
import { Ticket, TicketStatus } from '../types';

interface TicketCardProps {
  ticket: Ticket;
  isAdmin: boolean;
  onStatusChange: (id: number, status: TicketStatus) => Promise<string | null>;
  onDelete: (id: number) => Promise<string | null>;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  isAdmin,
  onStatusChange,
  onDelete,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (ticket.status === TicketStatus.DONE) {
      setError('Нельзя изменить статус');
      return;
    }
    setLoading(true);
    setError('');
    const error = await onStatusChange(ticket.id, newStatus);
    if (error) setError(error);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (ticket.status === TicketStatus.DONE) {
      setError('Нельзя удалить заявку');
      return;
    }
    if (!confirm(`Удалить заявку "${ticket.title}"?`)) {
      return;
    }
    setLoading(true);
    setError('');
    const error = await onDelete(ticket.id);
    if (error) setError(error);
    setLoading(false);
  };

  const getStatusColor = (status: TicketStatus) => {
    const colors = {
      [TicketStatus.NEW]: '#007bff',
      [TicketStatus.IN_PROGRESS]: '#ffc107',
      [TicketStatus.DONE]: '#28a745',
    };
    return colors[status];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: '#28a745',
      normal: '#ffc107',
      high: '#dc3545',
    };
    return colors[priority as keyof typeof colors] || '#6c757d';
  };

  return (
    <div className="ticket-card">
      <div className="ticket-header">
        <h4>{ticket.title}</h4>
        <span className="status-badge" style={{ backgroundColor: getStatusColor(ticket.status) }}>
          {ticket.status}
        </span>
      </div>
      
      {ticket.description && (
        <p className="ticket-description">{ticket.description}</p>
      )}
      
      <div className="ticket-meta">
        <span className="priority-badge" style={{ backgroundColor: getPriorityColor(ticket.priority) }}>
          {ticket.priority}
        </span>
        <span>Создано: {new Date(ticket.created_at).toLocaleDateString()}</span>
        {ticket.updated_at && (
          <span>Обновлено: {new Date(ticket.updated_at).toLocaleDateString()}</span>
        )}
      </div>

      <div className="ticket-actions">
        <select
          value={ticket.status}
          onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
          disabled={loading || ticket.status === TicketStatus.DONE}
        >
          <option value={TicketStatus.NEW}>New</option>
          <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
          <option value={TicketStatus.DONE}>Done</option>
        </select>
        
        {isAdmin && (
          <button
            onClick={handleDelete}
            disabled={loading || ticket.status === TicketStatus.DONE}
            className="delete-btn"
          >
            Удалить
          </button>
        )}
      </div>
      
      {error && <div className="error">{error}</div>}
    </div>
  );
};