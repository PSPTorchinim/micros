import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationDropdown } from './NavigationDropdown';

interface NavigationLink {
  text: string;
  url: string;
  children?: NavigationLink[];
}

interface NavigationItemProps {
  link: NavigationLink;
  isActive: boolean;
  onDropdownToggle: (linkText: string) => void;
  depth: number;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  link,
  isActive,
  onDropdownToggle,
  depth,
}) => {
  const hasChildren = link.children && link.children.length > 0;
  const maxDepth = 3; // Prevent infinite nesting

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      onDropdownToggle(link.text);
    }
  };

  return (
    <li
      className={`nav-item nav-item-depth-${depth} ${isActive ? 'active' : ''}`}
    >
      <Link
        to={link.url}
        className={`nav-link ${hasChildren ? 'has-dropdown' : ''}`}
        onClick={handleClick}
      >
        {link.text}
        {hasChildren && <span className="dropdown-arrow">▼</span>}
      </Link>

      {hasChildren && depth < maxDepth && (
        <NavigationDropdown
          links={link.children!}
          isOpen={isActive}
          depth={depth + 1}
        />
      )}
    </li>
  );
};
