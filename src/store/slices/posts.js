/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { dash } from '../../utils/requests/api.js';

const fetchVotablePosts = createAsyncThunk('posts/votable/fetch', async () => {
  const response = await dash.get('/votable');
  return response.data;
});

const fetchPendingPosts = createAsyncThunk('posts/pending/fetch', async () => {
  const response = await dash.get('/pending');
  return response.data;
});

const fetchPublishedPosts = createAsyncThunk(
  'posts/published/fetch',
  async ({ q, date, offset }) => {
    const params = {
      q: q || undefined,
      after: date && offset != null ? `${date}+${offset}` : undefined,
    };
    const response = await dash.get('/published', { params });
    return response.data;
  }
);

const fetchSubmissionsPosts = createAsyncThunk(
  'posts/submissions/fetch',
  async () => {
    const response = await dash.get('/submissions');
    return response.data;
  }
);

const loadableThunks = [
  [fetchVotablePosts, 'votable'],
  [fetchPendingPosts, 'pending'],
  [fetchPublishedPosts, 'published'],
  [fetchSubmissionsPosts, 'submissions'],
];

export const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    votable: {
      loading: false,
      data: null,
    },
    pending: {
      loading: false,
      data: null,
    },
    published: {
      loading: false,
      data: null,
      // ignorePagination: false,
    },
    submissions: {
      loading: false,
      data: null,
    },
  },
  extraReducers: (builder) => {
    loadableThunks.forEach(([thunk, variable]) => {
      builder.addCase(thunk.pending, (state) => {
        state[variable].loading = true;
      });
      builder.addCase(thunk.fulfilled, (state, action) => {
        state[variable].loading = false;
        state[variable].data = action.payload[variable];
      });
      builder.addCase(thunk.rejected, (state) => {
        state[variable].loading = false;
        state[variable].data = null;
      });
    });
  },
});

export {
  fetchVotablePosts,
  fetchPendingPosts,
  fetchPublishedPosts,
  fetchSubmissionsPosts,
};

export default postsSlice.reducer;
