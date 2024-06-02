import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  onModuleInit() {
    this.$connect()
      .then(() => console.log('connected to db'))
      .catch((error) => console.log(error));
  }
  async onModuleDestroy() {
    await this.$disconnect()
      .then(() => console.log('disconnect to db'))
      .catch((error) => console.log(error));
  }
}
