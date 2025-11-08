import dotenv from 'dotenv';
dotenv.config();

import { sequelize, User, Product } from '../models';
import bcrypt from 'bcryptjs';

const resetDatabase = async () => {
    try {
        console.log('🔄 Starting database reset...');
        
        // Drop all tables
        await sequelize.drop();
        console.log('✅ All tables dropped');
        
        // Recreate tables
        await sequelize.sync({ force: true });
        console.log('✅ Database tables recreated');
        
        // Create dummy data
        await createDummyData();
        
        console.log('✅ Database reset and seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error resetting database:', error);
        process.exit(1);
    }
};

const createDummyData = async () => {
    try {
        console.log('🌱 Creating dummy data...');
        
        // Create admin users
        const adminPassword = await bcrypt.hash('admin123', 10);
        const adminUsers = await User.bulkCreate([
            {
                name: 'Admin Utama',
                email: 'admin@toko.com',
                password: adminPassword,
                role: 'admin',
                phone: '08123456789',
                address: 'Jl. Admin No. 1, Jakarta'
            },
            {
                name: 'Admin Kedua',
                email: 'admin2@toko.com',
                password: adminPassword,
                role: 'admin',
                phone: '08223456789',
                address: 'Jl. Admin No. 2, Surabaya'
            }
        ]);
        console.log('✅ Admin users created');
        
        // Create regular users
        const userPassword = await bcrypt.hash('user123', 10);
        const regularUsers = await User.bulkCreate([
            {
                name: 'Ahmad Wijaya',
                email: 'ahmad@email.com',
                password: userPassword,
                role: 'user',
                phone: '08313456789',
                address: 'Jl. Merdeka No. 45, Bandung'
            },
            {
                name: 'Siti Nurhaliza',
                email: 'siti@email.com',
                password: userPassword,
                role: 'user',
                phone: '08413456789',
                address: 'Jl. Sudirman No. 67, Semarang'
            },
            {
                name: 'Budi Santoso',
                email: 'budi@email.com',
                password: userPassword,
                role: 'user',
                phone: '08513456789',
                address: 'Jl. Gatot Subroto No. 23, Yogyakarta'
            },
            {
                name: 'Dewi Lestari',
                email: 'dewi@email.com',
                password: userPassword,
                role: 'user',
                phone: '08613456789',
                address: 'Jl. Pahlawan No. 89, Malang'
            },
            {
                name: 'Eko Prasetyo',
                email: 'eko@email.com',
                password: userPassword,
                role: 'user',
                phone: '08713456789',
                address: 'Jl. Diponegoro No. 12, Solo'
            }
        ]);
        console.log('✅ Regular users created');
        
        // Create products
        const products = await Product.bulkCreate([
            {
                name: 'Laptop ASUS ROG',
                description: 'Laptop gaming high-end dengan processor Intel Core i9, RAM 32GB, SSD 1TB, NVIDIA RTX 4080',
                price: 25000000,
                stock: 15,
                category: 'Electronics',
                image: 'https://example.com/laptop-rog.jpg',
                isActive: true
            },
            {
                name: 'iPhone 15 Pro Max',
                description: 'Smartphone premium dari Apple dengan layar Super Retina XDR, chip A17 Pro, kamera 48MP',
                price: 20000000,
                stock: 25,
                category: 'Electronics',
                image: 'https://example.com/iphone-15.jpg',
                isActive: true
            },
            {
                name: 'Samsung Galaxy S24 Ultra',
                description: 'Flagship Android dengan S Pen, layar Dynamic AMOLED 2X, kamera 200MP',
                price: 18000000,
                stock: 20,
                category: 'Electronics',
                image: 'https://example.com/galaxy-s24.jpg',
                isActive: true
            },
            {
                name: 'Sony PlayStation 5',
                description: 'Konsol gaming generasi terbaru dengan grafis 4K, SSD ultra-fast, haptic feedback',
                price: 7500000,
                stock: 30,
                category: 'Gaming',
                image: 'https://example.com/ps5.jpg',
                isActive: true
            },
            {
                name: 'iPad Air M2',
                description: 'Tablet powerful dengan chip M2, layar Liquid Retina 10.9 inch, support Apple Pencil',
                price: 12000000,
                stock: 18,
                category: 'Electronics',
                image: 'https://example.com/ipad-air.jpg',
                isActive: true
            },
            {
                name: 'Samsung Smart TV 55"',
                description: 'Smart TV 4K QLED dengan HDR10+, Dolby Atmos, Tizen OS',
                price: 8500000,
                stock: 12,
                category: 'Electronics',
                image: 'https://example.com/samsung-tv.jpg',
                isActive: true
            },
            {
                name: 'Nike Air Max 270',
                description: 'Sepatu olahraga dengan cushioning maksimal, desain modern, nyaman untuk sehari-hari',
                price: 1500000,
                stock: 50,
                category: 'Fashion',
                image: 'https://example.com/nike-airmax.jpg',
                isActive: true
            },
            {
                name: 'Adidas Ultraboost 22',
                description: 'Sepatu lari dengan teknologi Boost, breathable upper, responsive cushioning',
                price: 1800000,
                stock: 40,
                category: 'Fashion',
                image: 'https://example.com/adidas-ultraboost.jpg',
                isActive: true
            },
            {
                name: 'Canon EOS R6 Mark II',
                description: 'Mirrorless camera full-frame dengan 24.2MP, Dual Pixel AF II, 8K video recording',
                price: 35000000,
                stock: 8,
                category: 'Photography',
                image: 'https://example.com/canon-eos.jpg',
                isActive: true
            },
            {
                name: 'DJI Mini 3 Pro',
                description: 'Drone compact dengan 4K HDR video, 48MP photo, 34min flight time',
                price: 9000000,
                stock: 15,
                category: 'Photography',
                image: 'https://example.com/dji-mini.jpg',
                isActive: true
            },
            {
                name: 'MacBook Air M2',
                description: 'Laptop ultra-thin dengan chip M2, 8GB RAM, 256GB SSD, 13.6 inch Liquid Retina display',
                price: 16000000,
                stock: 22,
                category: 'Electronics',
                image: 'https://example.com/macbook-air.jpg',
                isActive: true
            },
            {
                name: 'AirPods Pro 2',
                description: 'Wireless earbuds dengan Active Noise Cancellation, Spatial Audio, MagSafe charging',
                price: 3500000,
                stock: 60,
                category: 'Electronics',
                image: 'https://example.com/airpods-pro.jpg',
                isActive: true
            },
            {
                name: 'Samsung Galaxy Watch 6',
                description: 'Smartwatch dengan health monitoring, GPS, water resistant, 5-day battery life',
                price: 4500000,
                stock: 35,
                category: 'Electronics',
                image: 'https://example.com/galaxy-watch.jpg',
                isActive: true
            },
            {
                name: 'LEGO Creator Expert',
                description: 'Set LEGO advanced untuk kolektor dengan detail tinggi dan desain kompleks',
                price: 2500000,
                stock: 25,
                category: 'Toys',
                image: 'https://example.com/lego-creator.jpg',
                isActive: true
            },
            {
                name: 'Kindle Paperwhite',
                description: 'E-reader dengan layar 6.8 inch, waterproof, 8GB storage, adjustable warm light',
                price: 1800000,
                stock: 45,
                category: 'Electronics',
                image: 'https://example.com/kindle-paperwhite.jpg',
                isActive: true
            }
        ]);
        console.log('✅ Products created');
        
        console.log('\n📊 Summary of created data:');
        console.log(`- Admin users: ${adminUsers.length}`);
        console.log(`- Regular users: ${regularUsers.length}`);
        console.log(`- Products: ${products.length}`);
        
        console.log('\n🔑 Login credentials:');
        console.log('Admin accounts:');
        console.log('- Email: admin@toko.com, Password: admin123');
        console.log('- Email: admin2@toko.com, Password: admin123');
        console.log('\nUser accounts:');
        console.log('- Email: ahmad@email.com, Password: user123');
        console.log('- Email: siti@email.com, Password: user123');
        console.log('- Email: budi@email.com, Password: user123');
        console.log('- Email: dewi@email.com, Password: user123');
        console.log('- Email: eko@email.com, Password: user123');
        
    } catch (error) {
        console.error('❌ Error creating dummy data:', error);
        throw error;
    }
};

// Run the reset
resetDatabase();