# Backend

NestJS API for products, metadata, and admin authentication. MongoDB stores the product catalog, while JWT access and refresh tokens protect admin-only mutations.

## Main Modules

- `auth`: admin login, token refresh, profile lookup, JWT guard, and admin route decorator
- `product`: product schema, CRUD endpoints, pagination, filtering, and catalog tests
- `metadata`: category, brand, condition, and feature metadata

## Environment

Create `backend/.env`:

```bash
PORT=3000
FRONTEND_URLS=http://localhost:5173,http://127.0.0.1:5173
MONGODB_URI=
JWT_ACCESS_SECRET=replace-with-a-long-random-access-secret
JWT_REFRESH_SECRET=replace-with-a-long-random-refresh-secret
ADMIN_EMAIL=admin@shop.dev
ADMIN_PASSWORD=admin123
ADMIN_NAME=Site Admin
```

If `MONGODB_URI` is empty, the app falls back to a local MongoDB URL. For the shared sample database, set `MONGODB_URI` in `.env`.

## Scripts

```bash
npm install
npm run start:dev
npm run build
npm test
```

## Endpoints

- `GET /product`
- `GET /product/:id`
- `POST /product`
- `PATCH /product/:id`
- `DELETE /product/:id`
- `GET /metadata`
- `PATCH /metadata`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me`

Admin-only endpoints require a bearer access token. Product listing supports `category`, `brand`, `condition`, `features`, `search`, `minPrice`, `maxPrice`, `minRating`, `hasDiscount`, `page`, and `limit`.
