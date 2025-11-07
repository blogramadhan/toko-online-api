# Toko Online - E-Commerce Application

Full-stack e-commerce application with TypeScript backend and React frontend.

## Project Structure

This is a monorepo containing both backend and frontend applications:

```
toko-online-api/
├── backend/        # Express.js + TypeScript API
├── frontend/       # React + TypeScript + Chakra UI
└── README.md       # This file
```

## Features

### Backend
- ✅ RESTful API with Express.js and TypeScript
- ✅ JWT authentication
- ✅ MySQL database with Sequelize ORM
- ✅ Role-based access control (Admin/User)
- ✅ Product management (CRUD)
- ✅ Shopping cart functionality
- ✅ Order management
- ✅ Input validation with express-validator

### Frontend
- ✅ Modern React with TypeScript
- ✅ Chakra UI component library
- ✅ React Router for navigation
- ✅ Context API for state management
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Protected routes
- ✅ Shopping cart with real-time updates

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Create database and run migrations:
```bash
mysql -u root -p
CREATE DATABASE toko_online;
exit

npm run migrate
```

5. Start the backend server:
```bash
npm run dev
```

Backend will run at `http://localhost:3000`

### Frontend Setup

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
# .env is already configured with default values
# API URL: http://localhost:3000/api
```

4. Start the frontend development server:
```bash
npm run dev
```

Frontend will run at `http://localhost:5173`

## Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/cancel` - Cancel order

## Tech Stack

### Backend
- Node.js + TypeScript
- Express.js
- Sequelize (MySQL)
- JWT Authentication
- bcryptjs
- express-validator

### Frontend
- React 18
- TypeScript
- Vite
- Chakra UI
- React Router
- Axios
- React Icons

## Development

### Backend
```bash
cd backend
npm run dev          # Development with hot reload
npm run build        # Build for production
npm run typecheck    # Type checking
```

### Frontend
```bash
cd frontend
npm run dev          # Development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## License

MIT
