# Pet Accessories Store - Frontend

React frontend for the Pet Accessories e-commerce platform with PayU payment integration.

## Tech Stack

- **React 19** - UI library
- **Redux Toolkit** - State management
- **React Router 7** - Routing
- **Tailwind CSS 4** - Styling
- **Axios** - HTTP client
- **Vite** - Build tool

## Features

### Authentication
- User registration and login
- JWT token authentication with automatic refresh
- Admin and user role-based access control
- Protected routes

### Product Management (User)
- Browse products with category filtering
- Search products
- View product details with images
- Add products to cart
- View stock availability

### Product Management (Admin)
- Add new products with image upload (Cloudinary)
- Edit existing products
- Delete products
- View all products in table format
- Manage inventory and pricing

## Setup Instructions

### 1. Install Dependencies

```bash
npm install react-router-dom
```

All other dependencies are already installed.

### 2. Environment Variables

The `.env` file is already configured:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

The app will run on `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## Default Routes

- `/` - Redirects to `/products`
- `/login` - Login page
- `/register` - Registration page
- `/products` - Product listing (public)
- `/admin/products` - Admin product table (admin only)
- `/admin/products/new` - Add product form (admin only)
- `/admin/products/edit/:id` - Edit product form (admin only)

## Key Features

### Automatic Token Refresh
The API client automatically refreshes expired tokens and retries failed requests.

### Price Formatting
- Backend stores prices in paise (integer)
- Frontend displays in rupees with ₹ symbol
- Utilities handle conversion: `formatPrice()`, `toPaise()`

### Role-Based Access
- Public routes: Product browsing, Auth
- Protected routes: User dashboard
- Admin routes: Product management

