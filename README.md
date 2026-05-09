# ecommerce-fullstack-design

Full-stack marketplace build based on the Ecommerce Web Design Figma template. The app has a React storefront, a NestJS API, MongoDB product data, admin auth with access and refresh tokens, and a cart that persists locally.

## Features

- Figma-matched desktop storefront for home, product listing, product details, and cart
- Mobile web layouts for the same customer pages
- List and grid product browsing with filters, sorting, rating display, and search
- Working product filters for category, brand, feature tags, condition, price range, rating, and discounted products
- Price range filter with slider controls and numeric min/max fields
- Product details page with supplier card, price tiers, related products, and inquiry action
- Cart management with quantity controls, remove actions, saved-for-later section, and localStorage persistence
- Lightweight add-to-cart feedback with an animated cart count
- Admin login with JWT access and refresh tokens
- Protected admin product management for create, edit, delete, pagination, category grouping, and search
- Admin image upload with preview. Cloudinary is supported through environment variables, with a local data URL fallback for development
- Product and metadata APIs backed by MongoDB
- Backend Jest tests for auth, product, and metadata flows

## Stack

- Frontend: React, TypeScript, Vite, TailwindCSS
- Backend: NestJS, TypeScript, Mongoose
- Database: MongoDB
- Auth: JWT access tokens and refresh tokens
- Testing: Jest for the backend

## Structure

```text
front-end/
  src/
    api/          fetch wrappers and API functions
    components/   layout, UI, and reusable storefront blocks
    context/      auth and cart providers
    data/         storefront labels and display helpers
    hooks/        product and metadata loading hooks
    pages/        route-level screens

backend/
  src/
    auth/         login, refresh, auth guard, and role helpers
    metadata/     metadata controller/module
    product/      product schema, DTOs, controller, service, and tests
```

## Local setup

Install both apps:

```bash
cd backend
npm install

cd ../front-end
npm install
```

Start the backend:

```bash
cd backend
npm run start:dev
```

Start the frontend:

```bash
cd front-end
npm run dev
```

The frontend defaults to `http://localhost:5173`, and the API defaults to `http://localhost:3000`.

## Environment

Backend `.env`:

```bash
MONGODB_URI=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_NAME=
PORT=3000
FRONTEND_URLS=http://localhost:5173,http://127.0.0.1:5173
```

Frontend `.env`:

```bash
VITE_API_URL=http://localhost:3000
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

The Cloudinary values are optional for local work. If they are empty, the admin image picker stores the selected image as a browser data URL so the product form still works. For production, use an unsigned Cloudinary upload preset and set both Cloudinary variables.

If admin auth variables are not set, the backend uses the local demo admin:

```text
Email: admin@shop.dev
Password: admin123
```

## Routes

- `/` storefront home
- `/products` product listing
- `/products?view=grid` product grid state
- `/products/:id` product details
- `/cart` shopping cart
- `/admin/login` admin login
- `/admin` protected admin panel

## API

- `GET /product` with pagination and filters
- `GET /product/:id`
- `POST /product` admin only
- `PATCH /product/:id` admin only
- `DELETE /product/:id` admin only
- `GET /metadata`
- `PATCH /metadata` admin only
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me`

Product listing supports query filters such as `category`, `brand`, `condition`, `features`, `search`, `minPrice`, `maxPrice`, `minRating`, `hasDiscount`, `page`, and `limit`.

## Checks

Frontend build:

```bash
cd front-end
npm run build
```

Backend build:

```bash
cd backend
npm run build
```

Backend tests:

```bash
cd backend
npm test
```

## Notes

- Product images come from the URLs stored in MongoDB.
- Admin can upload a product image or paste an image URL manually.
- Cart state is stored in the browser so it survives page refreshes.
- Admin-only mutations require an access token.
- `FRONTEND_URLS` accepts a comma-separated list so both `localhost` and `127.0.0.1` work during development.
