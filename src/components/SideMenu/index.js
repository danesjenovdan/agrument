import React from 'react';
import classnames from 'classnames';
import SideMenuItem from './SideMenuItem';

class SideMenu extends React.Component {
  constructor() {
    super();

    this.state = {
      isOpen: false,
    };
  }

  toggleMenu() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  render() {
    const classes = classnames(
      'component__sidemenu',
      { 'component__sidemenu--open': this.state.isOpen },
    );
    return (
      <div className={classes}>
        <button className="sidemenu__toggle" type="button" onClick={() => { this.toggleMenu(); }}>
          <div className="sidemenu__toggle__icon">
            <div className="icon-menu" />
          </div>
          <div className="sidemenu__toggle__text">Meni</div>
        </button>
        <div className="sidemenu__content">
          <div className="sidemenu__header">
            <button className="sidemenu__close" type="button" onClick={() => { this.toggleMenu(); }}>
              <div>×</div>
            </button>
            <div className="sidemenu__title">Danes je nov dan</div>
            <div className="sidemenu__title-back">Danes je nov dan</div>
          </div>
          <SideMenuItem color="#c2d8d8" text="Agrument" link="https://agrument.danesjenovdan.si" active={true} />
          <SideMenuItem color="#e3c3bf" text="Občasnik" link="https://danesjenovdan.si/obcasnik" />
          <SideMenuItem color="#e3c3bf" text="Projekti" link="https://danesjenovdan.si/projekti" />
          <SideMenuItem color="#c2d8d8" text="Krivi" link="https://danesjenovdan.si/krivi" />
          <SideMenuItem color="#e4d2a3" text="Dolžni" link="https://danesjenovdan.si/dolzni" />
          <SideMenuItem color="#c2d8d8" text="Konsenz" link="https://danesjenovdan.si/konsenz" />
          <SideMenuItem color="#e4d2a3" text="Formalnosti" link="https://danesjenovdan.si/formalnosti" />
        </div>
      </div>
    );
  }
}

export default SideMenu;
