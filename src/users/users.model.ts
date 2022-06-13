import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { Entity } from 'typeorm';

@Entity()
@Table({ tableName: 'users' })
export class User extends Model<User> {
  @ApiProperty({ example: 1 })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Sergey' })
  @Column({ type: DataType.STRING, allowNull: false })
  firstname: string;

  @ApiProperty({ example: 'Platonenko' })
  @Column({ type: DataType.STRING, allowNull: false })
  lastname: string;

  @ApiProperty({ example: ['test', 'test', 'test'] })
  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
  wishList: string[];

  @ApiProperty({ example: 2 })
  @Column({ type: DataType.INTEGER, allowNull: true })
  giftsFor: number;
}
