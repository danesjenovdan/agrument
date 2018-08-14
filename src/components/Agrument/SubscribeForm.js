import React from 'react';
import request from 'superagent';
import Input from '../FormControl/Input';
import Button from '../FormControl/Button';
import { validateEmail } from '../../utils/email';
import confetti from '../../utils/confetti';

class SubscribeForm extends React.Component {
  constructor() {
    super();

    this.state = {
      formSubmitted: false,
      error: false,
      disableButton: false,
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (validateEmail(this.emailInput.value)) {
      this.setState({ disableButton: true });
      request.get(`https://spam.djnd.si/deliver-email/?email=${this.emailInput.value}`)
        .end((err, res) => {
          if (err || res.text !== '1') {
            this.setState({ formSubmitted: true, error: true });
            // eslint-disable-next-line no-console
            console.error(err);
          } else {
            this.setState({ formSubmitted: true, error: false });
            confetti();
          }
        });
    } else {
      this.emailInput.shake();
    }
  }

  resetForm = () => {
    this.setState({ formSubmitted: false, error: false, disableButton: false });
  }

  render() {
    let content;
    if (!this.state.formSubmitted) {
      content = (
        <div>
          <p>Želim, da mi sveže spisan agrument vsak delovni dan dostavite na spodnji mejl:</p>
          <Input type="email" placeholder="email naslov" ref={(el) => { this.emailInput = el; }} />
          <Button block type="submit" value="Naroči!" disabled={this.state.disableButton} />
        </div>
      );
    } else if (!this.state.error) {
      content = (
        <div className="agrument__reset-container">
          <p>Sporočilo poslano na email naslov!</p>
          <Button block type="reset" value="Osveži formo" onClick={this.resetForm} />
        </div>
      );
    } else {
      content = (
        <div className="agrument__reset-container">
          <p>NAPAKA!</p>
          <Button block type="reset" value="Osveži formo" onClick={this.resetForm} />
        </div>
      );
    }
    return (
      <form className="agrument__subscribe" onSubmit={this.handleSubmit}>
        {content}
        {/* <div className="agrument__rss-container">
          <Button block external href="https://agrument.danesjenovdan.si/rss/">
            RSS <span className="icon icon-rss" />
          </Button>
        </div> */}
      </form>
    );
  }
}

export default SubscribeForm;
