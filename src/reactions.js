import _ from 'lodash';
import * as dash from './utils/dash';
import * as login from './utils/login';
import { toSloDateString } from './utils/date';

function initReactions(store) {
  store.on('user:fetch', (history) => {
    if (store.get().user.isLoading) {
      return;
    }

    store.get().user.set({ isLoading: true });

    dash.getUser()
      .end((err, res) => {
        if (err || !res.ok) {
          store.get().user.set({
            isLoading: false,
            data: null,
          });
          history.replace('/login');
        } else {
          store.get().user.set({
            isLoading: false,
            data: res.body.user,
          });
        }
      });
  });

  store.on('users:fetch', () => {
    if (store.get().users.isLoading) {
      return;
    }

    store.get().users.set({ isLoading: true });

    dash.getUsers()
      .end((err, res) => {
        if (err || !res.ok) {
          store.get().users.set({
            isLoading: false,
          });
        } else {
          store.get().users.set({
            isLoading: false,
            data: res.body.users,
          });
          if (res.body.users.length) {
            store.get().newArticle.set({
              selectedUser: res.body.users[0].id,
            });
          }
        }
      });
  });

  store.on('users:fetchtokens', () => {
    if (store.get().tokenUsers.isLoading) {
      return;
    }

    store.get().tokenUsers.set({ isLoading: true });

    dash.getTokenUsers()
      .end((err, res) => {
        if (err || !res.ok) {
          store.get().tokenUsers.set({
            isLoading: false,
          });
        } else {
          store.get().tokenUsers.set({
            isLoading: false,
            data: res.body.users,
          });
        }
      });
  });

  store.on('newsubmission:changeuser', (id) => {
    store.get().newArticle.set({ selectedUser: id });
  });

  store.on('newsubmission:changedate', (time) => {
    store.get().newArticle.set({ date: time });
  });

  store.on('newsubmission:create', () => {
    if (store.get().newArticle.isLoading) {
      return;
    }

    store.get().newArticle.set({ isLoading: true, error: false });

    dash.addSubmission(store.get().newArticle.selectedUser, store.get().newArticle.date)
      .end((err, res) => {
        if (err || !res.ok) {
          store.get().newArticle.set({
            isLoading: false,
            error: res.body.error || err || res.status,
          });
        } else {
          store.get().newArticle.set({
            isLoading: false,
            error: false,
          });
          store.emit('submissions:fetch');
        }
      });
  });

  store.on('published:fetch', (date, offset) => {
    if (store.get().published.isLoading) {
      return;
    }

    store.get().published.set({ isLoading: true });

    dash.getPublished(date, offset, store.get().published.searchQuery)
      .end((err, res) => {
        if (err || !res.ok) {
          store.get().published.set({
            isLoading: false,
          });
        } else {
          store.get().published.set({
            isLoading: false,
            data: res.body.published,
          });
        }
      });
  });

  const debouncedPublishedFetch = _.debounce(() => {
    store.emit('published:fetch');
  }, 500);

  store.on('published:updatesearchquery', (value) => {
    store.get().published.set({ searchQuery: value }).now();
    debouncedPublishedFetch();
  });

  store.on('submissions:fetch', () => {
    if (store.get().submissions.isLoading) {
      return;
    }

    store.get().submissions.set({ isLoading: true });

    dash.getSubmissions()
      .end((err, res) => {
        if (err || !res.ok) {
          store.get().submissions.set({
            isLoading: false,
          });
        } else {
          store.get().submissions.set({
            isLoading: false,
            data: res.body.submissions,
          });
        }
      });
  });

  store.on('submissions:remove', (id) => {
    const sub = store.get().submissions.data.find(e => e.id === id);
    const { type } = sub;

    if (sub) {
      sub.set({ disabled: true });

      dash.removeSubmission(id)
        .end((err, res) => {
          if (err || !res.ok) {
            // noop
          } else {
            store.emit('submissions:fetch');
            store.emit(`${type}:fetch`);
          }
        });
    }
  });

  store.on('pending:fetch', () => {
    if (store.get().pending.isLoading) {
      return;
    }

    store.get().pending.set({ isLoading: true });

    dash.getPending()
      .end((err, res) => {
        if (err || !res.ok) {
          store.get().pending.set({
            isLoading: false,
          });
        } else {
          store.get().pending.set({
            isLoading: false,
            data: res.body.pending,
          });
        }
      });
  });

  store.on('votable:fetch', () => {
    if (store.get().votable.isLoading) {
      return;
    }

    store.get().votable.set({ isLoading: true });

    dash.getVotable()
      .end((err, res) => {
        if (err || !res.ok) {
          store.get().votable.set({
            isLoading: false,
          });
        } else {
          store.get().votable.set({
            isLoading: false,
            data: res.body.votable,
          });
        }
      });
  });

  const debouncedEditableSave = _.debounce(() => {
    store.emit('editable:save');
  }, 2500);

  store.on('editable:fetch', (time) => {
    if (store.get().editable.isLoading) {
      return;
    }

    debouncedEditableSave.cancel();
    store.get().editable.set({ isLoading: true, autosave: false });

    dash.getEditable(time)
      .end((err, res) => {
        if (err || !res.ok) {
          store.get().editable.set({
            isLoading: false,
            error: true,
          });
        } else {
          store.get().editable.set({
            isLoading: false,
            data: res.body.data,
          });
          const { author, type } = res.body.data;
          const userId = store.get().user.data.id;
          if (author === userId && type === 'pending') {
            store.get().editable.set({
              autosave: true,
            });
          }
        }
      });
  });

  store.on('editable:update', (key, value) => {
    store.get().editable.data.set({
      [key]: value,
    }).now();
    store.emit('editable:updategeneratedtext');
  });

  store.on('editable:updateeditor', (html, text) => {
    store.get().set({
      currentEditor: html,
      currentEditorText: text,
    }).now();
    store.emit('editable:updategeneratedtext');
  });

  store.on('editable:updategeneratedtext', () => {
    const text = store.get().currentEditorText;
    const naslov = store.get().editable.data.title;
    const caption = store.get().editable.data.imageCaption;
    const imgUrl = store.get().editable.data.imageCaptionURL;
    const timestamp = store.get().editable.data.date;
    const url = `${window.location.origin}/${toSloDateString(timestamp)}`;

    const fbtext = `${naslov}\n${text}Slika: ${caption} [${imgUrl}]\n${url}`;
    const description = `${text.replace(/\n/g, ' ').replace(/\[.+\]/g, '').slice(0, 237)}...`;

    store.get().editable.data.set({ fbtext, description }).now();

    if (store.get().editable.autosave) {
      debouncedEditableSave();
    }
  });

  store.on('editable:save', () => {
    const { data } = store.get().editable;
    if (data) {
      store.get().editable.set({
        saving: true,
        savingError: false,
      });

      const newData = data.toJS();
      const editorValue = store.get().currentEditor;
      if (editorValue) {
        newData.content = editorValue;
      }

      dash.editSubmission(data.id, newData)
        .end((err, res) => {
          if (err || !res.ok) {
            store.get().editable.set({
              saving: false,
              savingError: true,
            });
          } else {
            store.get().editable.set({
              saving: false,
              savingError: false,
            });
          }
        });
    }
  });

  // THIS IS FIRST SUBMISSION (author finished editing)
  store.on('pending:submit', (id) => {
    const sub = store.get().pending.data.find(e => e.id === id);

    if (sub) {
      sub.set({ disabled: true });

      dash.submitPending(id)
        .end((err, res) => {
          if (err || !res.ok) {
            // noop
          } else {
            store.emit('pending:fetch');
            store.emit('votable:fetch');
            if (store.get().submissions.data) {
              store.emit('submissions:fetch');
            }
          }
        });
    }
  });

  store.on('votable:publish', (id) => {
    const sub = store.get().votable.data.find(e => e.id === id);

    if (sub) {
      sub.set({ disabled: true });

      dash.publishVotable(id)
        .end((err, res) => {
          if (err || !res.ok) {
            // noop
          } else {
            store.emit('votable:fetch');
            if (store.get().submissions.data) {
              store.emit('submissions:fetch');
            }
          }
        });
    }
  });

  store.on('newuser:create', () => {
    store.get().newUser.set({ isLoading: true });

    dash.createUser()
      .end((err, res) => {
        if (err || !res.ok) {
          store.get().newUser.set({ isLoading: false });
        } else {
          store.get().newUser.set({
            isLoading: false,
            id: res.body.user.id,
            token: res.body.user.token,
          });
          store.emit('users:fetchtokens');
        }
      });
  });

  store.on('registerform:discard', () => {
    store.get().forms.register.set({
      isLoading: false,
      error: null,
      name: '',
      username: '',
      password: '',
    });
  });

  store.on('registerform:update', (key, value) => {
    store.get().forms.register.set({
      [key]: value,
    }).now();
  });

  store.on('registerform:submit', (id, token, history) => {
    const register = store.get().forms.register.set({ isLoading: true });

    login.register(id, token, register.name, register.username, register.password)
      .end((err, res) => {
        if (err || !res.ok) {
          store.get().forms.register.set({
            isLoading: false,
            error: true,
          });
        } else {
          store.emit('registerform:discard');
          history.push('/login');
        }
      });
  });

  store.on('votes:fetch', () => {
    if (store.get().votes.isLoading) {
      return;
    }

    store.get().votes.set({ isLoading: true });

    dash.getVotes()
      .end((err, res) => {
        if (err || !res.ok) {
          store.get().votes.set({
            isLoading: false,
          });
        } else {
          store.get().votes.set({
            isLoading: false,
            data: res.body.votes,
          });
        }
      });
  });

  store.on('vote:for', (data) => {
    dash.voteFor(data)
      .end((err, res) => {
        if (err || !res.ok) {
          store.get().votes.set({
            isLoading: false,
          });
        } else {
          store.get().votes.set({
            isLoading: false,
            // data: res.body.data,
          });
          store.emit('votes:fetch');
        }
      });
  });

  store.on('vote:against', (data) => {
    dash.voteAgainst(data)
      .end((err, res) => {
        if (err || !res.ok) {
          store.get().votes.set({
            isLoading: false,
          });
        } else {
          store.get().votes.set({
            isLoading: false,
            // data: res.body.data,
          });
          store.emit('votes:fetch');
        }
      });
  });

  store.on('vote:veto', (data) => {
    dash.voteVeto(data)
      .end((err, res) => {
        if (err || !res.ok) {
          store.get().votes.set({
            isLoading: false,
          });
        } else {
          store.get().votes.set({
            isLoading: false,
            // data: res.body.data,
          });
          store.emit('votes:fetch');
        }
      });
  });
}

export default initReactions;
