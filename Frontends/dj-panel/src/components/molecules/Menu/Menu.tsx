import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';
import { ConfigurationMenuEnum } from '../../../models/api/strapi/apiMap';
import { Button } from '../../atoms';
import type { NavigationItem } from '../../DynamicRoutes';
import { useMenuLogic } from './menuUtils';

export interface MenuProps {
  links?: NavigationItem[];
  logoSrc?: string;
  logoAlt?: string;
}

export const Menu: React.FC<MenuProps> = ({ links = [], logoSrc, logoAlt }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  const [hoverDropdown, setHoverDropdown] = useState<string | null>(null);
  const { hasPermission, isAuthenticated, handleAction } = useMenuLogic();

  // Close mobile menu and clear dropdown states when viewport becomes desktop-sized
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 767) {
        if (isMenuOpen) {
          setIsMenuOpen(false);
        }
        // Always clear dropdown states when switching to desktop
        setOpenDropdowns(new Set());
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
    // Clear hover state to prevent interference on touch devices
    setHoverDropdown(null);
  };

  const handleHoverDropdown = (text: string | null) => {
    setHoverDropdown(text);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent,
    text: string | null,
  ): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (text) {
        handleHoverDropdown(hoverDropdown === text ? null : text);
      }
    }
  };

  const renderLinks = (items: NavigationItem[]): React.ReactNode => {
    return items
      .filter((element) => hasPermission(element.permissions))
      .map((element) => {
        const text = element.text;
        const authState = element.AuthState || 'All';
        const shouldShow =
          authState === 'All' ||
          (authState === 'OnlyAuthenticated' && isAuthenticated()) ||
          (authState === 'OnlyUnauthenticated' && !isAuthenticated());

        if (!shouldShow) return null;

        const hasChildren =
          Array.isArray(element.children) && element.children.length > 0;
        const isAction = element.NavigationAction === 'Action';
        const itemId = element.id || text;
        const isClickDropdownOpen = openDropdowns.has(String(itemId));
        const isHoverDropdownOpen = hoverDropdown === text;

        return (
          <div
            key={text}
            className="menu-item"
            onMouseEnter={() => handleHoverDropdown(text)}
            onMouseLeave={() => handleHoverDropdown(null)}
            onKeyDown={(e) => handleKeyDown(e, text)}
            tabIndex={0}
            aria-haspopup={!!element.children}
            aria-expanded={isClickDropdownOpen || isHoverDropdownOpen}
          >
            <div className="menu-item-content">
              {isAction ? (
                <Button
                  variant="flat"
                  className="thq-link thq-body-small"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    handleAction(text, () => setIsMenuOpen(false));
                  }}
                >
                  {text}
                </Button>
              ) : element.url && !hasChildren ? (
                <Link
                  to={element.url}
                  className="thq-link thq-body-small"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {text}
                </Link>
              ) : (
                <span
                  className={`thq-link thq-body-small ${hasChildren ? 'menu-item-with-children' : ''}`}
                >
                  {text}
                </span>
              )}
              {hasChildren && (
                <button
                  className="menu-dropdown-toggle"
                  onClick={() => toggleDropdown(itemId)}
                  aria-label={`Toggle ${text} submenu`}
                  aria-expanded={isClickDropdownOpen || isHoverDropdownOpen}
                >
                  <svg
                    viewBox="0 0 1024 1024"
                    className={`menu-dropdown-icon ${isClickDropdownOpen || isHoverDropdownOpen ? 'open' : ''}`}
                  >
                    <path d="M316 366l196 196 196-196 60 60-256 256-256-256z"></path>
                  </svg>
                </button>
              )}
            </div>
            {element.children && (
              <div
                className={`menu-dropdown ${
                  isClickDropdownOpen || isHoverDropdownOpen
                    ? 'visible'
                    : 'hidden'
                }`}
                role="menu"
                onMouseEnter={() => handleHoverDropdown(text)}
                onMouseLeave={() => handleHoverDropdown(null)}
              >
                {renderLinks(element.children)}
              </div>
            )}
          </div>
        );
      });
  };

  const menuValueEquals = useCallback((menuValue: any, enumValue: any) => {
    if (!menuValue && !enumValue) return true;
    if (!menuValue || !enumValue) return false;
    return String(menuValue).toLowerCase() === String(enumValue).toLowerCase();
  }, []);

  const mainLinks = useMemo(
    () =>
      links.filter(
        (element) =>
          menuValueEquals(element.Menu, ConfigurationMenuEnum.Main) ||
          element.Menu === undefined,
      ),
    [links, menuValueEquals],
  );

  const loginLinks = useMemo(
    () =>
      links.filter((element) =>
        menuValueEquals(element.Menu, ConfigurationMenuEnum.Login),
      ),
    [links, menuValueEquals],
  );

  return (
    <>
      {/* Desktop Menu */}
      <div data-thq="thq-navbar-nav" className="menu-desktop-menu">
        <nav className="menu-links">{renderLinks(mainLinks)}</nav>
        <div className="menu-links">{renderLinks(loginLinks)}</div>
      </div>

      {/* Mobile Menu */}
      <div
        data-thq="thq-burger-menu"
        className="menu-burger-menu"
        onClick={toggleMenu}
      >
        <svg viewBox="0 0 1024 1024" className="menu-icon">
          <path d="M128 554.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 298.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 810.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667z"></path>
        </svg>
      </div>
      <div
        data-thq="thq-mobile-menu"
        className="menu-mobile-menu"
        style={{ display: isMenuOpen ? 'block' : 'none' }}
      >
        <div className="menu-mobile-nav">
          <div className="menu-mobile-top">
            <img alt={logoAlt} src={logoSrc} className="menu-mobile-logo" />
            <div
              data-thq="thq-close-menu"
              className="menu-mobile-close-menu"
              onClick={toggleMenu}
            >
              <svg viewBox="0 0 1024 1024" className="menu-icon">
                <path d="M810 274l-238 238 238 238-60 60-238-238-238 238-60-60 238-238-238-238 60-60 238 238 238-238z"></path>
              </svg>
            </div>
          </div>
          <nav className="menu-links">
            {renderLinks(mainLinks.sort((a, b) => (a.id ?? 0) - (b.id ?? 0)))}
          </nav>
        </div>
        <div className="menu-mobile-buttons">
          {renderLinks(loginLinks.sort((a, b) => (a.id ?? 0) - (b.id ?? 0)))}
        </div>
      </div>
    </>
  );
};
