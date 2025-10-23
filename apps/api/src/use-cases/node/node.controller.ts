import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { NodeService } from './node.service';
import { Node } from '../../entities/Node';
import { CreateNode } from '../../types/dto/CreateNode';

@Controller('node')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Post()
  async create(@Body() node: CreateNode): Promise<Node> {
    if (!node) {
      throw new BadRequestException();
    }
    return this.nodeService.create(node);
  }

  @Get('user')
  async getUser(@Param('userId') userId: string): Promise<Node[]> {
    return this.nodeService.getUserNodes(userId);
  }

  @Post('raw')
  async createRaw(@Body() node: Node): Promise<Node> {
    return this.nodeService.createRaw(node);
  }

  @Get('similar/:nodeId')
  async getSimilar(@Param('nodeId') nodeId: string): Promise<Node[]> {
    return this.nodeService.getBySimilarity(nodeId);
  }

  @Post('raw/many')
  async createManyRaw(@Body() body: { nodes: Node[] }): Promise<Node[]> {
    if (body.nodes.length === 0) {
      throw new BadRequestException(`nodes should not be empty`);
    }
    return this.nodeService.createManyRaw(body.nodes);
  }
}
