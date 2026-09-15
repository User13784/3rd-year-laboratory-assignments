import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const fetchFavorites = createAsyncThunk('favorites/fetchAll', async () => {
  return await api.getFavorites();
});

export const addToFavorites = createAsyncThunk('favorites/add', async (item) => {
  return await api.addToFavorites(item);
});

export const removeFromFavorites = createAsyncThunk('favorites/remove', async (id) => {
  await api.removeFromFavorites(id);
  return id;
});

const initialState = {
  items: [],
  loading: false,
  error: null
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite(state, action) {
      const exists = state.items.find(i => i.productId === action.payload.productId);
      if (!exists) state.items.push(action.payload);
    },
    removeFavorite(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    clearFavorites(state) {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => { state.loading = true; })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
      });
  }
});

export const { addFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;

export const selectFavorites = (state) => state.favorites.items;
export const selectFavoritesCount = (state) => state.favorites.items.length;
export const selectFavoritesLoading = (state) => state.favorites.loading;

export default favoritesSlice.reducer;