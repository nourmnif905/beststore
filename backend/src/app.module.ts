import { Module } from '@nestjs/common';
import { ProductModule } from './produit/product.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
@Module({
  imports: [ProductModule,
     
     ConfigModule.forRoot({
      isGlobal: true, 
    }),
    PrismaModule,
    CategoryModule,],
})
export class AppModule {}
