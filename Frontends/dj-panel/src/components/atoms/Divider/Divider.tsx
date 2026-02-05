import React from 'react';
import './Divider.css';

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  spacing?: 'small' | 'medium' | 'large';
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  spacing = 'medium',
  className = '',
  ...props
}) => {
  const classes = [
    'atom-divider',
    `atom-divider--${orientation}`,
    `atom-divider--${variant}`,
    `atom-divider--spacing-${spacing}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <hr className={classes} {...props} />;
};
