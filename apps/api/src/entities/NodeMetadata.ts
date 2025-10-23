import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NodeSources } from '../enums/NodeSources';
import { IPosition } from '../types/IPosition';

//type NodeMetadata = {
//   tags?: string[];
//   source?: "manual" | "spotify" | "notion" | "calendar" | "github" | "gpt";
//   color?: string; // for visualization
//   position?: { x: number; y: number; z: number }; // 3D graph coords
//   lastSynced?: string;
// };

@Entity()
export class NodeMetadata {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { array: true, nullable: true })
  tags?: string[];

  @Column({
    type: 'enum',
    enum: NodeSources,
    default: NodeSources.other,
  })
  source?: NodeSources;

  @Column({ nullable: true })
  color?: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  position?: IPosition;

  @UpdateDateColumn({ type: 'timestamptz' })
  lastSyncedAt?: Date;
}
