import React, { useState } from 'react';
import { TicketCreate, TicketPriority } from '../types';

interface TicketFormProps {
  onSubmit: (data: TicketCreate) => Promise<string | null>;
}

export const TicketForm: React.FC<TicketFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<TicketCreate>({
    title: '',
    description: '',
    priority: TicketPriority.NORMAL,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const error = await onSubmit(formData);
    if (error) {
      setError(error);
    } else {
      setFormData({ title: '', description: '', priority: TicketPriority.NORMAL });
    }
    setLoading(false);
  };

  return (
    <div className="ticket-form">
      <h3>Создать новую заявку</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Название"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          minLength={3}
          maxLength={120}
          required
        />
        <textarea
          placeholder="Описание (опционально)"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          maxLength={1000}
        />
        <select
          value={formData.priority}
          onChange={(e) => setFormData({ 
            ...formData, 
            priority: e.target.value as TicketPriority 
          })}
        >
          <option value={TicketPriority.LOW}>Low</option>
          <option value={TicketPriority.NORMAL}>Normal</option>
          <option value={TicketPriority.HIGH}>High</option>
        </select>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Создание...' : 'Создать заявку'}
        </button>
      </form>
    </div>
  );
};