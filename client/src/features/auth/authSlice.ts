import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
  name: string;
  email: string;
  picture: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const loadAuth = (): AuthState => {
  try {
    const serializedAuth = localStorage.getItem('auth');
    if (serializedAuth === null) {
      return { user: null, token: null };
    }
    return JSON.parse(serializedAuth);
  } catch (err) {
    return { user: null, token: null };
  }
};

const initialState: AuthState = loadAuth();

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem('auth', JSON.stringify(state));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('auth');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
