import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('currentUser') || 'null'),
  isAuthenticated: !!localStorage.getItem('currentUser'),
  isAdmin: JSON.parse(localStorage.getItem('currentUser') || 'null')?.role === 'admin',
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isAdmin = action.payload.role === 'admin';
      state.error = null;
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      localStorage.removeItem('currentUser');
    },
    setError(state, action) {
      state.error = action.payload;
    }
  }
});

export const { loginSuccess, logout, setError } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => state.auth.isAdmin;

export default authSlice.reducer;