import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { NodeModule } from './use-cases/node/node.module';
import { UserModule } from './use-cases/user/user.module';
import { NodeConnectionModule } from './use-cases/node-connection/node-connection.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true, // keep false in production
      ssl: { rejectUnauthorized: false },
    }),
    NodeModule,
    UserModule,
    NodeConnectionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
