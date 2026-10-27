import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services';

const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');
let initialUser = null;
try {
  if (userStr) initialUser = JSON.parse(userStr);
} catch (e) {
  localStorage.removeItem('user');
}

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const data = await authService.getCurrentUser();
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch current user');
  }
});

const initialState = {
  token: token || null,
  user: initialUser || null,
  isAuthenticated: !!token,
  role: initialUser?.primaryRole || initialUser?.role || null,
  profileId: initialUser?.profileId || null,
  classId: initialUser?.classId || null,
  className: initialUser?.className || null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const data = action.payload;
      state.token = data.token;
      state.user = data;
      state.isAuthenticated = true;
      state.role = data.primaryRole || data.role;
      state.profileId = data.profileId;
      state.classId = data.classId;
      state.className = data.className;

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      state.profileId = null;
      state.classId = null;
      state.className = null;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      if (action.payload.primaryRole || action.payload.role) {
        state.role = action.payload.primaryRole || action.payload.role;
      }
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      const data = action.payload;
      state.user = data;
      state.isAuthenticated = true;
      state.role = data.primaryRole || data.role;
      state.profileId = data.profileId;
      state.classId = data.classId;
      state.className = data.className;
      localStorage.setItem('user', JSON.stringify(data));
    });
    builder.addCase(getCurrentUser.rejected, (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    });
  }
});

export const { loginSuccess, logout, setUser } = authSlice.actions;
export default authSlice.reducer;