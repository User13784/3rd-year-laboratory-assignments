import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// ===== АСИНХРОННЫЕ ДЕЙСТВИЯ =====

// READ — загрузить все отзывы
export const fetchFeedback = createAsyncThunk('feedback/fetchAll', async () => {
  return await api.getFeedback();
});

// CREATE — добавить отзыв
export const addFeedback = createAsyncThunk('feedback/add', async (data) => {
  return await api.addFeedback(data);
});

// UPDATE — обновить отзыв
export const updateFeedbackAsync = createAsyncThunk(
  'feedback/update',
  async ({ id, data }) => {
    const response = await fetch(`http://localhost:3001/feedback/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Failed to update feedback');
    return await response.json();
  }
);

// DELETE — удалить отзыв
export const deleteFeedback = createAsyncThunk('feedback/delete', async (id) => {
  await api.deleteFeedback(id);
  return id;
});

// ===== НАЧАЛЬНОЕ СОСТОЯНИЕ =====
const initialState = {
  items: [],
  loading: false,
  error: null
};

// ===== СЛАЙС =====
const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    // CREATE (синхронный)
    addFeedbackSync(state, action) {
      state.items.push(action.payload);
    },

    // UPDATE (синхронный)
    updateFeedback(state, action) {
      const { id, data } = action.payload;
      const index = state.items.findIndex(f => f.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...data };
      }
    },

    // DELETE (синхронный)
    removeFeedback(state, action) {
      state.items = state.items.filter(f => f.id !== action.payload);
    },

    // Обработка ошибок
    setError(state, action) {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // READ
      .addCase(fetchFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // CREATE
      .addCase(addFeedback.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // UPDATE
      .addCase(updateFeedbackAsync.fulfilled, (state, action) => {
        const index = state.items.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.items = state.items.filter(f => f.id !== action.payload);
      });
  }
});

export const {
  addFeedbackSync,
  updateFeedback,
  removeFeedback,
  setError
} = feedbackSlice.actions;

// ===== СЕЛЕКТОРЫ =====
export const selectFeedback = (state) => state.feedback.items;
export const selectFeedbackLoading = (state) => state.feedback.loading;
export const selectFeedbackError = (state) => state.feedback.error;

export default feedbackSlice.reducer;