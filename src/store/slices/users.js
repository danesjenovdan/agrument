/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { dash } from '../../utils/requests/api.js';

const fetchUsers = createAsyncThunk('users/fetch', async () => {
  const response = await dash.get('/users');
  return response.data;
});

export const userSlice = createSlice({
  name: 'users',
  initialState: {
    loading: false,
    data: null,
  },
  extraReducers: {
    [fetchUsers.pending]: (state) => {
      state.loading = true;
    },
    [fetchUsers.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload.users
        .slice()
        .sort((a, b) => (a?.name || '').localeCompare(b?.name || '', 'sl'));
    },
    [fetchUsers.rejected]: (state) => {
      state.loading = false;
      state.data = null;
    },
  },
});

export { fetchUsers };

export default userSlice.reducer;
