import { Module } from '@nestjs/common';
import { NodeController } from './node.controller';
import { NodeService } from './node.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeContent } from '../../entities/NodeContent';
import { NodeMedia } from '../../entities/NodeMedia';
import { NodeMetadata } from '../../entities/NodeMetadata';
import { Node } from '../../entities/Node';
import { NodeConnection } from '../../entities/NodeConnection';
import { ConnectionEngineService } from '../../connection-system/ConnectionEngineService';
import { NodeConnectionService } from '../node-connection/node-connection.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Node,
      NodeContent,
      NodeMedia,
      NodeMetadata,
      NodeConnection,
    ]),
  ],
  controllers: [NodeController],
  providers: [NodeService, ConnectionEngineService, NodeConnectionService],
  exports: [TypeOrmModule],
})
export class NodeModule {}
