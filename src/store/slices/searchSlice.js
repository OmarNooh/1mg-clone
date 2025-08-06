import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock search API - replace with actual API call
const mockSearchAPI = async (query) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock product data for search
  const mockProducts = [
    { id: 1, name: 'Paracetamol 500mg', category: 'Medicine', price: 25, image: '/api/placeholder/150/150' },
    { id: 2, name: 'Vitamin D3 Tablets', category: 'Supplements', price: 150, image: '/api/placeholder/150/150' },
    { id: 3, name: 'Blood Sugar Test', category: 'Lab Tests', price: 200, image: '/api/placeholder/150/150' },
    { id: 4, name: 'Face Wash', category: 'Personal Care', price: 75, image: '/api/placeholder/150/150' },
    { id: 5, name: 'Hand Sanitizer', category: 'Personal Care', price: 45, image: '/api/placeholder/150/150' },
    { id: 6, name: 'Multivitamin Capsules', category: 'Supplements', price: 300, image: '/api/placeholder/150/150' },
    { id: 7, name: 'Cough Syrup', category: 'Medicine', price: 85, image: '/api/placeholder/150/150' },
    { id: 8, name: 'Thermometer', category: 'Medical Devices', price: 250, image: '/api/placeholder/150/150' },
  ];
  
  if (!query) return [];
  
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  );
};

// Async thunk for search
export const searchProducts = createAsyncThunk(
  'search/searchProducts',
  async (query) => {
    const results = await mockSearchAPI(query);
    return { query, results };
  }
);

// Async thunk for autocomplete suggestions
export const getAutocompleteSuggestions = createAsyncThunk(
  'search/getAutocompleteSuggestions',
  async (query) => {
    if (!query || query.length < 2) return [];
    
    const results = await mockSearchAPI(query);
    // Return just product names for autocomplete
    return results.slice(0, 5).map(product => product.name);
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    query: '',
    results: [],
    suggestions: [],
    loading: false,
    suggestionsLoading: false,
    error: null,
    showSuggestions: false,
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearResults: (state) => {
      state.results = [];
      state.query = '';
    },
    showSuggestions: (state) => {
      state.showSuggestions = true;
    },
    hideSuggestions: (state) => {
      state.showSuggestions = false;
      state.suggestions = [];
    },
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.results;
        state.query = action.payload.query;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Autocomplete suggestions
      .addCase(getAutocompleteSuggestions.pending, (state) => {
        state.suggestionsLoading = true;
      })
      .addCase(getAutocompleteSuggestions.fulfilled, (state, action) => {
        state.suggestionsLoading = false;
        state.suggestions = action.payload;
        state.showSuggestions = action.payload.length > 0;
      })
      .addCase(getAutocompleteSuggestions.rejected, (state, action) => {
        state.suggestionsLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { 
  setQuery, 
  clearResults, 
  showSuggestions, 
  hideSuggestions, 
  clearSuggestions 
} = searchSlice.actions;

export default searchSlice.reducer;
