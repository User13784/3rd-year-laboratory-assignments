import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  return await api.getProducts();
});

export const createProduct = createAsyncThunk('products/create', async (product) => {
  return await api.addProduct(product);
});

export const updateProductAsync = createAsyncThunk(
  'products/update',
  async ({ id, data }) => {
    return await api.updateProduct(id, data);
  }
);

export const deleteProductAsync = createAsyncThunk('products/delete', async (id) => {
  await api.deleteProduct(id);
  return id;
});

const initialState = {
  items: [],
  loading: false,
  error: null,
  searchTerm: '',
  selectedCategory: 'all',
  sortBy: 'default'
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct(state, action) {
      state.items.push(action.payload);
    },
    updateProduct(state, action) {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    deleteProduct(state, action) {
      state.items = state.items.filter(p => p.id !== action.payload);
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    setCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      });
  }
});

export const {
  addProduct, updateProduct, deleteProduct,
  setSearchTerm, setCategory, setSortBy, setError
} = productsSlice.actions;

export const selectAllProducts = (state) => state.products.items;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectSearchTerm = (state) => state.products.searchTerm;
export const selectCategory = (state) => state.products.selectedCategory;
export const selectSortBy = (state) => state.products.sortBy;

export const selectFilteredProducts = (state) => {
  const { items, searchTerm, selectedCategory, sortBy } = state.products;

  let filtered = items.filter(p => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = !search ||
      (p.name?.en?.toLowerCase() || '').includes(search) ||
      (p.name?.ru?.toLowerCase() || '').includes(search);
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === 'rating-desc') filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return filtered;
};

export default productsSlice.reducer;