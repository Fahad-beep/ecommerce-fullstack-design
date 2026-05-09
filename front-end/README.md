# Frontend

React storefront for the marketplace UI. The customer pages follow the Figma desktop and mobile layouts, while the admin panel is custom-built for catalog management.

## What Is Inside

- Home, product listing, product details, cart, admin login, and admin dashboard routes
- Responsive desktop and mobile storefront layouts
- Product listing filters for price range, rating, brand, category, condition, feature tags, and deals
- Cart context with localStorage persistence and add-to-cart feedback
- Auth context for admin access and refresh-token session recovery
- Admin catalog table with search, category grouping, pagination, edit, delete, and image upload

## Environment

Create `front-end/.env`:

```bash
VITE_API_URL=http://localhost:3000
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

Cloudinary is optional during local development. If the Cloudinary values are empty, uploaded admin images are stored as data URLs in the form. For production, set an unsigned upload preset so images are stored on Cloudinary.

## Scripts

```bash
npm install
npm run dev
npm run build
```

The dev server runs on `http://localhost:5173` by default.

## Routes

- `/`
- `/products`
- `/products/:id`
- `/cart`
- `/admin/login`
- `/admin`
