import { Table, Column, Model, DataType, BelongsTo } from 'sequelize-typescript';
import { User } from 'src/user/user.entity';

@Table({
  tableName: 'pl_notifications'
})
export class Notification extends Model {
  @Column({
    type: DataType.NUMBER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
    field: 'user_id'
  })
  userId: number;

  @Column({
    type: DataType.INTEGER,
    field: 'brand_id'
  })
  brandId: number;

  @Column({
    type: DataType.INTEGER,
    field: 'company_id'
  })
  companyId: number;

  @Column({
    type: DataType.STRING,
  })
  title: string

  @Column({
    type: DataType.STRING,
  })
  type: string

  @Column({
    type: DataType.TEXT,
  })
  message: string

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

  @BelongsTo(() => User, 'userId')
  asUser: User
}