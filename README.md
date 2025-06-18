# Проект: Сервер расписания (Backend)

## Описание

REST API на **Node.js** + **Express** с использованием **TypeScript**, предназначенный для хранения, управления и аутентификации сотрудников и их расписания. Использует PostgreSQL в качестве БД и `iron-session` для хранения сессий. [Клиент (Frontend)](https://github.com/SollWar/work-schedule-client/)

## Основные возможности

* 📦 CRUD-операции для сущностей: сотрудники (`worker`), рабочие места (`workplace`), расписания (`schedule`).
* 🔒 Хеширование паролей через `bcrypt`.
* 🌐 CORS-политика для взаимодействия с фронтендом.
* 📥 Поддержка переменных окружения через `dotenv`.

## Технологии

* **Язык**: TypeScript
* **Сервер**: Express v5
* **База данных**: PostgreSQL (pg)
* **Сессии**: iron-session
* **Пароли**: bcrypt
* **Cookies**: cookie-parser
* **CORS**: cors
* **Переменные окружения**: dotenv

## Структура проекта

```
work-schedule-server-main/
├─ src/
│  ├─ config/          # Настройки окружения и подключения к БД
│  ├─ controllers/     # Логика обработки запросов
│  ├─ models/          # ORM-модели и интерфейсы TypeScript
│  └─ server.ts        # Точка входа приложения
├─ .gitignore
├─ package.json
└─ tsconfig.json
```
