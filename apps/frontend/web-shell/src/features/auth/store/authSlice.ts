import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type Privilege, ROLE_PRIVILEGES, type Role } from '../data/roles';

export interface AuthState {
  role: Role | null;
  privileges: Privilege[];
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  role: null,
  privileges: [],
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginAs(state, action: PayloadAction<Role>) {
      state.role = action.payload;
      state.privileges = ROLE_PRIVILEGES[action.payload];
      state.isAuthenticated = true;
    },
    logout(state) {
      state.role = null;
      state.privileges = [];
      state.isAuthenticated = false;
    },
  },
});

export const { loginAs, logout } = authSlice.actions;
export default authSlice.reducer;
