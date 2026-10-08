FROM oven/bun:1 as base
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

EXPOSE 3000
CMD ["bun", "run", "dev", "--host", "0.0.0.0", "--port", "3000"]
