import Freezer from 'freezer-js';

const store = new Freezer({
  user: {
    isLoading: false,
    data: null,
  },
  pinned: {
    isLoading: false,
    data: null,
    newMessage: {
      isLoading: false,
      error: false,
      showInput: false,
      message: '',
    },
  },
  users: {
    isLoading: false,
    data: null,
  },
  newArticle: {
    isLoading: false,
    error: false,
    selectedUser: null,
    deadline: Date.now(),
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
  currentEditorRTE: null,
});

export default store;
