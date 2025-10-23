import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NodeType } from '../enums/NodeType';
import { NodeContent } from './NodeContent';
import { NodeMetadata } from './NodeMetadata';
import { User } from './User';
import { NodeConnection } from './NodeConnection';

@Entity()
export class Node {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: NodeType,
    default: NodeType.thought,
  })
  type: NodeType;

  @OneToMany(() => NodeContent, (nodeContent) => nodeContent.node, {
    cascade: true,
  })
  content: NodeContent[];

  @ManyToOne(() => User, (user: User) => user.id)
  user: User | Partial<User>;

  @Column({
    type: 'vector',
    nullable: true,
    transformer: {
      to: (value: number[]) => (value ? `[${value.join(',')}]` : null),
      from: (value: string) =>
        value ? value.slice(1, -1).split(',').map(Number) : null,
    },
  })
  embeddings: number[];

  @Column()
  summary: string;

  @Column('float')
  importance: number;

  @Column({ type: 'float' })
  sentiment: number;

  @Column({ type: 'float', default: 0 })
  memoryWeight?: number = 0;

  @OneToMany(() => NodeConnection, (connection) => connection.source)
  outgoingConnections?: NodeConnection[];

  @OneToMany(() => NodeConnection, (connection) => connection.target)
  incomingConnections?: NodeConnection[];

  @OneToOne(
    () => NodeMetadata,
    (nodeMetadata: NodeMetadata) => nodeMetadata.id,
    { cascade: true, onDelete: 'CASCADE' },
  )
  @JoinColumn()
  metadata: NodeMetadata;

  @CreateDateColumn()
  createdAt: Date;

  get connectionCount(): number {
    const incoming = this.incomingConnections?.length ?? 0;
    const outgoing = this.outgoingConnections?.length ?? 0;
    return incoming + outgoing;
  }
  get avgConnectionConfidence(): number {
    const connections = [
      ...(this.incomingConnections ?? []),
      ...(this.outgoingConnections ?? []),
    ];
    if (connections.length === 0) return 0;
    const avg =
      connections.reduce((sum, c) => sum + (c.confidence ?? 0), 0) /
      connections.length;
    return Number(avg.toFixed(3));
  }
  get lastConnectedAt(): Date | null {
    const connections = [
      ...(this.incomingConnections ?? []),
      ...(this.outgoingConnections ?? []),
    ];
    if (connections.length === 0) return null;
    const timestamps = connections.map((c) => new Date(c.createdAt!).getTime());
    return new Date(Math.max(...timestamps));
  }
}
