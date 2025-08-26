import { Module } from '@nestjs/common';
import { ProductModule } from './produit/product.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { CartModule } from './Cart/cart.module';
import { CategoryAttributeModule } from './category-attribute/category-attribute.module';
import { ProductSpecificationModule } from './product-specification/product-specification.module';
import { CommandeModule } from './commande/commande.module';
@Module({
  imports: [ProductModule,CartModule,
     
     ConfigModule.forRoot({
      isGlobal: true, 
    }),
    PrismaModule,
    CategoryModule,
    CategoryAttributeModule,
    ProductSpecificationModule,
    CommandeModule,],
})
export class AppModule {}
