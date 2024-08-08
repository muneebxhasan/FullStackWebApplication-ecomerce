export interface ProductType {
  id: number;
  src: string;
  name: string;
  clothType: string;
  price: string;
}

export interface CartProduct extends ProductType {
  quantity: number;
  size: string;
}
