import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// ===== ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ =====
const getUserId = () => {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  return user?.id || null;
};

// ===== АСИНХРОННЫЕ ДЕЙСТВИЯ =====

// Загрузить избранное текущего пользователя
export const fetchFavorites = createAsyncThunk('favorites/fetchAll', async () => {
  const userId = getUserId();
  if (!userId) return [];

  const allFavorites = await api.getFavorites();
  return allFavorites.filter(item => item.userId === userId);
});

// Добавить в избранное
export const addToFavorites = createAsyncThunk('favorites/add', async (item) => {
  const userId = getUserId();
  if (!userId) throw new Error('User not authenticated');

  const favoriteItem = {
    ...item,
    userId: userId
  };

  return await api.addToFavorites(favoriteItem);
});

// Удалить из избранного
export const removeFromFavorites = createAsyncThunk('favorites/remove', async (id) => {
  await api.removeFromFavorites(id);
  return id;
});

// Очистить избранное текущего пользователя
export const clearFavoritesAsync = createAsyncThunk('favorites/clear', async () => {
  const userId = getUserId();
  if (!userId) return [];

  const allFavorites = await api.getFavorites();
  const userFavorites = allFavorites.filter(item => item.userId === userId);

  for (const item of userFavorites) {
    await api.removeFromFavorites(item.id);
  }
  return [];
});

// ===== НАЧАЛЬНОЕ СОСТОЯНИЕ =====
const initialState = {
  items: [],
  loading: false,
  error: null
};

// ===== СЛАЙС =====
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
    },
    // Очистить избранное при выходе пользователя
    clearFavoritesOnLogout(state) {
      state.items = [];
      state.loading = false;
      state.error = null;
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
      })
      .addCase(clearFavoritesAsync.fulfilled, (state) => {
        state.items = [];
      });
  }
});

export const {
  addFavorite, removeFavorite, clearFavorites,
  clearFavoritesOnLogout
} = favoritesSlice.actions;

// ===== СЕЛЕКТОРЫ =====
export const selectFavorites = (state) => state.favorites.items;
export const selectFavoritesCount = (state) => state.favorites.items.length;
export const selectFavoritesLoading = (state) => state.favorites.loading;

export default favoritesSlice.reducer;