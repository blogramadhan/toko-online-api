import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface CartItemAttributes {
    id: number;
    cartId: number;
    productId: number;
    quantity: number;
    price: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface CartItemCreationAttributes extends Optional<CartItemAttributes, 'id' | 'quantity'> {}

export class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes> implements CartItemAttributes {
    public id!: number;
    public cartId!: number;
    public productId!: number;
    public quantity!: number;
    public price!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Association properties
    public readonly cart?: any;
    public readonly product?: any;

    public static associate(models: any): void {
        CartItem.belongsTo(models.Cart, { foreignKey: 'cartId', as: 'cart' });
        CartItem.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
    }
}

export default (sequelize: Sequelize): typeof CartItem => {
    CartItem.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        cartId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'carts', key: 'id' } },
        productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'id' } },
        quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1, validate: { min: 1 } },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
    }, {
        sequelize,
        tableName: 'cart_items',
        timestamps: true
    });

    return CartItem;
};