import { browserHistory } from 'react-router';
import * as dash from './utils/dash';
import * as login from './utils/login';

function initReactions(store) {
  store.on('user:fetch', () => {
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
          browserHistory.replace('/login');
        } else {
          store.get().user.set({
            isLoading: false,
            data: res.body.user,
          });
        }
      });
  });

  store.on('pinned:fetch', () => {
    if (store.get().pinned.isLoading) {
      return;
    }

    store.get().pinned.set({ isLoading: true });

    dash.getPinned()
      .end((err, res) => {
        if (err || !res.ok) {
          store.get().pinned.set({
            isLoading: false,
          });
        } else {
          store.get().pinned.set({
            isLoading: false,
            data: res.body.pinned,
          });
        }
      });
  });

  store.on('pinned:remove', (id) => {
    const msg = store.get().pinned.data.find(e => e.id === id);

    if (msg) {
      msg.set({ disabled: true });

      dash.removePinned(id)
        .end((err, res) => {
          if (err || !res.ok) {
            // noop
          } else {
            store.trigger('pinned:fetch');
          }
        });
    }
  });

  store.on('pinned:add', () => {
    store.get().pinned.newMessage.set({ isLoading: true });

    dash.addPinned(store.get().pinned.newMessage.message)
      .end((err, res) => {
        if (err || !res.ok) {
          store.get().pinned.newMessage.set({
            isLoading: false,
            error: true,
          });
        } else {
          store.get().pinned.newMessage.set({
            showInput: false,
            message: '',
            isLoading: false,
            error: false,
          });
          store.trigger('pinned:fetch');
        }
      });
  });

  store.on('pinned:showinput', () => {
    store.get().pinned.newMessage.set({ showInput: true });
  });

  store.on('pinned:resetinput', () => {
    store.get().pinned.newMessage.set({
      showInput: true,
      message: '',
      isLoading: false,
      error: false,
    });
  });

  store.on('pinned:updatemessage', (value) => {
    store.get().pinned.newMessage.set({ message: value }).now();
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

  store.on('newsubmission:changeuser', (id) => {
    store.get().newArticle.set({ selectedUser: id });
  });

  store.on('newsubmission:changedeadline', (time) => {
    store.get().newArticle.set({ deadline: time });
  });

  store.on('newsubmission:create', () => {
    console.log('asd');
    if (store.get().newArticle.isLoading) {
      console.log('blasd');
      return;
    }

    console.log('getting store');
    store.get().newArticle.set({ isLoading: true });

    console.log('about to addSubmission');
    dash.addSubmission(store.get().newArticle.selectedUser, store.get().newArticle.deadline)
      .end((err, res) => {
        console.log(err, res);
        if (err || !res.ok) {
          if (res.body.error.indexOf('date or deadline')) {
            alert('Nekaj je narobe z datumom. Verjetno že obstaja deadline na ta datum.');
          } else {
            alert(`Nekaj je šlo na robe. Ne vemo čisto kaj, morda ti to pomaga: ${res.body.error}`);
          }
          store.get().newArticle.set({
            isLoading: false,
            error: true,
          });
        } else {
          store.get().newArticle.set({
            isLoading: false,
            error: false,
          });
          store.trigger('submissions:fetch');
          store.trigger('pending:fetch');
        }
      });
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
    const type = sub.type;

    if (sub) {
      sub.set({ disabled: true });

      dash.removeSubmission(id)
        .end((err, res) => {
          if (err || !res.ok) {
            // noop
          } else {
            store.trigger('submissions:fetch');
            store.trigger(`${type}:fetch`);
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

  store.on('editable:fetch', (date) => {
    if (store.get().editable.isLoading) {
      return;
    }

    store.get().editable.set({ isLoading: true });

    dash.getEditable(date.getTime())
      .end((err, res) => {
        if (err || !res.ok) {
          store.get().editable.set({
            isLoading: false,
          });
        } else {
          store.get().editable.set({
            isLoading: false,
            data: res.body.editable,
          });
        }
      });
  });

  store.on('editor:showeditor', (id) => {
    let sub = store.get().pending.data.find(e => e.id === id);
    if (!sub) {
      sub = store.get().votable.data.find(e => e.id === id);
    }
    if (sub) {
      store.get().set({ currentEditor: sub.toJS() });
    }
  });

  store.on('editor:discardeditor', () => {
    store.get().set({
      currentEditor: null,
      currentEditorRTE: null,
    });
  });

  store.on('editor:updateeditor', (key, value) => {
    store.get().currentEditor.set({
      [key]: value,
    }).now();
  });

  store.on('editor:updateeditor-rte', (value) => {
    store.get().set({
      currentEditorRTE: value,
    }).now();
  });

  // THIS IS SAVING ON EDIT
  store.on('pending:edit', (id) => {
    console.log('edit');
    const sub = store.get().pending.data.find(e => e.id === id);
    const editor = store.get().currentEditor;

    if (sub && editor && editor.id === id) {
      sub.set({ disabled: true });

      const newData = editor.toJS();
      const editorRTE = store.get().currentEditorRTE;
      if (editorRTE) {
        newData.content = editorRTE;
      }

      dash.editSubmission(id, newData)
        .end((err, res) => {
          if (err || !res.ok) {
            // noop
          } else {
            store.trigger('editor:discardeditor');
            store.trigger('pending:fetch');
            if (store.get().submissions.data) {
              store.trigger('submissions:fetch');
            }
          }
        });
    }
  });

  // THIS IS FIRST SUBMISSION (author finished editing)
  store.on('pending:submit', (id) => {
    const sub = store.get().pending.data.find(e => e.id === id);

    console.log('asdfasdfasdfasdfsfasdf');

    if (sub) {
      sub.set({ disabled: true });

      dash.submitPending(id)
        .end((err, res) => {
          if (err || !res.ok) {
            // noop
          } else {
            store.trigger('pending:fetch');
            store.trigger('votable:fetch');
            if (store.get().submissions.data) {
              store.trigger('submissions:fetch');
            }
          }
        });
    }
  });

  store.on('votable:edit', (id) => {
    const sub = store.get().votable.data.find(e => e.id === id);
    const editor = store.get().currentEditor;

    if (sub && editor && editor.id === id) {
      sub.set({ disabled: true });

      const newData = editor.toJS();
      const editorRTE = store.get().currentEditorRTE;
      if (editorRTE) {
        newData.content = editorRTE;
      }

      console.log('old', newData);
      dash.editSubmission(id, newData)
        .end((err, res) => {
          console.log('new', newData);
          if (err || !res.ok) {
            // noop
          } else {
            store.trigger('editor:discardeditor');
            store.trigger('votable:fetch');
            if (store.get().submissions.data) {
              store.trigger('submissions:fetch');
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
            store.trigger('votable:fetch');
            if (store.get().submissions.data) {
              store.trigger('submissions:fetch');
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

  store.on('registerform:submit', (id, token) => {
    const register = store.get().forms.register.set({ isLoading: true });

    login.register(id, token, register.name, register.username, register.password)
      .end((err, res) => {
        if (err || !res.ok) {
          store.get().forms.register.set({
            isLoading: false,
            error: true,
          });
        } else {
          store.trigger('registerform:discard');
          browserHistory.push('/login');
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
          store.trigger('votes:fetch');
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
          store.trigger('votes:fetch');
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
          store.trigger('votes:fetch');
        }
      });
  });
}

export default initReactions;
