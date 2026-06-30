# Система управления заявками

## Технологии

### Backend
- Python
- FastAPI
- SQLAlchemy
- SQLite
- Uvicorn
- Pydantic

### Frontend
- React
- TypeScript
- Vite
- Axios

## Запуск

Бэкенд
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Фронтенд
```bash
cd frontend
npm install
npm run dev
```

## Документация
После подъема сервисов документация api будет доступна по адресу http://localhost:8000/docs/, там расписаны все эндпоинты системы, из основных:

    - POST /api/auth/register - Регистрация пользователя
    - POST /api/auth/login - Авторизация пользователя
    - GET /api/tickets/ - Получение списка заявок
    - POST /api/tickets/ - Создание заявки
    - PATCH	/api/tickets/{id}/status - Изменение статуса заявки
    - DELETE /api/tickets/{id} - Удаление заявки (только для админа)

## Описание системы
### Бизнес-правила
- Заявка в статусе done не может быть отредактирована или удалена
- Нельзя перевести заявку из done обратно в другой статус
- При нарушении правил API возвращает осмысленный HTTP-ответ с описанием ошибки

### Аккаунты
- Администратор (admin admin, уже существует в системе)
- Пользователи (возможно создать через регистрацию)