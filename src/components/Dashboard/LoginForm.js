import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { autobind } from 'core-decorators';
import Button from '../FormControl/Button';
import Input from '../FormControl/Input';
import { login, logout as logoutFunc } from '../../utils/login';
import { parseSearch } from '../../utils/url';

class LoginForm extends React.Component {
  constructor() {
    super();

    this.state = {
      error: false,
    };
  }

  componentDidMount() {
    const { logout } = parseSearch(this.props.location.search);
    if (logout) {
      logoutFunc().end();
    }
  }

  @autobind
  onSubmitForm(event) {
    event.preventDefault();
    this.setState({ error: false });

    if (this.username && this.password) {
      login(this.username.value, this.password.value)
        .end((err, res) => {
          if (err) {
            this.setState({ error: true });
            console.log(err); // eslint-disable-line no-console
          } else if (res.ok) {
            this.props.history.replace('/dash');
          }
        });
    }
  }

  render() {
    return (
      <div className="container dash__container">
        <form action="/api/login" method="post" onSubmit={this.onSubmitForm}>
          <div className="row">
            <div className="col-md-4 col-md-offset-4">
              <div className="form-group">
                <h3>Prijava</h3>
              </div>
              <div className="form-group">
                <Input placeholder="username" ref={(e) => { this.username = e; }} />
              </div>
              <div className="form-group">
                <Input placeholder="password" type="password" ref={(e) => { this.password = e; }} />
              </div>
              <div className="form-group">
                {this.state.error ? (
                  <h4 className="text-center">Napaka pri prijavi!</h4>
                ) : null}
                <Button type="submit" className="btn-block">Prijavi se!</Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

LoginForm.propTypes = {
  location: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
};

export default withRouter(LoginForm);
