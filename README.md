# Toko Online API

Backend untuk aplikasi toko online yang dibangun dengan Express.js, JWT, MySQL, dan Sequelize

## Fitur

### Admin
- ✅ Manajemen produk (CRUD)
- ✅ Melihat semua pesanan
- ✅ Update status pesanan
- ✅ Dashboard admin

### User
- ✅ Registrasi dan login
- ✅ Melihat produk
- ✅ Shopping cart
- ✅ Checkout dan pemesanan
- ✅ Riwayat pesanan
- ✅ Update profil

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Products
- `GET /api/products` - Get all active products (public)
- `GET /api/products/:id` - Get single product (public)
- `GET /api/products/admin/all` - Get all products (admin only)
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Shopping Cart
- `GET /api/cart` - Get user's cart (protected)
- `POST /api/cart/add` - Add item to cart (protected)
- `PUT /api/cart/items/:itemId` - Update cart item (protected)
- `DELETE /api/cart/items/:itemId` - Remove item from cart (protected)
- `DELETE /api/cart/clear` - Clear cart (protected)

### Orders
- `POST /api/orders` - Create order/checkout (protected)
- `GET /api/orders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get single order (protected)
- `PUT /api/orders/:id/cancel` - Cancel order (protected)
- `GET /api/orders/admin/all` - Get all orders (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)

## Database Schema

### Users
- id, name, email, password, role, phone, address, timestamps

### Products
- id, name, description, price, stock, category, image, isActive, timestamps

### Carts
- id, userId, status, totalAmount, timestamps

### CartItems
- id, cartId, productId, quantity, price, timestamps

### Orders
- id, orderNumber, userId, totalAmount, status, shippingAddress, paymentMethod, paymentStatus, timestamps

### OrderItems
- id, orderId, productId, quantity, price, productName, timestamps

## Authentication

API menggunakan JWT untuk authentication. Setelah login, user akan mendapat token yang harus disertakan di header:

```
Authorization: Bearer <token>
```

## Role-based Access

- **Admin**: Dapat mengelola produk dan melihat semua pesanan
- **User**: Dapat berbelanja dan melihat pesanan sendiri

## Error Handling

API mengembalikan response dalam format JSON:

```json
{
  "success": true/false,
  "message": "Pesan response",
  "data": {}, // jika ada data
  "errors": [] // jika ada error validasi
}
```

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Contoh Penggunaan

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "phone": "081234567890",
    "address": "Jl. Contoh No. 123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Add Product (Admin)
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "name": "Laptop Gaming",
    "description": "Laptop gaming dengan spesifikasi tinggi",
    "price": 15000000,
    "stock": 10,
    "category": "Electronics",
    "image": "https://example.com/laptop.jpg"
  }'
```

### Add to Cart
```bash
curl -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <user-token>" \
  -d '{
    "productId": 1,
    "quantity": 2
  }'
```

### Checkout
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <user-token>" \
  -d '{
    "shippingAddress": "Jl. Pengiriman No. 456, Jakarta",
    "paymentMethod": "COD"
  }'
```