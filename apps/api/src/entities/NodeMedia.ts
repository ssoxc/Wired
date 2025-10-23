import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { NodeMediaType } from '../enums/NodeMediaType';

@Entity()
export class NodeMedia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: NodeMediaType,
    default: NodeMediaType.other,
  })
  type: NodeMediaType;

  @Column({ nullable: true })
  file?: string;
}
