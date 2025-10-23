import { NodeContent } from '../../entities/NodeContent';
import { NodeMetadata } from '../../entities/NodeMetadata';

export interface CreateNode {
  readonly content: NodeContent[];
  readonly metadata?: Partial<NodeMetadata>;
}
