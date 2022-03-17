import React, { useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import Button from '../FormControl/Button.jsx';
import Input from '../FormControl/Input.jsx';
// import { login, logout as logoutFunc } from '../../utils/login';
// import { parseSearch } from '../../utils/url';

// import store from '../../store';

export default function LoginForm() {
  // const navigate = useNavigate();

  const [error, setError] = useState(false);

  const username = useRef(null);
  const password = useRef(null);

  const onSubmitForm = async (event) => {
    event.preventDefault();
    setError(false);

    if (username.current && password.current) {
      // login(username.current.value, password.current.value).end((err, res) => {
      //   if (err) {
      //     // eslint-disable-next-line no-console
      //     console.log(err);
      //     setError(true);
      //   } else if (res.ok) {
      //     navigate('/dash', { replace: true });
      //   }
      // });
    }
  };

  return (
    <div className="container dash__container">
      <form action="/api/login" method="post" onSubmit={onSubmitForm}>
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <div className="form-group">
              <h3>Prijava</h3>
            </div>
            <div className="form-group">
              <Input placeholder="username" ref={username} />
            </div>
            <div className="form-group">
              <Input placeholder="password" type="password" ref={password} />
            </div>
            <div className="form-group">
              {error ? (
                <h4 className="text-center">Napaka pri prijavi!</h4>
              ) : null}
              <Button type="submit" block>
                Prijavi se!
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

// class LoginForm extends React.Component {
//   componentDidMount() {
//     const { logout } = parseSearch(this.props.location.search);
//     if (logout) {
//       logoutFunc().end();
//     } else {
//       // store.emit('user:fetch', this.props.history);
//     }
//   }
// }
