import React, { useState, useEffect, useRef } from 'react';
import { NavigationItem } from './NavigationItem';

interface NavigationLink {
  text: string;
  url: string;
  children?: NavigationLink[];
}

interface NavigationBarProps {
  links: NavigationLink[];
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ links }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const handleDropdownToggle = (linkText: string) => {
    setActiveDropdown(activeDropdown === linkText ? null : linkText);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navigation-bar" ref={navRef}>
      <ul className="nav-list">
        {links.map((link, index) => (
          <NavigationItem
            key={`${link.text}-${index}`}
            link={link}
            isActive={activeDropdown === link.text}
            onDropdownToggle={handleDropdownToggle}
            depth={0}
          />
        ))}
      </ul>
    </nav>
  );
};
