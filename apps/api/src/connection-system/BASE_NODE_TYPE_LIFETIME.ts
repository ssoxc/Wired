import { NodeType } from '../enums/NodeType';

export const BASE_NODE_TYPE_LIFETIME: Record<NodeType, number> = {
  [NodeType.emotion]: 3,
  [NodeType.thought]: 5,
  [NodeType.task]: 10,
  [NodeType.event]: 14,
  [NodeType.habit]: 30,
  [NodeType.topic]: 30,
  [NodeType.memory]: 60,
  [NodeType.goal]: 90,
  [NodeType.relationship]: 90,
  [NodeType.person]: 90,
  [NodeType.idea]: 7, // short-lived by default
};
