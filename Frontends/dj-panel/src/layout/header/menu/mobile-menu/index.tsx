import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './index.css';
import { useMenuLogic } from '../menuUtils';
import { ConfigurationMenuEnum } from '../../../../models/strapi/strapiMap';
import { Button } from '../../../../components/atoms';

export const MobileMenu = (props: any) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  const { hasPermission, isAuthenticated, handleAction } = useMenuLogic();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Reset all dropdowns when closing the menu
    if (isMenuOpen) {
      setOpenDropdowns(new Set());
    }
  };

  const toggleDropdown = (id: string | number) => {
    setOpenDropdowns((prev) => {
      const next = new Set(prev);
      const key = String(id);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const renderLinks = (links: any[]) => {
    return links
      .filter((element: any) => hasPermission(element.permissions))
      .map((element: any) => {
        const authState = element.AuthState || 'All';
        const shouldShow =
          authState === 'All' ||
          (authState === 'OnlyAuthenticated' && isAuthenticated()) ||
          (authState === 'OnlyUnauthenticated' && !isAuthenticated());

        if (shouldShow) {
          const hasChildren =
            Array.isArray(element.children) && element.children.length > 0;
          const isAction = element.NavigationAction === 'Action';
          const itemId = element.id || element.text;
          const isDropdownOpen = openDropdowns.has(String(itemId));

          return (
            <div key={element.text} className="navbar-mobile-item">
              <div className="navbar-mobile-item-content">
                {isAction ? (
                  <Button
                    variant="flat"
                    className="thq-link thq-body-small"
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      handleAction(element.text, () => setIsMenuOpen(false));
                    }}
                  >
                    {element.text}
                  </Button>
                ) : element.url && !hasChildren ? (
                  // Items with URLs and no children are direct links
                  <Link
                    to={element.url}
                    className="thq-link thq-body-small"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {element.text}
                  </Link>
                ) : (
                  // Items without URLs or with children are expandable/static labels
                  <span
                    className={`thq-link thq-body-small ${hasChildren ? 'navbar-mobile-item-with-children' : ''}`}
                  >
                    {element.text}
                  </span>
                )}
                {hasChildren && (
                  <button
                    className="navbar-mobile-dropdown-toggle"
                    onClick={() => toggleDropdown(itemId)}
                    aria-label={`Toggle ${element.text} submenu`}
                    aria-expanded={isDropdownOpen}
                  >
                    <svg
                      viewBox="0 0 1024 1024"
                      className={`navbar-mobile-dropdown-icon ${isDropdownOpen ? 'open' : ''}`}
                    >
                      <path d="M316 366l196 196 196-196 60 60-256 256-256-256z"></path>
                    </svg>
                  </button>
                )}
              </div>
              {hasChildren && isDropdownOpen && (
                <div className="navbar-mobile-dropdown">
                  {renderLinks(element.children)}
                </div>
              )}
            </div>
          );
        }
        return null;
      });
  };

  return (
    <>
      <div
        data-thq="thq-burger-menu"
        className="navbar-burger-menu"
        onClick={toggleMenu}
      >
        <svg viewBox="0 0 1024 1024" className="navbar-mobile-icon">
          <path d="M128 554.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 298.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 810.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667z"></path>
        </svg>
      </div>
      <div
        data-thq="thq-mobile-menu"
        className="navbar-mobile-menu"
        style={{ display: isMenuOpen ? 'block' : 'none' }}
      >
        <div className="navbar-mobile-nav">
          <div className="navbar-mobile-top">
            <img
              alt={props.logoAlt}
              src={props.logoSrc}
              className="navbar-mobile-logo"
            />
            <div
              data-thq="thq-close-menu"
              className="navbar-mobile-close-menu"
              onClick={toggleMenu}
            >
              <svg viewBox="0 0 1024 1024" className="navbar-mobile-icon">
                <path d="M810 274l-238 238 238 238-60 60-238-238-238 238-60-60 238-238-238-238 60-60 238 238 238-238z"></path>
              </svg>
            </div>
          </div>
          {/* If menu property is missing, treat all as main. Sort by id. */}
          <nav className="navbar-mobile-links">
            {renderLinks(
              props.links?.filter
                ? props.links
                    .filter(
                      (element: any) =>
                        element.Menu === ConfigurationMenuEnum.Main ||
                        element.Menu === undefined,
                    )
                    .sort((a: any, b: any) => (a.id ?? 0) - (b.id ?? 0))
                : props.links,
            )}
          </nav>
        </div>
        <div className="navbar-mobile-buttons">
          {renderLinks(
            props.links?.filter
              ? props.links
                  .filter(
                    (element: any) =>
                      element.Menu === ConfigurationMenuEnum.Login,
                  )
                  .sort((a: any, b: any) => (a.id ?? 0) - (b.id ?? 0))
              : [],
          )}
        </div>
      </div>
    </>
  );
};
