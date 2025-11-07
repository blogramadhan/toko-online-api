import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface OrderItemAttributes {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    productName: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, 'id'> {}

export class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
    public id!: number;
    public orderId!: number;
    public productId!: number;
    public quantity!: number;
    public price!: number;
    public productName!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static associate(models: any): void {
        OrderItem.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
        OrderItem.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
    }
}

export default (sequelize: Sequelize): typeof OrderItem => {
    OrderItem.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        orderId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'orders', key: 'id' } },
        productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'id' } },
        quantity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        productName: { type: DataTypes.STRING, allowNull: false }
    }, {
        sequelize,
        tableName: 'order_items',
        timestamps: true
    });

    return OrderItem;
}