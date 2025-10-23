import { NodeType } from '../enums/NodeType';

export interface IOpenAiCompletion {
  readonly title: string;
  readonly summary: string;
  readonly type: NodeType;
  readonly sentiment: number;
  readonly importance: number;
}
