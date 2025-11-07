import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface ProductAttributes {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    category?: string;
    image?: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'description' | 'stock' | 'category' | 'image' | 'isActive'> {}

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public id!: number;
    public name!: string;
    public description?: string;
    public price!: number;
    public stock!: number;
    public category?: string;
    public image?: string;
    public isActive!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static associate(models: any): void {
        Product.hasMany(models.CartItem, { foreignKey: 'productId', as: 'cartItems' });
        Product.hasMany(models.OrderItem, { foreignKey: 'productId', as: 'orderItems' });
    }
}

export default (sequelize: Sequelize): typeof Product => {
    Product.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true, len: [2, 200] } },
        description: { type: DataTypes.TEXT, allowNull: true },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
        stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0 } },
        category: { type: DataTypes.STRING, allowNull: true },
        image: { type: DataTypes.STRING, allowNull: true },
        isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    }, {
        sequelize,
        tableName: 'products',
        timestamps: true,
    });

    return Product;
}