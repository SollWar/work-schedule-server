# Проект: Клиент рассписания (Frontend)

## Описание

Одностраничное приложение на **Next.js**, предназначенное для отображения и управления рабочим расписанием сотрудников. Приложение позволяет просматривать календарь, переключаться между рабочими местами и датами, а также отправлять изменения на сервер.

## Технологии

* **Фреймворк**: Next.js (App Router)
* **Язык**: TypeScript
* **Стили**: Tailwind CSS
* **Состояние**: Zustand
* **UI-компоненты**: Radix UI (Dropdown, Dialog)

## Структура проекта

```
work-schedule-client-main/
├─ app/
│  ├─ components/      # React-компоненты (Calendar, BottomBar, TopBar и пр.)
│  ├─ hooks/           # Кастомные хуки для работы с API и состоянием
│  ├─ globals.css      # Глобальные стили Tailwind
│  └─ favicon.ico
├─ public/             # Статические файлы
├─ next.config.js      # Конфигурация Next.js
├─ tsconfig.json       # Конфигурация TypeScript
├─ package.json        # Скрипты и зависимости
└─ postcss.config.mjs  # Конфигурация PostCSS
```
