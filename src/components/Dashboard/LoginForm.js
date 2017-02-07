import React, { PropTypes } from 'react';
import { browserHistory, withRouter } from 'react-router';
import { autobind } from 'core-decorators';
import Button from '../FormControl/Button';
import Input from '../FormControl/Input';
import { login, logout } from '../../utils/login';

class LoginForm extends React.Component {
  constructor() {
    super();

    this.state = {
      error: false,
    };
  }

  componentDidMount() {
    if (this.props.location.query.logout === 'true') {
      logout().end();
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
            console.log(err);
          } else if (res.ok) {
            browserHistory.replace('/dash');
          }
        });
    }
  }

  render() {
    return (
      <div className="container dash__container">
        {this.state.error ? (
          <div>Napaka pri vpisu!</div>
        ) : null}
        <form action="/api/login" method="post" onSubmit={this.onSubmitForm}>
          <div>
            <Input placeholder="username" ref={(e) => { this.username = e; }} />
          </div>
          <div>
            <Input placeholder="password" type="password" ref={(e) => { this.password = e; }} />
          </div>
          <div>
            <Button type="submit">Login</Button>
          </div>
        </form>
      </div>
    );
  }
}

LoginForm.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.shape({
      logout: PropTypes.string,
    }),
  }).isRequired,
};

export default withRouter(LoginForm);
