import { Sequelize, DataTypes, Model } from 'sequelize';
import { User } from './domain';
import { UserServiceRepository } from './repository';

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
    phoneNumber: {
      type: DataTypes.STRING
    },
    address: DataTypes.STRING,
    status: DataTypes.STRING,
    hashedPassword: DataTypes.STRING,
    failedLoginAttempts: DataTypes.INTEGER,
    userLockExpiration: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'User',
    indexes: [
      {
        fields: ['phoneNumber']
      }
    ]
  }
);

export class SQLiteUserServiceRepository implements UserServiceRepository {
  constructor() {
    void this.initialize();
  }

  private async initialize(): Promise<void> {
    await sequelize.sync();
  }

  async addUser(user: User): Promise<void> {
    await UserModel.create(user);
  }

  async addUsers(users: User[]): Promise<void> {
    await UserModel.bulkCreate(users);
  }

  async updateUser(email: string, update: Partial<User>): Promise<void> {
    const userFromDb = await this.findUserByEmail(email);
    if (!userFromDb) {
      throw new Error('User not found');
    }
    await UserModel.update(update, { where: { email } });
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
