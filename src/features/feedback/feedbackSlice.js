import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const fetchFeedback = createAsyncThunk('feedback/fetchAll', async () => {
  return await api.getFeedback();
});

export const addFeedback = createAsyncThunk('feedback/add', async (data) => {
  return await api.addFeedback(data);
});

export const deleteFeedback = createAsyncThunk('feedback/delete', async (id) => {
  await api.deleteFeedback(id);
  return id;
});

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedback.pending, (state) => { state.loading = true; })
      .addCase(fetchFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(addFeedback.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.items = state.items.filter(f => f.id !== action.payload);
      });
  }
});

export const selectFeedback = (state) => state.feedback.items;
export const selectFeedbackLoading = (state) => state.feedback.loading;

export default feedbackSlice.reducer;