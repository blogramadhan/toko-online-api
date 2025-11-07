# Toko Online - Frontend

Modern e-commerce frontend application built with React, TypeScript, and Chakra UI.

## Tech Stack

- **React 18** with **TypeScript**
- **Vite** - Build tool and dev server
- **Chakra UI** - Component library
- **React Router** - Routing
- **Axios** - HTTP client
- **React Icons** - Icon library

## Features

- ✅ User authentication (login, register)
- ✅ Product browsing with search and filters
- ✅ Shopping cart functionality
- ✅ Order management
- ✅ User profile management
- ✅ Responsive design
- ✅ Dark mode support
- ✅ TypeScript for type safety

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend README)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` file:
```env
VITE_API_URL=http://localhost:3000/api
```

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Production

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Pages

### Public Pages
- `/login` - User login
- `/register` - User registration

### Protected Pages
- `/` - Product listing (home page)
- `/products` - Product listing
- `/products/:id` - Product detail
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/orders` - User orders
- `/orders/:id` - Order detail
- `/profile` - User profile

## License

MIT
