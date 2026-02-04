import React from 'react';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';
import './Link.css';

export interface LinkProps extends Omit<RouterLinkProps, 'to'> {
  to?: string;
  href?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'muted';
  underline?: 'none' | 'hover' | 'always';
  external?: boolean;
}

export const Link: React.FC<LinkProps> = ({
  children,
  to,
  href,
  variant = 'default',
  underline = 'hover',
  external = false,
  className = '',
  ...props
}) => {
  const classes = [
    'atom-link',
    `atom-link--${variant}`,
    `atom-link--underline-${underline}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const destination = to ?? href ?? '#';

  // External links or mailto/tel links
  if (
    external ||
    destination.startsWith('http') ||
    destination.startsWith('mailto:') ||
    destination.startsWith('tel:')
  ) {
    return (
      <a
        href={destination}
        className={classes}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  // Internal routing links
  return (
    <RouterLink to={destination} className={classes} {...props}>
      {children}
    </RouterLink>
  );
};
