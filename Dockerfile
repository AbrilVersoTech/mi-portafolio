FROM node:24-alpine
WORKDIR /app
COPY . .
ENV PORT=80
EXPOSE 80
CMD ["node", "servidor-local.js"]
