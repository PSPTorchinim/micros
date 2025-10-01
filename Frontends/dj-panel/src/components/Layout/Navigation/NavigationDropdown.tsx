import React from 'react';
import { Link } from 'react-router-dom';

interface NavigationLink {
  text: string;
  url: string;
  children?: NavigationLink[];
}

interface NavigationDropdownProps {
  links: NavigationLink[];
  isOpen: boolean;
  depth: number;
}

export const NavigationDropdown: React.FC<NavigationDropdownProps> = ({
  links,
  isOpen,
  depth,
}) => {
  if (!isOpen) return null;

  return (
    <ul className={`dropdown dropdown-depth-${depth}`}>
      {links.map((link, index) => (
        <li key={`${link.text}-${index}`} className="dropdown-item">
          <Link to={link.url} className="dropdown-link">
            {link.text}
          </Link>
          {link.children && link.children.length > 0 && depth < 2 && (
            <NavigationDropdown
              links={link.children}
              isOpen={true}
              depth={depth + 1}
            />
          )}
        </li>
      ))}
    </ul>
  );
};
