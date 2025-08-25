
export enum ProductStatus {
  InStock = 'en stock',
  Preorder = 'sur commande'
}

export interface Product {
  id: string;  
  name: string;
  description: string;
  price: number;
  stock:number;
  image: string;         // URL ou nom de fichier image
  status: ProductStatus; // 'IN_STOCK' ou 'ON_ORDER'
  categoryName: string; 
}
