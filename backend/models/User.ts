import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';

interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    phone?: string;
    address?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'role' | 'phone' | 'address'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public role!: 'admin' | 'user';
    public phone?: string;
    public address?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public async comparePassword(candidatePassword: string): Promise<boolean> {
        return await bcrypt.compare(candidatePassword, this.password);
    }

    public static associate(models: any): void {
        User.hasMany(models.Cart, { foreignKey: 'userId', as: 'carts' });
        User.hasMany(models.Order, { foreignKey: 'userId', as: 'orders' });
    }
}

export default (sequelize: Sequelize): typeof User => {
    User.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true, len: [2, 100] } },
        email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
        password: { type: DataTypes.STRING, allowNull: false, validate: { len: [6, 10] } },
        role: { type: DataTypes.ENUM('admin', 'user'), defaultValue: 'user' },
        phone: { type: DataTypes.STRING, allowNull: true },
        address: { type: DataTypes.TEXT, allowNull: true },
    }, {
        sequelize,
        tableName: 'users',
        timestamps: true,
        hooks: {
            beforeCreate: async (user: User) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
            beforeUpdate: async (user: User) => {
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        }
    });

    return User;
}