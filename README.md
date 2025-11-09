# 🛍️ Toko Online - Aplikasi E-Commerce Full-Stack

![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![Vite](https://img.shields.io/badge/Vite-7.1-ffb703)
![MySQL](https://img.shields.io/badge/MySQL-5.7%2B-orange)
![Chakra%20UI](https://img.shields.io/badge/Chakra%20UI-2.10-319795)
![License](https://img.shields.io/badge/License-MIT-yellow)

Toko Online adalah aplikasi e-commerce modern yang dibangun dengan stack TypeScript penuh: backend Express + Sequelize untuk API dan React + Chakra UI untuk frontend. Repositori ini memuat seluruh arsitektur monorepo, mulai dari autentikasi JWT, katalog produk, keranjang, checkout, sampai panel admin untuk mengelola inventori.

## 📚 Daftar Isi

- [Ikhtisar Proyek](#-ikhtisar-proyek)
- [Struktur Monorepo](#-struktur-monorepo)
- [Tech Stack](#-tech-stack)
- [Fitur Unggulan](#-fitur-unggulan)
- [Arsitektur & Flow](#-arsitektur--flow)
- [Database & Model Domain](#-database--model-domain)
- [API Surface](#-api-surface)
- [Modul Frontend](#-modul-frontend)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Dummy Data & Kredensial](#-dummy-data--kredensial)
- [Deployment](#-deployment)
- [Monitoring & Health Check](#-monitoring--health-check)
- [Troubleshooting](#-troubleshooting)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)
- [Kontak](#-kontak)

## 📚 Ikhtisar Proyek

- 🌐 API RESTful untuk autentikasi, produk, keranjang, dan pesanan dengan middleware proteksi JWT + role-based access control.
- 💻 UI SPA React 19 yang sepenuhnya diketik (TypeScript) dengan Chakra UI, React Router 7, dan Axios interceptor.
- 🧠 State global menggunakan `AuthContext` & `CartContext` sehingga login dan isi keranjang bertahan antarsesi.
- 📦 Panel admin untuk CRUD produk lengkap dengan filter, pencarian, pagination, modal form, dan konfirmasi hapus.
- 🧾 Alur checkout nyata: validasi stok, shipping address, payment method, update status cart → order dengan nomor unik.
- 🧰 Skrip dev lengkap (dev server, build, type-check, lint) plus seeder `resetDatabase` untuk bootstrap data demo.

## 📦 Struktur Monorepo

```
toko-online-api/
├── backend/                # Express + Sequelize + TypeScript API
│   ├── config/             # Konfigurasi Sequelize/MySQL
│   ├── controllers/        # Handler bisnis (auth, product, cart, order)
│   ├── middleware/         # JWT authentication & role guard
│   ├── models/             # Definisi model + relasi Sequelize
│   ├── routes/             # Router modular per domain
│   ├── seeders/            # resetDatabase.ts untuk seeding cepat
│   ├── types/              # Augmentasi tipe Request (req.user, dll)
│   ├── validators/         # express-validator schema
│   └── server.ts           # Bootstrap Express + health check
├── frontend/               # React 19 + Vite + Chakra UI
│   ├── src/
│   │   ├── components/     # Navbar, AdminRoute, ProductForm
│   │   ├── contexts/       # AuthProvider, CartProvider
│   │   ├── hooks/          # useAuth, useCart
│   │   ├── pages/          # Products, ProductDetail, Cart, Checkout, dll
│   │   ├── services/       # Client Axios per domain
│   │   ├── types/          # Shared DTO antar komponen
│   │   └── utils/          # Helper (formatter, dsb)
│   └── public/             # Asset statis
└── README.md               # Dokumen ini
```

## ⚙️ Tech Stack

| Lapisan | Teknologi | Catatan |
| --- | --- | --- |
| Backend | Node.js 18+, Express 4, TypeScript 5.9, Sequelize 6, MySQL 5.7+, JWT, bcryptjs, express-validator | Struktur modular, middleware auth, global error handler, request logging, `sequelize.sync({ alter: true })` saat dev |
| Frontend | React 19, Vite 7, Chakra UI 2.10, React Router 7.9, Axios 1.13, React Icons, Framer Motion | SPA dengan dark/light mode, toasts, RangeSlider filter harga, ProtectedRoute + AdminRoute |
| Tooling | ts-node, nodemon, dotenv, ESLint 9, TypeScript strict config | Skrip `typecheck`, `lint`, `reset-db`, plus format mata uang/tanggal via `Intl` |

## ✨ Fitur Unggulan

### Backend (Express + Sequelize)

- 🔐 **Autentikasi & Autorisasi**
  - JWT bearer token, hashing bcrypt dengan hooks Sequelize.
  - `req.user` ditambahkan via augmentasi tipe, sehingga controller tetap strongly-typed.
  - Middleware `authenticateToken`, `requireUser`, dan `requireAdmin` memastikan peran user diterapkan di setiap route.
- 📦 **Manajemen Produk**
  - CRUD lengkap dengan validasi `express-validator`, dukungan kategori, stok, status aktif, dan gambar.
  - Endpoint publik `GET /api/products` + `GET /api/products/:id` mendukung pagination, pencarian, filter harga/kategori, sort.
  - Endpoint admin `GET /api/products/admin/all` mengekspos seluruh produk (termasuk non-aktif) untuk panel manajemen.
- 🛒 **Keranjang Belanja**
  - `Cart` dan `CartItem` menyimpan snapshot harga per item, status (`active/completed/abandoned`), dan total amount.
  - Update otomatis total keranjang setelah add/update/delete item.
  - Validasi stok memastikan tidak ada overselling.
- 🧾 **Pesanan & Checkout**
  - Order dibuat dalam transaksi DB: generate nomor order (`ORD-{timestamp}-{random}`), membuat `OrderItem`, mengurangi stok, menutup cart.
  - Status order (`pending`, `processing`, `shipped`, `delivered`, `cancelled`) & status pembayaran (`pending`, `paid`, `failed`) siap dipakai admin.
  - Endpoint admin tersedia untuk melihat semua order dan update status.
- 🛡️ **Keamanan & Observabilitas**
  - Limit JSON 10MB, CORS configurable, request logger sederhana, health check `/health`, root metadata `/`.
  - Global error handler menampilkan stack trace saat `NODE_ENV=development`.

### Frontend (React + Chakra UI)

- 🧭 **Routing & Proteksi**
  - `AuthProvider` membaca token/user dari `localStorage` dan mengekspos `login/register/logout`.
  - `ProtectedRoute` mengarahkan user yang belum login ke /login, sedangkan `AdminRoute` (halaman `/admin/products`) memastikan hanya role `admin`.
  - Axios interceptor otomatis menempelkan token dan auto-logout pada `401`.
- 🛍️ **Pengalaman Belanja**
  - Halaman `Products` menawarkan pencarian teks, filter kategori, slider rentang harga, serta sorting (name/price/createdAt, asc/desc).
  - `ProductDetail` menyediakan breadcrumb, gambar responsif, pengaturan kuantitas dengan batas stok, badge status stok, dan CTA add-to-cart.
  - `Cart` memiliki tampilan tabel desktop + kartu mobile, tombol tambah/kurang, toast feedback, dan tombol `Clear Cart`.
  - `Checkout` memvalidasi alamat pengiriman (min 10 karakter) & metode pembayaran sebelum memicu order.
  - `Orders` dan `OrderDetail` menampilkan badge status dan timeline pesanan, filter status, serta aksi cancel.
  - `Profile` memungkinkan update nama/telepon/alamat dan menjaga data sinkron dengan `localStorage`.
- 🎛️ **UI Modern**
  - Chakra UI dengan color mode toggle, card components, modal create/edit produk, alert dialog untuk hapus, pagination controls, toasts kaya konteks.
  - Format harga menggunakan `Intl.NumberFormat('id-ID', { currency: 'IDR' })` di seluruh UI.
  - Loading skeleton/spinner di setiap halaman untuk UX mulus.

### Admin & Operasional

- 📋 **Product Management Page**
  - Filter (search, category, status aktif, sorting), pagination 10 item, button Add, Edit modal (shared `ProductForm`), toggle status aktif, konfirmasi Delete.
- 👥 **Role & Seed**
  - Seeder `npm run reset-db` membuat 2 admin dan 5 user sehingga QA bisa langsung mencoba alur admin/user.
- 🧹 **Maintenance**
  - Script `reset-db` menjatuhkan semua tabel, re-sync schema, mengisi data dummy (produk high-end, stok, dll).
  - Perintah `npm run migrate` dan `npm run seed` tersedia bila ingin menambahkan migrasi/seed standar.

## 🔁 Arsitektur & Flow

1. **Autentikasi** – User register/login → backend mengembalikan `token + user`. Frontend menyimpan di `localStorage` dan Axios interceptor memakainya pada setiap request berikutnya. `401` otomatis memaksa logout.
2. **Katalog Produk** – Halaman Products memanggil `GET /api/products` dengan query (page, limit, search, category, minPrice, maxPrice, sortBy, sortOrder). Backend menggunakan Sequelize filter/pagination.
3. **Keranjang** – `CartProvider` mem-fetch keranjang aktif setelah user login. Semua aksi (add/update/delete/clear) memanggil endpoint `/api/cart/*` dan memperbarui context sehingga Navbar badge mengikuti.
4. **Checkout** – Halaman Checkout memvalidasi form, memanggil `POST /api/orders`, backend menjalankan transaksi (validasi stok, create order/items, update stok, close cart). Setelah sukses frontend membuang cart & mengarahkan ke `Orders`.
5. **Admin** – `AdminRoute` memastikan `user.role === 'admin'` sebelum merender `ProductManagement`. Endpoint admin memiliki guard `requireAdmin`.

## 🗄️ Database & Model Domain

| Model | Tabel | Kolom Kunci | Catatan |
| --- | --- | --- | --- |
| `User` | `users` | `name`, `email` (unik), `password` (hash bcrypt), `role` (`admin`/`user`), `phone`, `address` | Hooks `beforeCreate/beforeUpdate` memastikan password ter-hash; relasi ke `Cart` & `Order`. |
| `Product` | `products` | `name`, `description`, `price` (DECIMAL 10,2), `stock`, `category`, `image`, `isActive` | Validasi panjang nama, stok ≥ 0, `isActive` default true, relasi ke `CartItem` & `OrderItem`. |
| `Cart` | `carts` | `userId`, `status` (`active`, `completed`, `abandoned`), `totalAmount` | Satu cart aktif per user; `totalAmount` diupdate tiap operasi item. |
| `CartItem` | `cart_items` | `cartId`, `productId`, `quantity`, `price` | Menyimpan snapshot harga saat item ditambahkan; relasi ke `Product`. |
| `Order` | `orders` | `orderNumber`, `userId`, `totalAmount`, `status`, `shippingAddress`, `paymentMethod`, `paymentStatus` | Mengambil data user + item untuk histori; admin dapat update status. |
| `OrderItem` | `order_items` | `orderId`, `productId`, `quantity`, `price`, `productName` | Menyimpan nama produk saat checkout untuk audit. |

## 🔌 API Surface

| Domain | Method & Path | Proteksi | Deskripsi |
| --- | --- | --- | --- |
| Auth | `POST /api/auth/register` | Publik | Registrasi user baru dengan validasi nama/email/password. |
|  | `POST /api/auth/login` | Publik | Login, menghasilkan JWT + profil user. |
|  | `GET /api/auth/profile` | Bearer | Ambil profil user saat ini. |
|  | `PUT /api/auth/profile` | Bearer | Update nama, telepon, alamat. |
| Products | `GET /api/products` | Publik | Listing produk aktif dengan pagination, search, filter, sort. |
|  | `GET /api/products/:id` | Publik | Detail produk termasuk status stok. |
|  | `GET /api/products/admin/all` | Bearer (Admin) | Listing semua produk termasuk non-aktif. |
|  | `POST /api/products` | Bearer (Admin) | Create produk baru. |
|  | `PUT /api/products/:id` | Bearer (Admin) | Update metadata produk. |
|  | `DELETE /api/products/:id` | Bearer (Admin) | Soft delete (set `isActive=false`). |
| Cart | `GET /api/cart` | Bearer (User/Admin) | Ambil cart aktif user + item & total. |
|  | `POST /api/cart/add` | Bearer (User/Admin) | Tambah item dengan validasi stok. |
|  | `PUT /api/cart/items/:itemId` | Bearer (User/Admin) | Update kuantitas item tertentu. |
|  | `DELETE /api/cart/items/:itemId` | Bearer (User/Admin) | Hapus satu item cart. |
|  | `DELETE /api/cart/clear` | Bearer (User/Admin) | Kosongkan seluruh cart. |
| Orders (User) | `POST /api/orders` | Bearer (User/Admin) | Checkout; membuat order baru dari cart aktif. |
|  | `GET /api/orders` | Bearer (User/Admin) | Daftar order milik user (support filter status & pagination). |
|  | `GET /api/orders/:id` | Bearer | Detail order; admin dapat melihat semua, user hanya miliknya. |
|  | `PUT /api/orders/:id/cancel` | Bearer | Cancel order (aturan dapat disesuaikan). |
| Orders (Admin) | `GET /api/orders/admin/all` | Bearer (Admin) | Semua order dalam sistem. |
|  | `PUT /api/orders/:id/status` | Bearer (Admin) | Update status & payment status order. |
| Utility | `GET /health` | Publik | Health check JSON. |
|  | `GET /` | Publik | Informasi versi & daftar endpoint. |

> ⚠️ Catatan: frontend `cartService` memanggil pendekatan REST singkat (`/cart`, `/cart/:id`). Jika Anda menyesuaikan API, pastikan jalur di service tersebut diselaraskan dengan router saat ini (`/cart/add`, `/cart/items/:itemId`, dst.).

## 💻 Modul Frontend

- **Contexts**
  - `AuthContextProvider` – menyimpan user/token, expose `login`, `register`, `logout`, `loading`.
  - `CartContextProvider` – fetch cart setelah login, hitung `cartItemCount`, sediakan fungsi mutasi (add/update/remove/clear).
- **Components**
  - `Navbar` dengan badge cart, toggle tema, menu admin/user, CTA login/register.
  - `AdminRoute` & `ProtectedRoute` untuk guard halaman.
  - `ProductForm` (digunakan di modal create/update) dengan validasi Chakra + TypeScript.
- **Pages**
  - `Products`, `ProductDetail`, `Cart`, `Checkout`, `Orders`, `OrderDetail`, `Profile`, `Login`, `Register`, `ProductManagement`.
  - Fitur khusus: range slider harga, pagination, responsive grid/cards, status badge dengan warna berbeda.
- **Services**
  - `api.ts` (Axios instance + interceptor 401), `auth.service.ts`, `product.service.ts`, `cart.service.ts`, `order.service.ts`.
- **Hooks & Utils**
  - `useAuth`, `useCart`, helper format harga/tanggal.
- **Styling & UX**
  - Chakra UI theme default, animasi sederhana via Framer Motion, toast `useToast` untuk feedback, `Intl.NumberFormat` & `Intl.DateTimeFormat` menyesuaikan locale `id-ID`.

## 🚀 Quick Start

### Prasyarat

- Node.js 18+ & npm 9+
- MySQL 5.7 / 8.0 berjalan lokal atau remote
- Git
- (Opsional) `mysql` CLI atau GUI (TablePlus, DBeaver, dsb.)

### 1. Clone Repositori

```bash
git clone https://github.com/<username>/toko-online-api.git
cd toko-online-api
```

### 2. Backend Setup (`/backend`)

1. Install dependency:

   ```bash
   cd backend
   npm install
   ```

2. Duplikasi env & isi sesuai kebutuhan:

   ```bash
   cp .env.example .env
   ```

   Minimal isi:

   ```
   PORT=3000
   NODE_ENV=development
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=toko_online
   DB_DIALECT=mysql
   JWT_SECRET=super_secret_key
   JWT_EXPIRES_IN=1h
   ```

3. Buat database kosong (nama sesuai `DB_NAME`):

   ```sql
   CREATE DATABASE toko_online;
   ```

4. Jalankan server dev:

   ```bash
   npm run dev
   ```

   Secara default `sequelize.sync({ alter: true })` akan membuat/menyesuaikan tabel saat `NODE_ENV=development`.

5. (Opsional, tapi disarankan) Seed dummy data:

   ```bash
   npm run reset-db
   ```

   Script ini akan DROP semua tabel lalu membuat admin, user, dan produk contoh.

> Jika Anda menambahkan migrasi resmi, gunakan `npm run migrate` / `npm run seed` sesuai kebutuhan.

### 3. Frontend Setup (`/frontend`)

1. Install dependency:

   ```bash
   cd ../frontend
   npm install
   ```

2. Duplikasi env:

   ```bash
   cp .env.example .env
   ```

3. Pastikan `VITE_API_URL` mengarah ke backend:

   ```
   VITE_API_URL=http://localhost:3000/api
   ```

4. Jalankan dev server Vite:

   ```bash
   npm run dev
   ```

   Default berjalan di `http://localhost:5173`.

### 4. Menjalankan secara bersamaan

- Terminal 1: `cd backend && npm run dev`
- Terminal 2: `cd frontend && npm run dev`
- Login via `http://localhost:5173/login`, backend API tersedia di `http://localhost:3000`.

### 5. Skrip Harian & QA

| Lokasi | Skrip | Deskripsi |
| --- | --- | --- |
| backend | `npm run dev` | Menjalankan server via `ts-node` (development). |
|  | `npm run dev:watch` | Hot reload dengan nodemon. |
|  | `npm run build` | Compile TypeScript → `dist`. |
|  | `npm start` | Menjalankan build JS di production. |
|  | `npm run typecheck` | Tipe-check tanpa emit. |
|  | `npm run migrate` / `npm run seed` | Hook untuk Sequelize CLI jika Anda tambahkan migrasi. |
|  | `npm run reset-db` | Drop + sync ulang + seed dummy data (hanya untuk lokal). |
| frontend | `npm run dev` | Dev server Vite + HMR. |
|  | `npm run build` | Build produksi (`dist`). |
|  | `npm run preview` | Preview build produksi secara lokal. |
|  | `npm run lint` | Jalankan ESLint (React + hooks rules). |

## ⚙️ Environment Variables

| Paket | Variabel | Deskripsi | Contoh |
| --- | --- | --- | --- |
| backend | `PORT` | Port Express. | `3000` |
|  | `NODE_ENV` | Mode aplikasi (`development`, `production`). | `development` |
|  | `DB_HOST` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` / `DB_DIALECT` | Kredensial MySQL untuk Sequelize. | `localhost` / `root` / `password` / `toko_online` / `mysql` |
|  | `JWT_SECRET` | Secret key JWT (ubah di production). | `super_secret_key` |
|  | `JWT_EXPIRES_IN` | Durasi token. | `1h` |
| frontend | `VITE_API_URL` | Base URL API untuk Axios. | `http://localhost:3000/api` |

> Simpan file `.env` di masing-masing folder (`backend/.env`, `frontend/.env`). Jangan commit kredensial rahasia.

## 🧪 Dummy Data & Kredensial

Menjalankan `npm run reset-db` di backend akan menambahkan akun berikut:

| Role | Email | Password | Catatan |
| --- | --- | --- | --- |
| Admin | `admin@toko.com` | `admin123` | Admin utama. |
| Admin | `admin2@toko.com` | `admin123` | Admin kedua. |
| User | `ahmad@email.com` | `user123` | Contoh pelanggan. |
| User | `siti@email.com` | `user123` | — |
| User | `budi@email.com` | `user123` | — |
| User | `dewi@email.com` | `user123` | — |
| User | `eko@email.com` | `user123` | — |

Dataset produk mencakup gadget populer (ROG, iPhone 15, PS5, dsb.) lengkap dengan kategori, stok, harga rupiah, dan gambar placeholder sehingga UI langsung terisi.

## 🌐 Deployment

### Backend

1. Build TypeScript → JavaScript:

   ```bash
   cd backend
   npm run build
   ```

2. Set env production (`NODE_ENV=production`, `PORT`, kredensial DB produksi, `JWT_SECRET` baru, dll).

3. Jalankan menggunakan `npm start` atau proses manager (PM2, Docker). Pastikan `sequelize.sync({ alter: true })` **dimatikan** di production jika Anda sudah menggunakan migrasi terkontrol.

4. Ekspos `http://<server>:<port>/health` untuk monitoring.

### Frontend

1. Build:

   ```bash
   cd frontend
   npm run build
   ```

2. Deploy folder `dist` ke hosting statis favorit (Vercel, Netlify, AWS S3 + CloudFront, dsb.). Pastikan `VITE_API_URL` mengarah ke endpoint backend publik sebelum build.

3. Jika menggunakan domain berbeda, sesuaikan konfigurasi CORS pada backend.

### Checklist Deployment

- [ ] Semua env var backend & frontend ter-set.
- [ ] Database produksi dibuat dan kredensial diuji dengan `sequelize.authenticate()`.
- [ ] `JWT_SECRET` berbeda dari development.
- [ ] Reverse proxy / HTTPS (Nginx, Caddy) mengarahkan traffic ke backend & frontend.

## 🩺 Monitoring & Health Check

- `GET /health` – mengembalikan `{ success, message, timestamp }`.
- `GET /` – metadata API + daftar route utama.
- Log request dicetak di console (timestamp + method + path). Integrasikan dengan log aggregator bila dibutuhkan.
- Gunakan `curl http://localhost:3000/health` untuk memastikan server siap sebelum frontend diarahkan.

## 🛠 Troubleshooting

1. **Tidak bisa konek DB** – pastikan MySQL berjalan, user memiliki hak akses, dan DB sudah dibuat. Error `ER_NOT_SUPPORTED_AUTH_MODE` berarti akun MySQL masih menggunakan auth caching sha2: jalankan `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';`.
2. **JWT invalid / expired** – cek `JWT_SECRET` konsisten antar instance. Interceptor frontend akan force logout saat menerima 401; login ulang untuk refresh token.
3. **CORS error** – gunakan origin frontend aktual pada middleware CORS (saat ini default mengizinkan semua). Tambahkan `app.use(cors({ origin: ['http://localhost:5173'] }))` bila ingin membatasi.
4. **Endpoint keranjang tidak ditemukan** – backend menggunakan pola `/api/cart/add` dan `/api/cart/items/:itemId`. Jika Anda mengubah router, jangan lupa menyesuaikan `frontend/src/services/cart.service.ts`.
5. **`sequelize.sync` lama atau mengganti struktur tabel** – jalankan `npm run reset-db` hanya di lingkungan lokal. Di production, gunakan migrasi eksplisit agar tidak kehilangan data.
6. **Build frontend gagal** – hapus `node_modules`, jalankan `npm install`, kemudian `npm run lint` untuk memastikan tidak ada error lint yang bersifat fatal.

## 🤝 Kontribusi

1. Fork repositori ini.
2. Buat branch fitur: `git checkout -b feature/nama-fitur`.
3. Kerjakan perubahan (pastikan `npm run typecheck` & `npm run lint` sukses).
4. Commit dengan pesan jelas: `git commit -m "feat: tambah filter harga produk"`.
5. Push branch & buka Pull Request. Sertakan deskripsi fitur/bugfix dan langkah testing.

Kontribusi berupa dokumentasi, perbaikan bug, atau peningkatan UI/UX sangat kami apresiasi.

## 📝 Lisensi

Distribusi di bawah lisensi [MIT](LICENSE). Silakan gunakan, modifikasi, dan distribusikan dengan tetap mempertahankan atribusi.

## 📞 Kontak

Punya pertanyaan atau ide? Silakan buka GitHub Issue atau hubungi tim pengembang melalui channel favorit Anda. Terima kasih telah menggunakan Toko Online! 🛒
