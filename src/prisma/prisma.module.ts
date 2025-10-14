import { Global, Module } from '@nestjs/common';
import { PrismaClusterService } from './prisma-cluster.service';

@Global()
@Module({
  providers: [PrismaClusterService],
  exports: [PrismaClusterService],
})
export class PrismaModule {}
