import React from 'react';
import './index.css';
import { DesktopMenu } from './menu/desktop-menu';
import { MobileMenu } from './menu/mobile-menu';
import { ThemeToggle } from '../../components/atoms/ThemeToggle';
import PropTypes from 'prop-types';

export const Header = (props: any): React.ReactElement => {
  return (
    <header className="navbar-container">
      <header data-thq="thq-navbar" className="navbar-navbar-interactive">
        <img alt={props.logoAlt} src={props.logoSrc} className="navbar-image" />
        <DesktopMenu links={props.links} />
        <div className="navbar-actions">
          <ThemeToggle />
          <MobileMenu
            links={props.links}
            logoAlt={props.logoAlt}
            logoSrc={props.logoSrc}
          />
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
