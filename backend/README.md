# Toko Online API - Backend

Backend API for Toko Online (E-commerce) application built with Express.js, TypeScript, JWT, MySQL, and Sequelize.

## Tech Stack

- **Node.js** with **TypeScript**
- **Express.js** - Web framework
- **Sequelize** - ORM for MySQL
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## Features

- ✅ User authentication (register, login)
- ✅ Product management (CRUD operations)
- ✅ Shopping cart functionality
- ✅ Order management
- ✅ Role-based access control (Admin/User)
- ✅ Input validation
- ✅ Full TypeScript support

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your database credentials:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=toko_online
DB_DIALECT=mysql

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1h
```

3. Create database:
```bash
mysql -u root -p
CREATE DATABASE toko_online;
```

4. Run migrations:
```bash
npm run migrate
```

5. (Optional) Seed database:
```bash
npm run seed
```

## Development

Run the development server with hot reload:
```bash
npm run dev
```

Or with nodemon:
```bash
npm run dev:watch
```

## Production

Build the TypeScript code:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Products
- `GET /api/products` - Get all products (with pagination, search, filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user cart (protected)
- `POST /api/cart` - Add item to cart (protected)
- `PUT /api/cart/:id` - Update cart item (protected)
- `DELETE /api/cart/:id` - Remove cart item (protected)
- `DELETE /api/cart` - Clear cart (protected)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/:id` - Get order by ID (protected)
- `PUT /api/orders/:id/cancel` - Cancel order (protected)

## Scripts

- `npm run dev` - Start development server with ts-node
- `npm run dev:watch` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm run typecheck` - Type check without emitting files
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database

## Project Structure

```
backend/
├── config/          # Database configuration
├── controllers/     # Request handlers
├── middleware/      # Custom middleware (auth, etc.)
├── models/          # Sequelize models
├── routes/          # API routes
├── types/           # TypeScript type declarations
├── validators/      # Input validation schemas
├── server.ts        # Application entry point
└── tsconfig.json    # TypeScript configuration
```

## License

MIT
