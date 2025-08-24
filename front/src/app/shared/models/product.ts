export type ProductStatus = 'IN_STOCK' | 'ON_ORDER';

export interface Product {
  id: string;  
  name: string;
  description: string;
  price: number;
  image: string;         // URL ou nom de fichier image
  status: ProductStatus; // 'IN_STOCK' ou 'ON_ORDER'
  categoryName: string; 
}
