import React from 'react';
import './Icon.css';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  color?: 'primary' | 'secondary' | 'muted' | 'error' | 'success' | 'inherit';
}

export const Icon: React.FC<IconProps> = ({
  children,
  size = 'medium',
  color = 'inherit',
  className = '',
  ...props
}) => {
  const classes = [
    'atom-icon',
    `atom-icon--${size}`,
    `atom-icon--color-${color}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};
