# capi-ui

A web console for [Cluster API](https://cluster-api.sigs.k8s.io/) on OpenStack. It reads a management cluster and shows each workload cluster: health, machines, addons, network, conditions, manifest and events. It can scale workers, download a kubeconfig and delete a cluster.

## Features

- **Cluster view** — version, control plane and worker readiness, API endpoint, failure domains.
- **Tabs** — machines (search and role/status filters), Helm addons, OpenStack network, conditions, the raw `Cluster` manifest and events.
- **Actions** — scale workers, download the kubeconfig, delete a cluster (type the name to confirm).
- **Accounts** — username and password sign-in, backed by SQLite.
- **English and French**, light and dark theme.

## Stack

Next.js 16 (App Router, Cache Components), TypeScript, Bun, Biome, Tailwind v4 with shadcn/ui, `better-auth` with Prisma 7 on SQLite, `next-intl`, `zod` with `react-hook-form`, `@kubernetes/client-node`.

## Getting started

Requirements: [Bun](https://bun.sh) and a kubeconfig that can read Cluster API resources.

```bash
bun install
cp .env.example .env   # then fill in the values below
bun run dev            # generates the Prisma client, applies migrations, starts Next.js
```

Open <http://localhost:3000>, create an account on `/sign-up`, then sign in.

### Environment

| Variable             | Description                                                   |
| -------------------- | ------------------------------------------------------------- |
| `BETTER_AUTH_SECRET` | Session secret, generate one with `openssl rand -base64 32`.  |
| `BETTER_AUTH_URL`    | Public URL of the app, e.g. `http://localhost:3000`.          |
| `DATABASE_URL`       | SQLite file, e.g. `file:./dev.db`.                            |
| `KUBECONFIG`         | Path to the management cluster kubeconfig.                    |
| `CAPI_NAMESPACE`     | Namespace holding the clusters (default `capi-clusters`).     |

## Scripts

| Command              | Description                                  |
| -------------------- | -------------------------------------------- |
| `bun run dev`        | Start the dev server (applies migrations).   |
| `bun run build`      | Generate the Prisma client and build.        |
| `bun run lint`       | Run Biome.                                   |
| `bun run db:migrate` | Create a new Prisma migration in development. |

## Project layout

```
src/
  app/          routes: (app) is the signed-in console, plus sign-in and sign-up
  actions/      server actions (scale, delete)
  services/     one namespace per domain: clusters, machines, addons, networks, events
  components/   ui/ (shadcn), then one folder per domain
  constants/    resource identities, expected errors, status maps
  lib/          auth, Kubernetes client, load helper
  messages/     en.json and fr.json
  prisma/       schema and migrations
```

## Docker

```bash
docker build -t capi-ui .
docker run -p 3000:3000 \
  -v capi-data:/data \
  -v /path/to/kubeconfig:/kube/config:ro -e KUBECONFIG=/kube/config \
  -e BETTER_AUTH_SECRET=... -e BETTER_AUTH_URL=http://localhost:3000 \
  capi-ui
```

The SQLite database lives in the `/data` volume and migrations run at startup.

## CI and releases

GitHub Actions lint with Biome on every pull request and push. Pushing a version bump in `package.json` to `main` builds the image, pushes it to GHCR and creates a release.

Commits follow `[tag] Capitalized description` (`feature`, `fix`, `refactor`, `chore`, `docs`, `version`).
