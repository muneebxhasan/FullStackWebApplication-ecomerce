export interface ProductType {
  id: number | null; // Changed from number | undefined to number | null
  images: Imagetype[];
  name: string | null;
  clothType: string | null;
  gender: string | null;
  price: string | null;
}

export interface CartProduct extends ProductType {
  quantity: number | null;
  size: string | null;
}

export interface ReadProductType {
  id: number; // Changed from number | undefined to number | null
  images: Imagetype[];
  name: string;
  clothType: string;
  gender: string;
  price: string;
}
export interface NoCartProduct extends ProductType {
  quantity: number;
  size: string;
}

export type Imagetype = {
  imageUrl: string;
};
export type nImagetype = {
  url: string;
};

export type GETProductResponse = {
  id: number;
  name: string;
  clothType: string;
  gender: string;
  price: string;
  images: Imagetype[];
};
