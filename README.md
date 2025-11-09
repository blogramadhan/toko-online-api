# 🛍️ Toko Online - Aplikasi E-Commerce Full-Stack

![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![React](https://img.shields.io/badge/React-18-blue)
![MySQL](https://img.shields.io/badge/MySQL-5.7%2B-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

Aplikasi e-commerce modern dengan arsitektur full-stack yang dibangun menggunakan TypeScript untuk backend dan frontend. Aplikasi ini menyediakan solusi lengkap untuk mengelola toko online dengan fitur autentikasi pengguna, manajemen produk, keranjang belanja, dan pemrosesan pesanan.

## 📋 Daftar Isi

- [🏗️ Arsitektur Proyek](#️-arsitektur-proyek)
- [✨ Fitur Utama](#-fitur-utama)
  - [Fitur Backend](#fitur-backend)
  - [Fitur Frontend](#fitur-frontend)
  - [Fitur Admin](#-fitur-admin)
- [🚀 Quick Start](#-quick-start)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [👑 Admin Guide](#-admin-guide)
  - [Akses Admin](#akses-admin)
  - [Default Admin Credentials](#default-admin-credentials)
  - [Fitur Manajemen Produk](#fitur-manajemen-produk)
  - [Interface Admin](#interface-admin)
- [📚 Dokumentasi Lengkap](#-dokumentasi-lengkap)
- [🔌 API Endpoints](#-api-endpoints)
  - [Autentikasi](#autentikasi)
  - [Produk](#produk)
  - [Keranjang](#keranjang)
  - [Pesanan](#pesanan)
  - [Admin Endpoints](#admin-endpoints)
- [🛠️ Tech Stack](#️-tech-stack)
- [🗄️ Database Schema](#️-database-schema)
- [🔧 Development](#-development)
- [🌟 Fitur Tambahan](#-fitur-tambahan)
- [🔐 Keamanan](#-keamanan)
- [📱 Responsive Design](#-responsive-design)
- [🚀 Deployment](#-deployment)
- [🐛 Troubleshooting](#-troubleshooting)
- [🤝 Kontribusi](#-kontribusi)
- [📝 License](#-license)
- [📞 Kontak](#-kontak)

## 🏗️ Arsitektur Proyek

Proyek ini menggunakan struktur monorepo yang terorganisir dengan baik:

```
toko-online-api/
├── backend/              # Express.js + TypeScript API
│   ├── config/           # Konfigurasi database
│   ├── controllers/      # Handler untuk request
│   ├── middleware/       # Middleware kustom (autentikasi, dll)
│   ├── models/           # Model Sequelize dengan TypeScript
│   ├── routes/           # Definisi route API
│   ├── types/            # Deklarasi tipe TypeScript
│   ├── validators/       # Schema validasi input
│   ├── seeders/          # Database seeders
│   └── server.ts         # Entry point aplikasi
├── frontend/             # React + TypeScript + Chakra UI
│   ├── public/           # Aset statis
│   ├── src/
│   │   ├── components/   # Komponen React reusable
│   │   ├── contexts/     # React Context untuk state management
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Halaman aplikasi
│   │   ├── services/     # Service API dengan Axios
│   │   ├── types/        # Definisi tipe TypeScript
│   │   └── utils/        # Utility functions
│   └── index.html        # Template HTML
└── README.md             # File ini
```

## ✨ Fitur Utama

### Fitur Backend (Express.js + TypeScript)

- 🔐 **Autentikasi & Autorisasi**
  - JWT-based authentication
  - Role-based access control (Admin/User)
  - Password hashing dengan bcryptjs
  - Protected routes dengan middleware

- 📦 **Manajemen Produk**
  - CRUD operations untuk produk
  - Validasi input dengan express-validator
  - Support untuk kategori, gambar, dan stok
  - Status aktif/non-aktif produk
  - Admin-only product management

- 🛒 **Sistem Keranjang Belanja**
  - Multi-item cart dengan quantity management
  - Kalkulasi total otomatis
  - Status tracking (active, completed, abandoned)

- 📋 **Manajemen Pesanan**
  - Order processing dengan status tracking
  - Payment status management
  - Order history untuk pengguna
  - Unique order number generation

- 🛡️ **Keamanan & Validasi**
  - Input validation comprehensive
  - Error handling terstruktur
  - CORS configuration
  - Environment-based configuration

### Fitur Frontend (React + TypeScript)

- 🎨 **UI/UX Modern**
  - Chakra UI component library
  - Responsive design untuk semua device
  - Dark mode support
  - Smooth transitions dan animations

- 🔐 **Sistem Autentikasi**
  - Login dan registration forms
  - Protected routes dengan React Router
  - Persistent authentication dengan localStorage
  - Auto-redirect untuk unauthenticated users

- 📱 **Halaman Lengkap**
  - Product listing dengan search dan filters
  - Product detail page dengan image gallery
  - Shopping cart dengan real-time updates
  - Checkout process dengan form validation
  - Order history dan detail tracking
  - User profile management

- 🔄 **State Management**
  - React Context API untuk global state
  - Custom hooks untuk reusable logic
  - Optimistic updates untuk better UX

### 👑 Fitur Admin

- 🎛️ **Admin Dashboard**
  - Product management interface
  - View all products (active & inactive)
  - Create, edit, and delete products
  - Bulk operations support
  - Advanced filtering and search

- 🔒 **Admin Security**
  - Role-based access control
  - Admin-only routes protection
  - Secure API endpoints
  - Activity logging

- 📊 **Admin Operations**
  - Product status management
  - Inventory management
  - Order management
  - User management

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 atau lebih tinggi)
- MySQL (v5.7 atau lebih tinggi)
- npm atau yarn

### Verifikasi Prerequisites

```bash
# Cek Node.js version
node --version

# Cek MySQL version
mysql --version

# Cek npm version
npm --version
```

### Backend Setup

1. Navigasi ke direktori backend:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Konfigurasi environment:
```bash
cp .env.example .env
# Edit .env dengan kredensial database Anda
```

Edit file `.env` dengan konfigurasi berikut:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=toko_online
DB_DIALECT=mysql

JWT_SECRET=your_jwt_secret_here_make_it_long_and_secure
JWT_EXPIRES_IN=1h
```

4. Buat database dan jalankan migrasi:
```bash
# Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE toko_online;

# Exit MySQL
exit

# Jalankan migrasi
npm run migrate

# (Optional) Seed database dengan data awal
npm run seed
```

5. Start backend server:
```bash
# Development mode dengan hot reload
npm run dev

# Atau dengan nodemon
npm run dev:watch
```

Backend akan berjalan di `http://localhost:3000`

### Frontend Setup

1. Buka terminal baru dan navigasi ke direktori frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Konfigurasi environment:
```bash
cp .env.example .env
# Edit .env dengan API URL yang sesuai
```

Edit file `.env` dengan konfigurasi berikut:
```env
VITE_API_URL=http://localhost:3000/api
```

4. Start frontend development server:
```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## 👑 Admin Guide

### Akses Admin

Untuk mengakses fitur admin, Anda memerlukan:
- Akun dengan role `admin`
- Login terlebih dahulu ke sistem

### Default Admin Credentials

Setelah menjalankan database seeder, Anda dapat menggunakan akun admin berikut:

**Admin 1:**
- **Email**: `admin@toko.com`
- **Password**: `admin123`

**Admin 2:**
- **Email**: `admin2@toko.com`
- **Password**: `admin123`

### Cara Mengakses Admin Panel

1. **Login** dengan kredensial admin di `http://localhost:5173/login`
2. **Navigasi** ke admin section menggunakan salah satu cara:
   - Klik tombol "Admin" di navigation bar
   - Klik user menu dan pilih "Product Management"
   - Langsung ke `http://localhost:5173/admin/products`

### Fitur Manajemen Produk

Admin dapat melakukan operasi berikut:

1. **View Products** - Melihat semua produk (aktif dan non-aktif)
2. **Create Products** - Menambah produk baru ke katalog
3. **Edit Products** - Update detail produk, harga, stok, dll
4. **Delete Products** - Soft delete produk (set isActive ke false)
5. **Filter & Search** - Cari produk berdasarkan nama, kategori, status
6. **Pagination** - Navigasi melalui daftar produk yang panjang

### Interface Admin

#### Product Table
- Thumbnail gambar produk
- Nama dan deskripsi produk
- Badge kategori
- Harga dan level stok
- Status aktif/non-aktif
- Tombol aksi (edit/delete)

#### Filters dan Search
- Search berdasarkan nama atau deskripsi produk
- Filter berdasarkan kategori
- Filter berdasarkan status (aktif/non-aktif)
- Sort berdasarkan berbagai field (nama, harga, stok, tanggal)
- Sort order (ascending/descending)

#### Product Form Modal
- Create produk baru atau edit produk yang ada
- Validasi form untuk semua field
- Support untuk gambar produk (URL)
- Seleksi kategori
- Manajemen stok
- Toggle aktif/non-aktif (untuk produk yang ada)

#### Field Produk
- **Name** (Required): Nama produk (2-200 karakter)
- **Description** (Optional): Deskripsi produk (max 1000 karakter)
- **Price** (Required): Harga produk (harus positif)
- **Stock** (Required): Jumlah tersedia (harus non-negatif)
- **Category** (Optional): Kategori produk
- **Image** (Optional): URL gambar produk
- **Active** (Edit only): Status visibilitas produk ke customer

## 📚 Dokumentasi Lengkap

- [Backend Documentation](./backend/README.md) - Detail API endpoints dan struktur backend
- [Frontend Documentation](./frontend/README.md) - Detail komponen dan struktur frontend

## 🔌 API Endpoints

### Autentikasi
- `POST /api/auth/register` - Registrasi user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get profil user (protected)
- `PUT /api/auth/profile` - Update profil user (protected)

### Produk
- `GET /api/products` - Get semua produk (dengan pagination, search, filters)
- `GET /api/products/:id` - Get produk berdasarkan ID
- `POST /api/products` - Create produk (admin only)
- `PUT /api/products/:id` - Update produk (admin only)
- `DELETE /api/products/:id` - Delete produk (admin only)

### Keranjang
- `GET /api/cart` - Get keranjang user (protected)
- `POST /api/cart` - Add item ke keranjang (protected)
- `PUT /api/cart/:id` - Update item keranjang (protected)
- `DELETE /api/cart/:id` - Remove item keranjang (protected)
- `DELETE /api/cart` - Clear keranjang (protected)

### Pesanan
- `POST /api/orders` - Create pesanan (protected)
- `GET /api/orders` - Get pesanan user (protected)
- `GET /api/orders/:id` - Get pesanan berdasarkan ID (protected)
- `PUT /api/orders/:id/cancel` - Cancel pesanan (protected)

### Admin Endpoints
- `GET /api/products/admin/all` - Get semua produk termasuk yang non-aktif (admin only)
- `POST /api/products` - Create produk baru (admin only)
- `PUT /api/products/:id` - Update produk (admin only)
- `DELETE /api/products/:id` - Soft delete produk (admin only)

Semua endpoint admin memerlukan:
- Authentication token di header `Authorization: Bearer <token>`
- Admin role (`role: 'admin'`)

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js dengan TypeScript
- **Framework**: Express.js
- **Database**: MySQL dengan Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs untuk password hashing
- **Validation**: express-validator
- **Development**: ts-node, nodemon

### Frontend
- **Framework**: React 18 dengan TypeScript
- **Build Tool**: Vite
- **UI Library**: Chakra UI
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Icons**: React Icons
- **State Management**: React Context API
- **Styling**: Emotion (built-in dengan Chakra UI)

## 🗄️ Database Schema

Aplikasi menggunakan database relasional dengan struktur berikut:

- **Users**: Informasi pengguna dengan role-based access
  - id, name, email, password, role, createdAt, updatedAt
- **Products**: Katalog produk dengan kategori dan stok
  - id, name, description, price, stock, category, image, isActive, createdAt, updatedAt
- **Carts**: Keranjang belanja per user
  - id, userId, status, createdAt, updatedAt
- **CartItems**: Item-item dalam keranjang
  - id, cartId, productId, quantity, price, createdAt, updatedAt
- **Orders**: Transaksi pesanan
  - id, userId, orderNumber, totalAmount, status, paymentStatus, shippingAddress, createdAt, updatedAt
- **OrderItems**: Detail item dalam setiap pesanan
  - id, orderId, productId, quantity, price, createdAt, updatedAt

Setiap model memiliki relasi yang tepat dengan validasi dan constraints untuk menjaga integritas data.

## 🔧 Development

### Backend Commands
```bash
cd backend
npm run dev          # Development dengan hot reload
npm run dev:watch    # Development dengan nodemon
npm run build        # Build untuk production
npm run typecheck    # Type checking tanpa emit
npm start            # Start production server
npm run migrate      # Run database migrations
npm run seed         # Seed database dengan data awal
npm run reset-db     # Reset database (hapus semua data)
```

### Frontend Commands
```bash
cd frontend
npm run dev          # Development server
npm run build        # Build untuk production
npm run preview      # Preview production build
npm run lint         # ESLint checking
```

### Testing
```bash
# Backend testing
cd backend
npm test             # Run tests
npm run test:watch   # Run tests in watch mode

# Frontend testing
cd frontend
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

## 🌟 Fitur Tambahan

### Backend Features
- Health check endpoint di `/health`
- Request logging middleware
- Global error handling
- Graceful shutdown handling
- Database connection management
- Environment-based configuration

### Frontend Features
- Loading states untuk semua async operations
- Error boundary untuk error handling
- Responsive navigation dengan mobile menu
- Toast notifications untuk user feedback
- Form validation dengan error messages
- Pagination untuk product listing
- Search functionality dengan debouncing

## 🔐 Keamanan

- Password hashing dengan bcryptjs
- JWT token authentication
- Input validation dan sanitization
- CORS configuration
- Protected routes dengan middleware
- SQL injection prevention dengan Sequelize ORM
- XSS prevention dengan proper escaping
- Role-based access control
- Admin-only endpoints protection

## 📱 Responsive Design

Aplikasi dirancang untuk bekerja dengan baik di berbagai perangkat:
- Mobile phones (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1440px+)

## 🚀 Deployment

### Backend Deployment
1. Build TypeScript code:
```bash
cd backend
npm run build
```

2. Set environment variables di production:
```env
NODE_ENV=production
PORT=3000
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_NAME=your_production_db_name
JWT_SECRET=your_production_jwt_secret
```

3. Start production server:
```bash
npm start
```

### Frontend Deployment
1. Build untuk production:
```bash
cd frontend
npm run build
```

2. Deploy folder `dist` ke static hosting service:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages

### Environment Variables Checklist
Sebelum deployment, pastikan environment variables berikut sudah dikonfigurasi:

**Backend:**
- `NODE_ENV`
- `PORT`
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

**Frontend:**
- `VITE_API_URL`

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Pastikan MySQL server berjalan
   - Verifikasi kredensial database di .env
   - Pastikan database sudah dibuat

2. **JWT Token Issues**
   - Periksa JWT_SECRET di environment variables
   - Pastikan token tidak expired
   - Verifikasi token format di Authorization header

3. **CORS Issues**
   - Pastikan frontend URL terdaftar di CORS configuration
   - Periksa environment variables untuk development/production

4. **Port Conflicts**
   - Ubah port di .env jika port 3000 sudah digunakan
   - Pastikan tidak ada proses lain yang menggunakan port yang sama

5. **Build Errors**
   - Hapus node_modules dan install ulang dependencies
   - Periksa TypeScript version compatibility
   - Verifikasi semua environment variables sudah ter-set

### Debug Mode

Untuk debugging, gunakan mode development dengan logging tambahan:

```bash
# Backend
cd backend
DEBUG=* npm run dev

# Frontend
cd frontend
npm run dev -- --debug
```

### Health Check

Untuk memastikan backend berjalan dengan baik:
```bash
curl http://localhost:3000/health
```

## 🤝 Kontribusi

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code Style
- Gunakan TypeScript untuk semua file baru
- Follow ESLint configuration
- Add comments untuk complex logic
- Include tests untuk new features

## 📝 License

Proyek ini dilisensikan under MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 📞 Kontak

Jika Anda memiliki pertanyaan atau saran, jangan ragu untuk menghubungi kami.

---

**Terima kasih telah menggunakan Toko Online!** 🛍️
