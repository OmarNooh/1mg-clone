import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock shipping rates API
const getShippingRates = async (address) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    { id: 'standard', name: 'Standard Delivery', price: 50, estimatedDays: '3-5 business days' },
    { id: 'express', name: 'Express Delivery', price: 150, estimatedDays: '1-2 business days' },
    { id: 'overnight', name: 'Overnight Delivery', price: 300, estimatedDays: 'Next business day' },
  ];
};

// Mock payment intent creation
const createPaymentIntent = async (amount, paymentMethod) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    id: `pi_${Date.now()}`,
    clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
    amount: amount * 100, // Convert to cents
    currency: 'tzs',
    status: 'requires_confirmation',
  };
};

// Async thunks
export const fetchShippingRates = createAsyncThunk(
  'checkout/fetchShippingRates',
  async (address) => {
    const rates = await getShippingRates(address);
    return rates;
  }
);

export const createPaymentIntentAsync = createAsyncThunk(
  'checkout/createPaymentIntent',
  async ({ amount, paymentMethod }) => {
    const paymentIntent = await createPaymentIntent(amount, paymentMethod);
    return paymentIntent;
  }
);

export const processOrder = createAsyncThunk(
  'checkout/processOrder',
  async (orderData) => {
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const orderId = `ORD-${Date.now()}`;
    const order = {
      id: orderId,
      ...orderData,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    };
    
    // Store order in localStorage for order history
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(existingOrders));
    
    return order;
  }
);

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    currentStep: 1,
    shippingAddress: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Tanzania',
    },
    shippingMethod: null,
    shippingRates: [],
    paymentMethod: null,
    paymentIntent: null,
    order: null,
    loading: false,
    error: null,
    shippingRatesLoading: false,
    paymentLoading: false,
    orderProcessing: false,
  },
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    updateShippingAddress: (state, action) => {
      state.shippingAddress = { ...state.shippingAddress, ...action.payload };
    },
    setShippingMethod: (state, action) => {
      state.shippingMethod = action.payload;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    resetCheckout: (state) => {
      state.currentStep = 1;
      state.shippingAddress = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Tanzania',
      };
      state.shippingMethod = null;
      state.paymentMethod = null;
      state.paymentIntent = null;
      state.order = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch shipping rates
      .addCase(fetchShippingRates.pending, (state) => {
        state.shippingRatesLoading = true;
        state.error = null;
      })
      .addCase(fetchShippingRates.fulfilled, (state, action) => {
        state.shippingRatesLoading = false;
        state.shippingRates = action.payload;
      })
      .addCase(fetchShippingRates.rejected, (state, action) => {
        state.shippingRatesLoading = false;
        state.error = action.error.message;
      })
      
      // Create payment intent
      .addCase(createPaymentIntentAsync.pending, (state) => {
        state.paymentLoading = true;
        state.error = null;
      })
      .addCase(createPaymentIntentAsync.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.paymentIntent = action.payload;
      })
      .addCase(createPaymentIntentAsync.rejected, (state, action) => {
        state.paymentLoading = false;
        state.error = action.error.message;
      })
      
      // Process order
      .addCase(processOrder.pending, (state) => {
        state.orderProcessing = true;
        state.error = null;
      })
      .addCase(processOrder.fulfilled, (state, action) => {
        state.orderProcessing = false;
        state.order = action.payload;
        state.currentStep = 5; // Order confirmation step
      })
      .addCase(processOrder.rejected, (state, action) => {
        state.orderProcessing = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setCurrentStep,
  updateShippingAddress,
  setShippingMethod,
  setPaymentMethod,
  resetCheckout,
  clearError,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
