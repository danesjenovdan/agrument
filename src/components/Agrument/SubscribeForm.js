import React from 'react';
import request from 'superagent';
import Input from '../FormControl/Input';
import Checkbox from '../FormControl/Checkbox';
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
      request
        .post('http://agrument.danesjenovdan.si/subscribe/')
        .send({
          email: this.emailInput.value,
          sig: this.checkBox.state.checked ? 1 : 0,
        })
        .end((err) => {
          if (err) {
            this.setState({ formSubmitted: true, error: true });
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
          <Checkbox large label="Obveščajte me tudi o ostalih aktivnostih inštituta!" ref={(el) => { this.checkBox = el; }} />
          <Button block type="submit" value="Naroči!" disabled={this.state.disableButton} />
        </div>
      );
    } else if (!this.state.error) {
      content = (
        <div className="agrument__reset-container">
          <p>HVALA!</p>
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
        <div className="agrument__rss-container">
          <Button block external href="http://agrument.danesjenovdan.si/rss/">
            RSS <span className="icon icon-rss" />
          </Button>
        </div>
      </form>
    );
  }
}

export default SubscribeForm;
