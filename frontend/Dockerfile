FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests first for layer caching
COPY package.json package-lock.json* ./

RUN npm install

# Copy the rest of the source
COPY . .

EXPOSE 5173

# Vite dev server – bind to 0.0.0.0 so it is reachable from outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
