export type ProductStatus = 'IN_STOCK' | 'ON_ORDER';

export interface Product {
  title: string;
  description: string;
  price: number;
  photo: string;         // URL ou nom de fichier image
  status: ProductStatus; // 'IN_STOCK' ou 'ON_ORDER'
}
