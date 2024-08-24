import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartProduct } from "@/types/datatype";

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
    setCart: (state, action: PayloadAction<CartProduct[]>) => {
      state.products = action.payload;
      state.totalQuantity = action.payload.reduce(
        (total, product) => total + (product.quantity ?? 0),
        0,
      );
    },
    addProduct: (state, action: PayloadAction<CartProduct>) => {
      const product = action.payload;
      const existingProduct = state.products.find(
        (item) => item.id === product.id && item.size === product.size,
      );
      if (existingProduct) {
        existingProduct.quantity =
          (existingProduct.quantity ?? 0) + (product.quantity ?? 0);
      } else {
        state.products.push(product);
      }
      state.totalQuantity += product.quantity ?? 0;
      localStorage.setItem("cart", JSON.stringify(state.products)); // Save to localStorage
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
        existingProduct.quantity = (existingProduct.quantity ?? 0) + 1;
        state.totalQuantity += 1;
        localStorage.setItem("cart", JSON.stringify(state.products)); // Save to localStorage
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
        if (existingProduct?.quantity ?? 0 > 1) {
          existingProduct.quantity! -= 1;
          state.totalQuantity -= 1;
        } else {
          state.products = state.products.filter(
            (product) => !(product.id === id && product.size === size),
          );
          state.totalQuantity -= 1;
        }
        localStorage.setItem("cart", JSON.stringify(state.products)); // Save to localStorage
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
        state.totalQuantity -= existingProduct.quantity ?? 0;
        state.products = state.products.filter(
          (product) => !(product.id === id && product.size === size),
        );
        localStorage.setItem("cart", JSON.stringify(state.products)); // Save to localStorage
      }
    },
    clearCart: (state) => {
      state.products = [];
      state.totalQuantity = 0;
      localStorage.removeItem("cart"); // Clear from localStorage
    },
  },
});

export const CartActions = cartSlice.actions;

export default cartSlice.reducer;
