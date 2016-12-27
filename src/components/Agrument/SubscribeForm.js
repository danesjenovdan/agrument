import React from 'react';
import request from 'superagent';
import { autobind } from 'core-decorators';
import Input from '../FormControl/Input';
import Checkbox from '../FormControl/Checkbox';
import Button from '../FormControl/Button';
import { validateEmail } from '../../actions/agrument';
import confetti from '../../actions/confetti';

class SubscribeForm extends React.Component {
  constructor() {
    super();

    this.state = {
      formSubmitted: false,
    };
  }

  @autobind
  handleSubmit(event) {
    event.preventDefault();
    if (validateEmail(this.emailInput.value)) {
      request
        // .post('http://agrument.danesjenovdan.si/subscribe/')
        .get('http://localhost:3000/')
        .send({
          email: this.emailInput.value,
          sig: this.checkBox ? 1 : 0,
        })
        .end((err, res) => {
          if (err) {
            console.error(err);
          } else {
            this.setState({ formSubmitted: true });
            confetti();
          }
        });
    } else {
      this.emailInput.shake();
    }
  }

  @autobind
  resetForm() {
    if (this.emailInput) {
      this.emailInput.value = '';
    }
    this.setState({ formSubmitted: false });
  }

  render() {
    let content;
    if (!this.state.formSubmitted) {
      content = (
        <div>
          <p>Želim, da mi sveže spisan agrument vsak delovni dan dostavite na spodnji mejl:</p>
          <Input type="email" placeholder="email naslov" ref={(el) => { this.emailInput = el; }} />
          <Checkbox large label="Obveščajte me tudi o ostalih aktivnostih inštituta!" ref={(el) => { this.checkBox = el; }} />
          <Button block type="submit" value="Naroči!" />
        </div>
      );
    } else {
      content = (
        <div className="agrument__reset-container">
          <p>HVALA!</p>
          <Button block type="reset" value="Osveži formo" onClickFunc={this.resetForm} />
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
