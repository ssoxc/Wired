import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Node } from './Node';
import { NodeRelationType } from '../enums/NodeRelationType';

@Entity('node_connections')
export class NodeConnection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Node, (node) => node.outgoingConnections)
  @JoinColumn({ name: 'sourceNodeId' })
  source: Node;

  @Column()
  sourceNodeId?: string;

  @ManyToOne(() => Node, (node) => node.incomingConnections)
  @JoinColumn({ name: 'targetNodeId' })
  target: Node;

  @Column()
  targetNodeId?: string;

  @Column({ type: 'enum', enum: NodeRelationType })
  relation_type: NodeRelationType;

  @Column('float')
  confidence: number;

  @Column()
  summary: string;

  @CreateDateColumn()
  createdAt?: Date;
}
