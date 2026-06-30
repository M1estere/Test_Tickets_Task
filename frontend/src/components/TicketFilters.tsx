import React from 'react';
import { TicketStatus, TicketPriority, TicketFilter } from '../types';

interface TicketFiltersProps {
  filters: TicketFilter;
  onFilterChange: (filters: Partial<TicketFilter>) => void;
}

export const TicketFilters: React.FC<TicketFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="filters-container">
      <input
        type="text"
        placeholder="Найти по названию или описанию..."
        value={filters.search || ''}
        onChange={(e) => onFilterChange({ search: e.target.value })}
      />
      
      <select
        value={filters.status || ''}
        onChange={(e) => onFilterChange({ 
          status: e.target.value as TicketStatus || undefined 
        })}
      >
        <option value="">Все статусы</option>
        <option value={TicketStatus.NEW}>New</option>
        <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
        <option value={TicketStatus.DONE}>Done</option>
      </select>

      <select
        value={filters.priority || ''}
        onChange={(e) => onFilterChange({ 
          priority: e.target.value as TicketPriority || undefined 
        })}
      >
        <option value="">Все приоритеты</option>
        <option value={TicketPriority.LOW}>Low</option>
        <option value={TicketPriority.NORMAL}>Normal</option>
        <option value={TicketPriority.HIGH}>High</option>
      </select>

      <select
        value={filters.sort_by || 'created_at'}
        onChange={(e) => onFilterChange({ sort_by: e.target.value })}
      >
        <option value="created_at">Сортировать по дате</option>
        <option value="priority">Сортировать по приоритету</option>
      </select>

      <select
        value={filters.sort_order || 'desc'}
        onChange={(e) => onFilterChange({ 
          sort_order: e.target.value as 'asc' | 'desc' 
        })}
      >
        <option value="desc">По убыванию</option>
        <option value="asc">По возрастанию</option>
      </select>
    </div>
  );
};