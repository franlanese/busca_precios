# Imagen oficial de Playwright con todo lo necesario
FROM mcr.microsoft.com/playwright:v1.57.0-jammy

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos dependencias primero (optimiza cache)
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Puerto que usa tu app (cambialo si no es 3000)
EXPOSE 4500

# Comando para iniciar la app
CMD ["npm", "start"]
