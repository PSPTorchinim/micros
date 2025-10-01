import React, { useState } from 'react';
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

  const handleDropdownToggle = (linkText: string) => {
    setActiveDropdown(activeDropdown === linkText ? null : linkText);
  };

  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  return (
    <nav className="navigation-bar" onClick={handleClickOutside}>
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
