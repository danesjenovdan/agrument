import _ from 'lodash';
import * as dash from './utils/dash';
import * as login from './utils/login';
import { toSloDateString } from './utils/date';
import { shortenUrls } from './utils/shortener';

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
          if (history.location.pathname === '/login') {
            history.replace('/dash');
          }
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

  store.on('users:disable', (id, disabled) => {
    dash.disableUser(id, disabled)
      .end((err, res) => {
        if (!err && res.ok) {
          store.emit('users:fetch');
        }
      });
  });

  store.on('users:createtoken', (id) => {
    dash.createUserToken(id)
      .end((err, res) => {
        if (!err && res.ok) {
          store.emit('users:fetch');
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
            ignorePagination: false,
          });
        } else {
          store.get().published.set({
            isLoading: false,
            data: res.body.published,
            ignorePagination: res.body.ignorePagination || false,
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
    const sub = store.get().submissions.data.find((e) => e.id === id);
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
          if (res.body.votes) {
            store.get().votes.set({
              isLoading: false,
              data: res.body.votes,
            });
          }
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
    store.get().set({
      currentEditor: null,
      currentEditorText: '',
    });
    store.get().editable.set({
      isLoading: true,
      autosave: false,
      error: false,
      data: null,
    });

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

    if (store.get().editable.autosave) {
      debouncedEditableSave();
    }

    if (key === 'imageURL' || key === 'imageName') {
      const { data } = store.get().editable;
      if (data && typeof data.imageURL !== 'string' && data.imageName) {
        store.emit('editable:imageupload');
      }
    }
  });

  store.on('editable:updateeditor', (html, text) => {
    const shouldSave = store.get().currentEditor != null;

    store.get().set({
      currentEditor: html,
      currentEditorText: text,
    }).now();

    store.emit('editable:updategeneratedtext');

    if (store.get().editable.autosave && shouldSave) {
      debouncedEditableSave();
    }
  });

  store.on('editable:updategeneratedtext', () => {
    if (store.get().editable && store.get().editable.data) {
      const text = store.get().currentEditorText;
      const originalTitle = store.get().editable.data.title;
      const caption = store.get().editable.data.imageCaption;
      const imgUrl = store.get().editable.data.imageCaptionURL;
      const timestamp = store.get().editable.data.date;
      const url = `${window.location.origin}/${toSloDateString(timestamp)}`;

      shortenUrls([imgUrl, url], `Slika: ${caption} [${imgUrl}]\n\n${url}`).then((footerText) => {
        const uppercaseTitle = String(originalTitle).toUpperCase();
        const fbtext = `${uppercaseTitle}\n\n${text}\n${footerText}`;

        let desc = text
          .replace(/\n/g, ' ')
          .replace(/\s?\[https?:\/\/.+?\]/g, '')
          .replace(/\s\s+/g, ' ')
          .replace(/(^[\s\u200b]*|[\s\u200b]*$)/g, '') // \u200b is zero-width space
          .slice(0, 250);
        desc = desc.slice(0, desc.lastIndexOf(' '));
        const description = `${desc} ...`;

        store.get().editable.data.set({ fbtext, description }).now();
      });
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
      if (typeof newData.imageURL !== 'string') {
        newData.imageURL = undefined;
      }

      dash.editSubmission(data.id, newData)
        .end((err, res) => {
          if (err || !res.ok) {
            store.get().editable.set({
              saving: false,
              savingError: true,
            });
          } else {
            if (res.body && res.body.imageURL) {
              store.get().editable.data.set({
                imageURL: res.body.imageURL,
              });
            }
            store.get().editable.set({
              saving: false,
              savingError: false,
            });
          }
        });
    }
  });

  store.on('editable:imageupload', () => {
    const { data } = store.get().editable;
    if (data) {
      const newData = data.toJS();
      if (typeof newData.imageURL !== 'string' && newData.imageName) {
        store.get().editable.set({
          saving: true,
          savingError: false,
        });

        dash.uploadImage(data.id, newData.imageURL, newData.imageName)
          .end((err, res) => {
            if (err || !res.ok) {
              store.get().editable.set({
                saving: false,
                savingError: true,
              });
            } else {
              if (res.body && res.body.imageURL) {
                store.get().editable.data.set({
                  imageURL: res.body.imageURL,
                });
              }
              store.get().editable.set({
                saving: false,
                savingError: false,
              });
            }
          });
      }
    }
  });

  // THIS IS FIRST SUBMISSION (author finished editing)
  store.on('pending:submit', (id) => {
    const sub = store.get().pending.data.find((e) => e.id === id);

    if (sub) {
      sub.set({ disabled: true });

      dash.submitPending(id)
        .end((err, res) => {
          if (err || !res.ok) {
            // noop
          } else {
            store.emit('pending:fetch');
            store.emit('votable:fetch');
          }
        });
    }
  });

  function validatePublish(sub) {
    const errors = [];

    if (!sub.votes || !sub.votes.data) {
      errors.push('Manjkajo glasovi');
    } else {
      const veto = sub.votes.data.find((v) => v.vote === 'veto');
      if (veto) {
        errors.push('Obstaja veto');
      }
    }

    if (!sub.title || !sub.title.trim()) {
      errors.push('Manjka naslov');
    }
    if (!sub.content || sub.content.trim().length < 10) {
      errors.push('Manjka vsebina');
    }
    if (!sub.rights || !sub.rights.trim()) {
      errors.push('Manjkajo pravice');
    }
    if (!sub.imageURL || !sub.imageURL.trim()) {
      errors.push('Manjka slika');
    }
    if (!sub.imageCaption || !sub.imageCaption.trim()) {
      errors.push('Manjka opis slike');
    }
    if (!sub.imageCaptionURL || !sub.imageCaptionURL.trim()) {
      errors.push('Manjka vir slike');
    }
    if (!sub.tweet || !sub.tweet.trim()) {
      errors.push('Manjka tweet');
    }
    if (toSloDateString(sub.date) !== toSloDateString(new Date())) {
      errors.push(`Preveri datum! (Ni ${toSloDateString(new Date())})`);
    }

    return errors;
  }

  store.on('votable:publish', (id) => {
    let sub = store.get().votable.data.find((e) => e.id === id);

    if (sub) {
      sub = sub.set({ disabled: true });

      const publishErrors = validatePublish(sub);
      if (!publishErrors || publishErrors.length === 0) {
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
      } else {
        sub = store.get().votable.data.find((e) => e.id === id);
        if (sub) {
          sub.set({
            disabled: false,
            publishErrors,
          });
        }
      }
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

  store.on('votes:fetch', (id) => {
    let sub = store.get().votable.data && store.get().votable.data.find((e) => e.id === id);

    if (!sub || (sub && sub.votes && sub.votes.isLoading)) {
      return;
    }

    if (!sub.votes) {
      sub = sub.set({ votes: {} });
    }

    sub.votes.set({ isLoading: true });

    dash.getVotes(id)
      .end((err, res) => {
        sub = store.get().votable.data && store.get().votable.data.find((e) => e.id === id);

        if (sub) {
          if (!sub.votes) {
            sub = sub.set({ votes: {} });
          }

          if (err || !res.ok) {
            sub.votes.set({
              isLoading: false,
            });
          } else {
            sub.votes.set({
              isLoading: false,
              data: res.body.votes,
            });
          }
        }
      });
  });

  store.on('votes:vote', (id, vote) => {
    let sub = store.get().votable.data && store.get().votable.data.find((e) => e.id === id);

    if (!sub || (sub && sub.votes && sub.votes.isLoading)) {
      return;
    }

    dash.submitVote(id, vote)
      .end((err, res) => {
        if (!err && res.ok) {
          store.emit('votes:fetch', id);
        } else if (res && res.body && res.body.error) {
          sub = store.get().votable.data && store.get().votable.data.find((e) => e.id === id);

          if (sub) {
            if (!sub.votes) {
              sub = sub.set({ votes: {} });
            }

            const errorText = res.body.error.indexOf('Veto limit reached') !== -1
              ? 'Pravico do veta si ta mesec že izkoristil.'
              : res.body.error;

            sub.votes.set({
              voteError: errorText,
            });
          }
        }
      });
  });
}

export default initReactions;
