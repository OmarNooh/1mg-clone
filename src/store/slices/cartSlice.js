import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for cart operations
export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async ({ product, quantity = 1 }) => {
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists
    const existingItemIndex = existingCart.findIndex(item => item.id === product.id);
    
    let updatedCart;
    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      updatedCart = existingCart.map((item, index) => 
        index === existingItemIndex 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Add new item
      updatedCart = [...existingCart, { ...product, quantity }];
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    return updatedCart;
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async (productId) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = existingCart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    return updatedCart;
  }
);

export const updateQuantityAsync = createAsyncThunk(
  'cart/updateQuantityAsync',
  async ({ productId, quantity }) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = existingCart.map(item => 
      item.id === productId ? { ...item, quantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    return updatedCart;
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCartAsync',
  async () => {
    localStorage.removeItem('cart');
    return [];
  }
);

export const loadCartFromStorage = createAsyncThunk(
  'cart/loadCartFromStorage',
  async () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    calculateTotals: (state) => {
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to cart
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        cartSlice.caseReducers.calculateTotals(state);
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Remove from cart
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = action.payload;
        cartSlice.caseReducers.calculateTotals(state);
      })
      
      // Update quantity
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        state.items = action.payload;
        cartSlice.caseReducers.calculateTotals(state);
      })
      
      // Clear cart
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
        state.totalQuantity = 0;
        state.totalAmount = 0;
      })
      
      // Load cart from storage
      .addCase(loadCartFromStorage.fulfilled, (state, action) => {
        state.items = action.payload;
        cartSlice.caseReducers.calculateTotals(state);
      });
  },
});

export const { calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;
