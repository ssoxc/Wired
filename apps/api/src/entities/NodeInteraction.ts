import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NodeType } from '../enums/NodeType';
import { User } from './User';

@Entity()
export class NodeInteraction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  userId: string;

  @Column({ type: 'enum', enum: NodeType })
  nodeType: NodeType;

  @Column('float')
  deltaDays: number;

  @CreateDateColumn()
  createdAt: Date;
}
