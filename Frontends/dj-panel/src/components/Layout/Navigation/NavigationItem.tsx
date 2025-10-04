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
  const maxDepth = 3;

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      e.stopPropagation();
      onDropdownToggle(link.text);
    }
  };

  const handleMouseEnter = () => {
    if (hasChildren) {
      onDropdownToggle(link.text);
    }
  };

  const handleMouseLeave = () => {
    // Optional: Close dropdown on mouse leave
    // onDropdownToggle('');
  };

  return (
    <li
      className={`nav-item nav-item-depth-${depth} ${isActive ? 'active' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {hasChildren ? (
        <button
          className={`nav-link nav-button ${hasChildren ? 'has-dropdown' : ''}`}
          onClick={handleClick}
          type="button"
        >
          {link.text}
          <span className="dropdown-arrow">▼</span>
        </button>
      ) : (
        <Link to={link.url} className="nav-link">
          {link.text}
        </Link>
      )}

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
