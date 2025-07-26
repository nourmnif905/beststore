import { Module } from '@nestjs/common';
import { ProductModule } from './produit/product.module';
import { CartModule } from './cart/cart.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
@Module({
  imports: [ProductModule,
       CartModule
     ,ConfigModule.forRoot({
      isGlobal: true, 
    }),
    PrismaModule,],
})
export class AppModule {}
