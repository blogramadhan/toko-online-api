# Toko Online - Aplikasi E-Commerce Full-Stack

Aplikasi e-commerce modern dengan arsitektur full-stack yang dibangun menggunakan TypeScript untuk backend dan frontend. Aplikasi ini menyediakan solusi lengkap untuk mengelola toko online dengan fitur autentikasi pengguna, manajemen produk, keranjang belanja, dan pemrosesan pesanan.

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

### Backend (Express.js + TypeScript)
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

### Frontend (React + TypeScript)
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

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 atau lebih tinggi)
- MySQL (v5.7 atau lebih tinggi)
- npm atau yarn

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

4. Buat database dan jalankan migrasi:
```bash
mysql -u root -p
CREATE DATABASE toko_online;
exit

npm run migrate
```

5. Start backend server:
```bash
npm run dev
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
# API URL sudah dikonfigurasi dengan default: http://localhost:3000/api
```

4. Start frontend development server:
```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

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
- **Products**: Katalog produk dengan kategori dan stok
- **Carts**: Keranjang belanja per user
- **CartItems**: Item-item dalam keranjang
- **Orders**: Transaksi pesanan
- **OrderItems**: Detail item dalam setiap pesanan

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
```

### Frontend Commands
```bash
cd frontend
npm run dev          # Development server
npm run build        # Build untuk production
npm run preview      # Preview production build
npm run lint         # ESLint checking
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
npm run build
```

2. Set environment variables di production
3. Start production server:
```bash
npm start
```

### Frontend Deployment
1. Build untuk production:
```bash
npm run build
```

2. Deploy folder `dist` ke static hosting service

## 🤝 Kontribusi

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

Proyek ini dilisensikan under MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 📞 Kontak

Jika Anda memiliki pertanyaan atau saran, jangan ragu untuk menghubungi kami.

---

**Terima kasih telah menggunakan Toko Online!** 🛍️
