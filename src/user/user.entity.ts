import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'pl_users'
})
export class User extends Model<User> {
  @Column({
    type: DataType.NUMBER,
    autoIncrement: true,
    primaryKey: true,
    field: 'user_id'
  })
  id: number;

  @Column({
    type: DataType.STRING,
    field: 'first_name'
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    field: 'last_name'
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
  })
  email: string;

  @Column({
    type: DataType.STRING,
  })
  password: string;

  @Column({
    type: DataType.NUMBER,
  })
  status: number

  @Column({
    type: DataType.NUMBER,
    field: 'created_by'
  })
  createdBy: number

  @Column({
    type: DataType.NUMBER,
    field: 'updated_by'
  })
  updatedBy: number

  @Column({
    type: DataType.BOOLEAN,
    field: 'is_super_admin'
  })
  isSuperAdmin: number


  @Column({
    type: DataType.DATE,
    field: 'created_at'
  })
  createdAt?: Date

  @Column({
    type: DataType.DATE,
    field: 'updated_at'
  })
  updatedAt?: Date
}