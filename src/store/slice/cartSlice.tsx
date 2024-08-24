// store/slice/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductType, CartProduct } from "@/types/datatype";

export interface CartState {
  products: CartProduct[];
  totalQuantity: number;
}

const initialState: CartState = {
  products: [],
  totalQuantity: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<CartProduct>) => {
      const product = action.payload;
      const existingProduct = state.products.find(
        (item) => item.id === product.id && item.size === product.size,
      );
      if (existingProduct) {
        if (existingProduct.quantity != null) {
          if (product.quantity != null) {
            existingProduct.quantity += product.quantity;
          }
        }
      } else {
        state.products.push(product);
      }
      if (product.quantity != null) {
        state.totalQuantity += product.quantity;
      }
    },
    incrementProduct: (
      state,
      action: PayloadAction<{ id: number; size: string }>,
    ) => {
      const { id, size } = action.payload;
      const existingProduct = state.products.find(
        (item) => item.id === id && item.size === size,
      );
      if (existingProduct) {
        if (existingProduct?.quantity != null) {
          existingProduct.quantity += 1;
        }
        state.totalQuantity += 1;
      }
    },
    decrementProduct: (
      state,
      action: PayloadAction<{ id: number; size: string }>,
    ) => {
      const { id, size } = action.payload;
      const existingProduct = state.products.find(
        (item) => item.id === id && item.size === size,
      );
      if (existingProduct) {
        if (existingProduct?.quantity != null && existingProduct.quantity > 1) {
          existingProduct.quantity -= 1;
          state.totalQuantity -= 1;
        } else {
          state.products = state.products.filter(
            (product) => !(product.id === id && product.size === size),
          );
          if (existingProduct.quantity != null) {
            state.totalQuantity -= existingProduct.quantity;
          }
        }
      }
    },
    removeProduct: (
      state,
      action: PayloadAction<{ id: number; size: string }>,
    ) => {
      const { id, size } = action.payload;
      const existingProduct = state.products.find(
        (item) => item.id === id && item.size === size,
      );
      if (existingProduct) {
        if (existingProduct.quantity != null) {
          state.totalQuantity -= existingProduct.quantity;
        }
        state.products = state.products.filter(
          (product) => !(product.id === id && product.size === size),
        );
      }
    },
    clearCart: (state) => {
      state.products = [];
      state.totalQuantity = 0;
    },
  },
});

export const CartActions = cartSlice.actions;

export default cartSlice.reducer;
