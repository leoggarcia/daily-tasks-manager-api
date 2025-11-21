FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# COPY FILES TO INSTALL DEPENDENCIES
COPY package*.json ./

# INSTALL DEPENDENCIES
RUN npm ci

# COPY THE REST OF THE CODE
COPY . .

# COMPILE THE PROJECT
RUN npm run build


FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

ENV PORT=3000

EXPOSE 3000

# COMAND TO EXCEUTE THE SERVICE
CMD ["node", "dist/main.js"]
