FROM node:18 AS base

#
# 1. Ladataan npm:llä vaaditut moduulit
#
FROM base AS deps
WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
COPY prisma/schema.prisma /usr/src/app/prisma/schema.prisma
RUN npm ci && npm cache clean --force

#
# 2. Buildataan next.js projekti
#
FROM base AS builder
WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

RUN npm run build

#
# 3. Suoritetaan buildattu next.js projekti
#
FROM base AS runner
WORKDIR /usr/src/app

COPY --from=builder --chown=node:node /usr/src/app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder --chown=node:node /usr/src/app/public ./public
COPY --from=builder --chown=node:node /usr/src/app/.next/standalone ./
COPY --from=builder --chown=node:node /usr/src/app/.next/static ./.next/static
COPY --from=builder --chown=node:node /usr/src/app/prisma/schema.prisma ./prisma/schema.prisma

USER node

EXPOSE 3000
ENV PORT=3000

ENV NODE_ENV=production

CMD HOSTNAME="0.0.0.0" node server.js
