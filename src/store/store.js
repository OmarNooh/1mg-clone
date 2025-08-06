import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import searchReducer from './slices/searchSlice';
import checkoutReducer from './slices/checkoutSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    search: searchReducer,
    checkout: checkoutReducer,
  },
});

export default store;
