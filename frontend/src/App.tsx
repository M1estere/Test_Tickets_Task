import React, { useState } from 'react';
import { Login } from './components/Login';
import { TicketList } from './components/TicketList';
import { useTickets } from './hooks/useTickets';
import './index.css';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('admin_token'));

  const {
    tickets,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    createTicket,
    updateStatus,
    deleteTicket,
  } = useTickets();

  const handleLogin = (token: string, isAdmin: boolean) => {
    setToken(token);
    setIsAdmin(isAdmin);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('is_admin');
    setToken(null);
    setIsAdmin(false);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Система Управления Заявками</h1>
        <div className="header-actions">
          <span>{isAdmin ? 'Админ' : 'Пользователь'}</span>
          <button onClick={handleLogout} className="logout-btn">
            Выйти
          </button>
        </div>
      </header>
      
      <main>
        <TicketList
          tickets={tickets}
          loading={loading}
          error={error}
          filters={filters}
          pagination={pagination}
          isAdmin={isAdmin}
          onFilterChange={updateFilters}
          onCreateTicket={createTicket}
          onStatusChange={updateStatus}
          onDeleteTicket={deleteTicket}
        />
      </main>
    </div>
  );
}

export default App;