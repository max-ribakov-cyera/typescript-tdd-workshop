import { DataTypes, Model, Sequelize } from 'sequelize';
import { User } from './domain';
import { UserServiceRepository } from './in-memory-user-service-repository';

const sequelize = new Sequelize('sqlite::memory:', {
  dialect: 'sqlite',
  logging: false
});

class UserModel extends Model {}

UserModel.init(
  {
    email: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING,
    status: DataTypes.STRING,
    hashedPassword: DataTypes.STRING,
    failedLoginAttempts: DataTypes.NUMBER
  },
  {
    sequelize,
    modelName: 'User'
  }
);

export class InMemoryPostgresUserServiceRepository implements UserServiceRepository {
  constructor() {
    void this.initialize();
  }

  private async initialize(): Promise<void> {
    await sequelize.sync();
  }

  async addUser(user: User): Promise<void> {
    await UserModel.create(user);
  }

  async updateUser(user: User, update: Partial<User>): Promise<void> {
    const userFromDb = await this.findUserByEmail(user.email);
    if (!userFromDb) {
      throw new Error('User not found');
    }
    await UserModel.update(update, { where: { email: user.email } });
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    const user = await UserModel.findByPk(email);
    return user ? (user.toJSON() as User) : undefined;
  }

  async findByPhoneNumber(phone: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ where: { phoneNumber: phone } });
    return user ? (user.toJSON() as User) : undefined;
  }
}
