import { Sequelize } from 'sequelize';
import path from 'path';

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'database.js'))[env];

let sequelize: Sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Import models
import initUserModel from './User';
import initProductModel from './Product';
import initCartModel from './Cart';
import initCartItemModel from './CartItem';
import initOrderModel from './Order';
import initOrderItemModel from './OrderItem';

// Initialize models
const User = initUserModel(sequelize);
const Product = initProductModel(sequelize);
const Cart = initCartModel(sequelize);
const CartItem = initCartItemModel(sequelize);
const Order = initOrderModel(sequelize);
const OrderItem = initOrderItemModel(sequelize);

// Define associations
const models = { User, Product, Cart, CartItem, Order, OrderItem };

Object.values(models).forEach((model: any) => {
    if (model.associate) {
        model.associate(models);
    }
});

const db = {
    sequelize,
    Sequelize,
    User,
    Product,
    Cart,
    CartItem,
    Order,
    OrderItem
};

export { sequelize, Sequelize, User, Product, Cart, CartItem, Order, OrderItem };
export default db;