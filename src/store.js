import Freezer from 'freezer-js';

import { parseDate } from './utils/date';

const store = new Freezer({
  user: {
    isLoading: false,
    data: null,
  },
  users: {
    isLoading: false,
    data: null,
  },
  tokenUsers: {
    isLoading: false,
    data: null,
  },
  newUser: {
    isLoading: false,
    id: 0,
    token: null,
  },
  newArticle: {
    isLoading: false,
    error: false,
    selectedUser: null,
    date: parseDate(Date.now()).getTime(),
  },
  published: {
    isLoading: false,
    searchQuery: '',
    data: null,
    ignorePagination: false,
  },
  submissions: {
    isLoading: false,
    data: null,
  },
  pending: {
    isLoading: false,
    data: null,
  },
  votable: {
    isLoading: false,
    data: null,
  },
  currentEditor: null,
  currentEditorText: '',
  forms: {
    login: {
      isLoading: false,
      username: '',
      password: '',
    },
    register: {
      isLoading: false,
      error: false,
      name: '',
      username: '',
      password: '',
      passwordRepeat: '',
    },
  },
  editable: {
    saving: false,
    savingError: false,
    isLoading: false,
    data: null,
  },
});

export default store;
