import React, { useState } from 'react';
import { authApi } from '../services/api';

interface LoginProps {
  onLogin: (token: string, isAdmin: boolean) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Регистрация
      if (isRegistering) {
        await authApi.register(username, password);
        setError('Регистрация прошла успешно, войдите в профиль.');
        setIsRegistering(false);
        setLoading(false);
        return;
      }
      
      // Логин
      const response = await authApi.login(username, password);
      const { access_token, is_admin } = response.data;
      localStorage.setItem('admin_token', access_token);
      localStorage.setItem('is_admin', String(is_admin));
      onLogin(access_token, is_admin);
    } catch (err: any) {
      setError(err.response?.data?.detail || (isRegistering ? 'Регистрация не пройдена' : 'Не удалось войти'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? 'Регистрация' : 'Логин'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : (isRegistering ? 'Регистрация' : 'Логин')}
        </button>
      </form>
      <p>
        <button 
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError('');
          }} 
          className="link-btn"
        >
          {isRegistering ? 'Назад к логину' : 'Создать новый аккаунт'}
        </button>
      </p>
    </div>
  );
};