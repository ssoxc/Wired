import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeConnection } from '../../entities/NodeConnection';
import { NodeConnectionService } from './node-connection.service';
import { Node } from '../../entities/Node';

@Module({
  imports: [TypeOrmModule.forFeature([NodeConnection, Node])],
  providers: [NodeConnectionService],
  exports: [TypeOrmModule],
})
export class NodeConnectionModule {}
