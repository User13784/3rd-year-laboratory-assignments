import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// ===== ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ =====
const getUserId = () => {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  return user?.id || null;
};

// ===== АСИНХРОННЫЕ ДЕЙСТВИЯ =====

// Загрузить корзину текущего пользователя
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const userId = getUserId();
  if (!userId) return [];

  const allCart = await api.getCart();
  return allCart.filter(item => item.userId === userId);
});

// Добавить в корзину
export const addToCartAsync = createAsyncThunk('cart/addToCart', async (item) => {
  const userId = getUserId();
  if (!userId) throw new Error('User not authenticated');

  const cartItem = {
    ...item,
    userId: userId
  };

  return await api.addToCart(cartItem);
});

// Обновить количество
export const updateCartQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ id, quantity }) => {
    return await api.updateCartItem(id, quantity);
  }
);

// Удалить из корзины
export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async (id) => {
    await api.removeFromCart(id);
    return id;
  }
);

// Очистить корзину текущего пользователя
export const clearCartAsync = createAsyncThunk('cart/clearCart', async () => {
  const userId = getUserId();
  if (!userId) return [];

  const allCart = await api.getCart();
  const userCart = allCart.filter(item => item.userId === userId);

  for (const item of userCart) {
    await api.removeFromCart(item.id);
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
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const existing = state.items.find(i => i.productId === action.payload.productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeItem(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item && quantity >= 1) item.quantity = quantity;
    },
    clearCart(state) {
      state.items = [];
    },
    // Очистить корзину при выходе пользователя
    clearCartOnLogout(state) {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
    setError(state, action) {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const item = state.items.find(i => i.id === action.payload.id);
        if (item) item.quantity = action.payload.quantity;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
      });
  }
});

export const {
  addItem, removeItem, updateQuantity, clearCart,
  clearCartOnLogout, setError
} = cartSlice.actions;

// ===== СЕЛЕКТОРЫ =====
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartLoading = (state) => state.cart.loading;

export default cartSlice.reducer;