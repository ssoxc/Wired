import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Node } from '../../entities/Node';
import { Not, Repository } from 'typeorm';
import { CreateNode } from '../../types/dto/CreateNode';
import { OpenAiService } from '../../openai/OpenAiService';
import { randomUUID } from 'node:crypto';
import { ConnectionEngineService } from '../../connection-system/ConnectionEngineService';
import { NodeConnection } from '../../entities/NodeConnection';
import { NodeConnectionService } from '../node-connection/node-connection.service';

@Injectable()
export class NodeService {
  private readonly nodeRepository!: Repository<Node>;
  private readonly openaiService: OpenAiService = new OpenAiService();
  private readonly connectionEngineService: ConnectionEngineService;
  private readonly nodeConnectionService: NodeConnectionService;

  public constructor(
    @InjectRepository(Node) nodeRepository: Repository<Node>,
    @InjectRepository(NodeConnection)
    nodeConnectionRepository: Repository<NodeConnection>,
    @Inject(NodeConnectionService)
    nodeConnectionService: NodeConnectionService,
  ) {
    this.nodeRepository = nodeRepository;
    this.connectionEngineService = new ConnectionEngineService(
      nodeRepository,
      nodeConnectionRepository,
    );
    this.nodeConnectionService = nodeConnectionService;
  }

  public async create(_node: CreateNode): Promise<Node> {
    const nodeId = randomUUID();
    const content = JSON.stringify(_node.content);
    const embeddings = await this.openaiService.createEmbeddings(content);
    const completions = await this.openaiService.createCompletion(content);
    const metadataTags = await this.openaiService.createMetadataTags(content);
    const node: Partial<Node> = {
      id: nodeId,
      ...completions,
      embeddings,
      // ToDo Get user id from auth context
      user: { id: '087f9893-eebe-42e4-8e7a-7639ba6ca943' },
      content: _node.content,
      metadata: {
        id: randomUUID(),
        tags: metadataTags.metadataTags,
        tagsEmbedding: metadataTags.metadataTagEmbedding,
        ..._node.metadata,
      },
    };
    const savedNode = await this.nodeRepository.save(node);
    const connectedNodes =
      await this.nodeConnectionService.getConnectedNodesByNodeId(savedNode);

    await this.connectionEngineService.processNode(savedNode, connectedNodes);

    return savedNode;
  }

  public async getNodeById(id: string): Promise<Node> {
    const node = await this.nodeRepository.findOne({
      where: { id },
    });
    if (!node) {
      throw new NotFoundException(`Node with id ${id} not found`);
    }
    return node;
  }

  public async createRaw(node: Node): Promise<Node> {
    return this.nodeRepository.save(node);
  }

  public async getBySimilarity(nodeId: string): Promise<Node[]> {
    const node = await this.getNodeById(nodeId);

    return await this.nodeRepository
      .createQueryBuilder('node')
      .addSelect(
        `embeddings <-> '${JSON.stringify(node.embeddings)}'`,
        'distance',
      )
      .where({ id: Not(node.id) })
      .orderBy('distance', 'ASC')
      .limit(5)
      .getMany();
  }

  public async createManyRaw(nodes: Node[]): Promise<Node[]> {
    return this.nodeRepository.save(nodes);
  }

  public async getUserNodes(userId: string): Promise<Node[]> {
    return await this.nodeRepository.find({
      where: { user: { id: userId } },
    });
  }
}
