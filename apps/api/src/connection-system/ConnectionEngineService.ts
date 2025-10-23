import { Node } from '../entities/Node';
import { MoreThan, Not, Repository } from 'typeorm';
import { NodeConnection } from '../entities/NodeConnection';
import {
  calculateSimilarityScore,
  getRecentCutoff,
} from '../utils/memory-weigth.util';
import { randomUUID } from 'node:crypto';
import { OpenAiService } from '../openai/OpenAiService';
import { averageVectors, cosineSimilarity } from '../utils/vector.utils';

export class ConnectionEngineService {
  private nodeRepository: Repository<Node>;
  private nodeConnectionRepository: Repository<NodeConnection>;
  private openaiService: OpenAiService = new OpenAiService();

  public constructor(
    nodeRepository: Repository<Node>,
    nodeConnectionRepository: Repository<NodeConnection>,
  ) {
    this.nodeRepository = nodeRepository;
    this.nodeConnectionRepository = nodeConnectionRepository;
  }

  public async processNode(node: Node, connectedNodes: Node[]): Promise<void> {
    const candidates = await this.getCandidates(node, connectedNodes);
    const newConnections = await this.evaluateConnections(node, candidates);

    if (newConnections.length > 0) {
      await this.nodeConnectionRepository.save(newConnections);
    }
  }

  private async evaluateConnections(
    node: Node,
    candidates: { node: Node; adjustedScore: number }[],
  ): Promise<NodeConnection[]> {
    const newConnections: NodeConnection[] = [];

    for (const { node: candidate, adjustedScore } of candidates) {
      const similarity = adjustedScore;
      if (similarity < 0.55) continue;

      const confidence =
        similarity * 0.7 +
        this.getRecencyBoost(candidate) * 0.15 +
        (node.type === candidate.type ? 0.15 : 0);

      const summary = await this.openaiService.createRelationSummary(
        node,
        candidate,
      );
      const relationType = await this.openaiService.classifyRelationType(
        node.summary,
        candidate.summary,
      );

      const connection: NodeConnection = {
        id: randomUUID(),
        source: node,
        target: candidate,
        confidence,
        relation_type: relationType,
        summary,
      };

      newConnections.push(connection);

      if (confidence >= 0.8) {
        await this.reinforceNodes(node, candidate, confidence);
      }
    }

    // Persist both directions
    await this.nodeConnectionRepository.save(newConnections);
    const reverseConnections = newConnections.map((c) => ({
      ...c,
      id: randomUUID(),
      source: c.target,
      target: c.source,
      confidence: c.confidence * 0.95,
    }));
    await this.nodeConnectionRepository.save(reverseConnections);

    return newConnections;
  }

  private getRecencyBoost(candidate: Node): number {
    const daysAgo =
      (Date.now() - new Date(candidate.createdAt).getTime()) /
      (1000 * 60 * 60 * 24);
    return Math.max(0, 1 - daysAgo / 7); // full boost if <1 day, fades after a week
  }

  private async reinforceNodes(
    node: Node,
    candidate: Node,
    similarity: number,
  ): Promise<void> {
    const reinforcement = Math.min(1, similarity * 0.1);

    // Update memory weights proportionally
    node.memoryWeight = Math.min(1, (node.memoryWeight ?? 0) + reinforcement);
    candidate.memoryWeight = Math.min(
      1,
      (candidate.memoryWeight ?? 0) + reinforcement,
    );

    // Optional: reinforce importance slightly (small effect)
    node.importance = Math.min(1, node.importance + reinforcement * 0.65);
    candidate.importance = Math.min(
      1,
      candidate.importance + reinforcement * 0.65,
    );

    await this.nodeRepository.save([node, candidate]);
  }

  private async getCandidates(
    node: Node,
    connectedNodes: Node[],
  ): Promise<Array<{ node: Node; adjustedScore: number }>> {
    const { recentCutoff } = getRecentCutoff(node); // from memory-weight.util
    const contextEmbedding = averageVectors([
      node.embeddings,
      ...connectedNodes.map((connection) => connection.embeddings),
    ]);

    const recentNodes = await this.nodeRepository.find({
      where: {
        createdAt: MoreThan(recentCutoff),
        id: Not(node.id),
      },
      take: 100,
    });

    const scores = calculateSimilarityScore(
      node,
      connectedNodes,
      recentNodes,
      contextEmbedding,
    );

    return scores
      .filter((s) => s.adjustedScore >= 0.55)
      .sort((a, b) => b.adjustedScore - a.adjustedScore)
      .slice(0, 20);
  }
}
