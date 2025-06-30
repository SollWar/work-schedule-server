# Этап сборки
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Компилируем TypeScript
RUN npm run build

# Этап продакшн
FROM node:18-alpine

WORKDIR /app

# Копируем только необходимые файлы
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Устанавливаем зависимости для продакшн
RUN npm install --production

# Открываем порт
EXPOSE 3011

# Запускаем сервер
CMD ["node", "dist/server.js"]
