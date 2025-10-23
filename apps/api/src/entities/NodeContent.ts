import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NodeMedia } from './NodeMedia';
import { Node } from './Node';

@Entity()
export class NodeContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  data: string;

  @OneToOne(() => NodeMedia, (nodeMedia) => nodeMedia.id, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  media: NodeMedia;

  @ManyToOne(() => Node, (node) => node.content, { onDelete: 'CASCADE' })
  node: Node;
}
