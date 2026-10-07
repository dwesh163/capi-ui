FROM oven/bun:1-slim AS deps
WORKDIR /app
# better-sqlite3 has no prebuilt binary to fetch here, so it is compiled against Node 22 (the runner's
# runtime): the Bun image needs a node binary and a toolchain for node-gyp.
COPY --from=node:22-slim /usr/local/bin/node /usr/local/bin/node
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

FROM oven/bun:1-slim AS builder
WORKDIR /app
# Real Node for `next build` (the Bun image's own `node` is a shim around Bun).
COPY --from=node:22-slim /usr/local/bin/node /usr/local/bin/node
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN bunx prisma generate
# Placeholders so modules that read the environment at import time can be evaluated while Next
# collects page data. Inline on this command, so they never reach the image.
RUN BETTER_AUTH_SECRET=build-time-placeholder \
    BETTER_AUTH_URL=http://localhost:3000 \
    DATABASE_URL=file:/tmp/build.db \
    node node_modules/.bin/next build

FROM node:22-slim AS runner
WORKDIR /app
RUN groupadd --system --gid 1001 nodejs && useradd --system --uid 1001 --gid nodejs nextjs \
    && mkdir /data && chown nextjs:nodejs /data
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME="0.0.0.0" DATABASE_URL=file:/data/app.db
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# Prisma CLI + config to apply migrations at startup.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/src/prisma ./src/prisma
USER nextjs
VOLUME /data
EXPOSE 3000
CMD ["sh", "-c", "node node_modules/prisma/build/index.js migrate deploy && node server.js"]
