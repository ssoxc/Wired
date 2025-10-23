import { Node } from '../entities/Node';
import { NodeType } from '../enums/NodeType';
import { BASE_NODE_TYPE_LIFETIME } from '../connection-system/BASE_NODE_TYPE_LIFETIME';
import { cosineSimilarity } from './vector.utils';
import { clamp } from './math.util';

export function getRecentCutoff(node: Node): {
  recentCutoff: Date;
  temperature: number;
} {
  const baseWindow = getBaseLifetime(node.type);
  const activityBoost = Math.min(
    ((node.connectionCount || 0) / 10) * (node.avgConnectionConfidence || 0),
    2,
  );
  const timeSinceLast = node.lastConnectedAt
    ? (Date.now() - node.lastConnectedAt.getTime()) / (1000 * 60 * 60 * 24)
    : baseWindow;
  const decayFactor = Math.max(0.3, 1 - timeSinceLast / baseWindow);
  const temperature = Math.min(
    1,
    (activityBoost * decayFactor + node.importance) / 3,
  );
  const adjustedWindowDays = baseWindow * (1 + temperature * 1.5);
  const recentCutoff = new Date(
    Date.now() - adjustedWindowDays * 24 * 60 * 60 * 1000,
  );

  return { recentCutoff, temperature };
}

export const calculateTagBoost = (
  targetNode: Node,
  sourceNode: Node,
): number => {
  const sourceMetadataTagsEmbedding = sourceNode.metadata.tagsEmbedding;
  const targetMetadataTagsEmbedding = targetNode.metadata.tagsEmbedding;

  if (
    !sourceMetadataTagsEmbedding?.length ||
    !targetMetadataTagsEmbedding?.length
  )
    return 0;

  let totalScore = 0;
  let comparisons = 0;

  const score = cosineSimilarity(
    sourceMetadataTagsEmbedding,
    targetMetadataTagsEmbedding,
  );
  if (score > 0.7) {
    totalScore += score;
    comparisons++;
  }

  if (comparisons === 0) return 0;
  return totalScore / comparisons;
};

export const calculateSimilarityScore = (
  node: Node,
  connectedNodes: Node[],
  recentNodes: Node[],
  contextEmbedding: number[],
): Array<{ node: Node; adjustedScore: number }> => {
  return recentNodes.map((candidate) => {
    let similarity = cosineSimilarity(contextEmbedding, candidate.embeddings);
    const tagBoostScore = calculateTagBoost(candidate, node);
    if (candidate.type === node.type) similarity += 0.05;

    const hasMutual = connectedNodes.some((cn) => candidate.id === cn.id);
    if (hasMutual) similarity += 0.1;

    const importanceOverlap =
      1 - Math.abs(node.importance - candidate.importance);
    similarity += importanceOverlap * 0.05;

    return {
      node: candidate,
      adjustedScore: clamp(similarity + tagBoostScore, 0, 1),
    };
  });
};

export function getBaseLifetime(type: NodeType): number {
  return BASE_NODE_TYPE_LIFETIME[type] ?? 14; // safe fallback
}
