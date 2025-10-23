import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { NodeConnection } from '../../entities/NodeConnection';
import { InjectRepository } from '@nestjs/typeorm';
import { Node } from '../../entities/Node';
import { getRecentCutoff } from '../../utils/memory-weigth.util';

@Injectable()
export class NodeConnectionService {
  private readonly nodeConnectionRepository: Repository<NodeConnection>;
  private readonly nodeRepository: Repository<Node>;

  public constructor(
    @InjectRepository(NodeConnection)
    nodeConnectionRepository: Repository<NodeConnection>,
    @InjectRepository(Node)
    nodeRepository: Repository<Node>,
  ) {
    this.nodeConnectionRepository = nodeConnectionRepository;
    this.nodeRepository = nodeRepository;
  }

  public async getConnectedNodesByNodeId(node: Node): Promise<Node[]> {
    const connected = await this.nodeConnectionRepository.find({
      where: [{ sourceNodeId: node.id }, { targetNodeId: node.id }],
      relations: ['source', 'target', 'source.metadata', 'target.metadata'],
      order: { createdAt: 'DESC' },
      take: 10,
    });

    return connected
      .map((c) => (c.sourceNodeId === node.id ? c.target : c.source))
      .filter(Boolean);
  }
}
