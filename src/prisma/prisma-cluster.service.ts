import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';

type PrismaExecutor<T> = (client: PrismaClient) => Promise<T>;

@Injectable()
export class PrismaClusterService implements OnModuleInit, OnModuleDestroy {
  private readonly master: PrismaClient;
  private readonly slave: PrismaClient;

  constructor() {
    const masterUrl =
      process.env.DATABASE_URL_MASTER ?? process.env.DATABASE_URL;

    if (!masterUrl) {
      throw new Error(
        'DATABASE_URL_MASTER (or DATABASE_URL) must be set to configure the Prisma master connection.',
      );
    }

    const slaveUrl = process.env.DATABASE_URL_REPLICA ?? masterUrl;

    this.master = new PrismaClient({
      datasources: { db: { url: masterUrl } },
    });

    this.slave =
      slaveUrl === masterUrl
        ? this.master
        : new PrismaClient({
            datasources: { db: { url: slaveUrl } },
          });
  }

  async onModuleInit(): Promise<void> {
    await this.master.$connect();

    if (this.slave !== this.master) {
      await this.slave.$connect();
    }
  }

  async onModuleDestroy(): Promise<void> {
    const clients = new Set([this.master, this.slave]);

    await Promise.all(
      Array.from(clients).map((client) => client.$disconnect()),
    );
  }

  get masterClient(): PrismaClient {
    return this.master;
  }

  get slaveClient(): PrismaClient {
    return this.slave;
  }

  async withMaster<T>(executor: PrismaExecutor<T>): Promise<T> {
    return executor(this.master);
  }

  async withSlave<T>(executor: PrismaExecutor<T>): Promise<T> {
    return executor(this.slave);
  }
}
