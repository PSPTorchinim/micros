import React from 'react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outline' | 'flat';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'filled',
  size = 'medium',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const classes = [
    'atom-button',
    `atom-button--${variant}`,
    `atom-button--${size}`,
    fullWidth && 'atom-button--full-width',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
