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
          <SideMenuItem text="Agrument" link="https://agrument.danesjenovdan.si" />
          <SideMenuItem text="Občasnik" link="/obcasnik" />
          <SideMenuItem text="Projekti" link="/projekti" />
          <SideMenuItem text="Krivi" link="/krivi" />
          <SideMenuItem text="Dolžni" link="/dolzni" />
          <SideMenuItem text="Konsenz" link="/konsenz" />
          <SideMenuItem text="Formalnosti" link="/formalnosti" />
        </div>
      </div>
    );
  }
}

export default SideMenu;
