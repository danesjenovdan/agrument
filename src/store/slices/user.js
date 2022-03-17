/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { dash } from '../../utils/requests/api.js';

const fetchUser = createAsyncThunk('user/fetch', async () => {
  const response = await dash.get('/user');
  return response.data;
});

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    loading: false,
    data: null,
  },
  extraReducers: {
    [fetchUser.pending]: (state) => {
      state.loading = true;
    },
    [fetchUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [fetchUser.rejected]: (state) => {
      state.loading = false;
      state.data = null;
    },
  },
});

export { fetchUser };

export default userSlice.reducer;
