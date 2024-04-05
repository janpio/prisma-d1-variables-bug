# Prisma D1 Variables Bug

## Setup
```sh
npm install
npx wrangler d1 create prisma-demo-db
```
update the `wrangler.toml` file with the database id
```sh
npx wrangler d1 migrations apply prisma-demo-db --local
npm run dev
```
