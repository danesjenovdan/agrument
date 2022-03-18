import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user.js';
import usersReducer from './slices/users.js';
import postsReducer from './slices/posts.js';

export default configureStore({
  reducer: {
    user: userReducer,
    users: usersReducer,
    posts: postsReducer,
  },
});

// const store = new Freezer({
//   tokenUsers: {
//     isLoading: false,
//     data: null,
//   },
//   newUser: {
//     isLoading: false,
//     id: 0,
//     token: null,
//   },
//   currentEditor: null,
//   currentEditorText: '',
//   editable: {
//     saving: false,
//     savingError: false,
//     isLoading: false,
//     data: null,
//   },
// });
