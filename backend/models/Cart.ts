import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface CartAttributes {
    id: number;
    userId: number;
    status: 'active' | 'completed' | 'abandoned';
    totalAmount: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface CartCreationAttributes extends Optional<CartAttributes, 'id' | 'status' | 'totalAmount'> {}

export class Cart extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
    public id!: number;
    public userId!: number;
    public status!: 'active' | 'completed' | 'abandoned';
    public totalAmount!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Association properties
    public items?: any[];

    public static associate(models: any): void {
        Cart.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        Cart.hasMany(models.CartItem, { foreignKey: 'cartId', as: 'items' });
    }
}

export default (sequelize: Sequelize): typeof Cart => {
    Cart.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
        status: { type: DataTypes.ENUM('active', 'completed', 'abandoned'), defaultValue: 'active' },
        totalAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
    }, {
        sequelize,
        tableName: 'carts',
        timestamps: true,
    });

    return Cart;
}