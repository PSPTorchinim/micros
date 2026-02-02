import React from 'react';
import './index.css';
import { ThemeToggle } from '../../atoms/ThemeToggle';
import { Menu } from '../Menu';
import PropTypes from 'prop-types';

export const Header = (props: any): React.ReactElement => {
  return (
    <header className="navbar-container">
      <header data-thq="thq-navbar" className="navbar-navbar-interactive">
        <img alt={props.logoAlt} src={props.logoSrc} className="navbar-image" />
        <Menu
          links={props.links}
          logoAlt={props.logoAlt}
          logoSrc={props.logoSrc}
        />
        <div className="navbar-actions">
          <ThemeToggle />
        </div>
      </header>
    </header>
  );
};

Header.propTypes = {
  logoSrc: PropTypes.string,
  logoAlt: PropTypes.string,
  links: PropTypes.array,
};
