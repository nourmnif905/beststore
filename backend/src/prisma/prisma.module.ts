// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()  // pour que PrismaService soit accessible partout sans réimporter explicitement
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
