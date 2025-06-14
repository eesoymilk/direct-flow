FROM node:20-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/company/package.json ./packages/company/package.json
COPY packages/company/pnpm-lock.yaml ./packages/company/pnpm-lock.yaml
COPY packages/base/package.json ./packages/base/package.json
COPY packages/base/pnpm-lock.yaml ./packages/base/pnpm-lock.yaml
RUN pnpm install
COPY . .

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD [ "pnpm", "--filter", "@direct-flow/company", "run", "dev" ]
