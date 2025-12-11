import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import { useMenuLogic } from '../menuUtils';

import { NavigationItem } from '../../../../models/strapi/navigation-item';
import { ConfigurationMenuEnum } from '../../../../models/strapi/strapiMap';
import { Button } from '../../../../components/atoms';

export const DesktopMenu = (props: any) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { hasPermission, isAuthenticated, handleAction } = useMenuLogic();

  const toggleDropdown = (text: string | null) => {
    setOpenDropdown(openDropdown === text ? null : text);
  };

  const handleKeyDown = (event: React.KeyboardEvent, text: string | null) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleDropdown(text);
    }
  };

  const renderLinks = (links: NavigationItem[]) => {
    return links
      .filter((element: any) => hasPermission(element.permissions))
      .map((element: any) => {
        const text = element.text || element.Title;
        const authState = element.AuthState || 'All';
        const shouldShow =
          authState === 'All' ||
          (authState === 'OnlyAuthenticated' && isAuthenticated()) ||
          (authState === 'OnlyUnauthenticated' && !isAuthenticated());

        if (shouldShow) {
          const isAction = element.NavigationAction === 'Action';
          return (
            <div
              key={text}
              className="navbar-item"
              onMouseEnter={() => toggleDropdown(text)}
              onMouseLeave={() => toggleDropdown(null)}
              onKeyDown={(e) => handleKeyDown(e, text)}
              tabIndex={0}
              aria-haspopup={!!element.children}
              aria-expanded={openDropdown === text}
            >
              {isAction ? (
                <Button
                  variant="flat"
                  className="thq-link thq-body-small"
                  children={text}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAction(text);
                  }}
                />
              ) : element.url ? (
                <Link to={element.url} className="thq-link thq-body-small">
                  {text}
                </Link>
              ) : (
                <span className="thq-link thq-body-small">{text}</span>
              )}
              {element.children && (
                <div
                  className={`navbar-dropdown ${
                    openDropdown === text ? 'visible' : 'hidden'
                  }`}
                  role="menu"
                  onMouseEnter={() => toggleDropdown(text)}
                  onMouseLeave={() => toggleDropdown(null)}
                >
                  {renderLinks(element.children)}
                </div>
              )}
            </div>
          );
        }
        return null;
      });
  };

  // If menu property is missing, treat all as main
  const menuValueEquals = (menuValue: any, enumValue: any) => {
    if (!menuValue && !enumValue) return true;
    if (!menuValue || !enumValue) return false;
    return String(menuValue).toLowerCase() === String(enumValue).toLowerCase();
  };

  const mainLinks = props.links
    ? props.links.filter(
        (element: any) =>
          menuValueEquals(element.Menu, ConfigurationMenuEnum.Main) ||
          element.Menu === undefined,
      )
    : [];
  const loginLinks = props.links
    ? props.links.filter((element: any) =>
        menuValueEquals(element.Menu, ConfigurationMenuEnum.Login),
      )
    : [];

  return (
    <div data-thq="thq-navbar-nav" className="navbar-desktop-menu">
      <nav className="navbar-links">{renderLinks(mainLinks)}</nav>
      <div className="navbar-links">{renderLinks(loginLinks)}</div>
    </div>
  );
};
