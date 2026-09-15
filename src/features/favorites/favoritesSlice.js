import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// ===== ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ =====
const getUserId = () => {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  return user?.id || null;
};

// ===== АСИНХРОННЫЕ ДЕЙСТВИЯ =====

// READ — загрузить избранное текущего пользователя
export const fetchFavorites = createAsyncThunk('favorites/fetchAll', async () => {
  const userId = getUserId();
  if (!userId) return [];

  const allFavorites = await api.getFavorites();
  return allFavorites.filter(item => item.userId === userId);
});

// CREATE — добавить в избранное
export const addToFavorites = createAsyncThunk('favorites/add', async (item) => {
  const userId = getUserId();
  if (!userId) throw new Error('User not authenticated');

  const favoriteItem = {
    ...item,
    userId: userId
  };

  return await api.addToFavorites(favoriteItem);
});

// UPDATE — обновить запись в избранном
export const updateFavoriteAsync = createAsyncThunk(
  'favorites/update',
  async ({ id, data }) => {
    const allFavorites = await api.getFavorites();
    const existing = allFavorites.find(f => f.id === id);
    if (!existing) throw new Error('Favorite not found');

    const updated = { ...existing, ...data };

    // PATCH через fetch
    const response = await fetch(`http://localhost:3001/favorites/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Failed to update favorite');
    return await response.json();
  }
);

// DELETE — удалить из избранного
export const removeFromFavorites = createAsyncThunk('favorites/remove', async (id) => {
  await api.removeFromFavorites(id);
  return id;
});

// DELETE ALL — очистить избранное текущего пользователя
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
    // CREATE (синхронный)
    addFavorite(state, action) {
      const exists = state.items.find(i => i.productId === action.payload.productId);
      if (!exists) state.items.push(action.payload);
    },

    // UPDATE (синхронный)
    updateFavorite(state, action) {
      const { id, data } = action.payload;
      const index = state.items.findIndex(i => i.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...data };
      }
    },

    // DELETE (синхронный)
    removeFavorite(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },

    // DELETE ALL
    clearFavorites(state) {
      state.items = [];
    },

    // Очистка при выходе
    clearFavoritesOnLogout(state) {
      state.items = [];
      state.loading = false;
      state.error = null;
    },

    // Обработка ошибок
    setError(state, action) {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // READ
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // CREATE
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // UPDATE
      .addCase(updateFavoriteAsync.fulfilled, (state, action) => {
        const index = state.items.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // DELETE
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
      })

      // CLEAR
      .addCase(clearFavoritesAsync.fulfilled, (state) => {
        state.items = [];
      });
  }
});

export const {
  addFavorite,
  updateFavorite,
  removeFavorite,
  clearFavorites,
  clearFavoritesOnLogout,
  setError
} = favoritesSlice.actions;

// ===== СЕЛЕКТОРЫ =====
export const selectFavorites = (state) => state.favorites.items;
export const selectFavoritesCount = (state) => state.favorites.items.length;
export const selectFavoritesLoading = (state) => state.favorites.loading;
export const selectFavoritesError = (state) => state.favorites.error;

export default favoritesSlice.reducer;