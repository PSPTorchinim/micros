import React from 'react';
import './Text.css';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body'
    | 'caption'
    | 'small';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right' | 'justify';
  color?: 'primary' | 'secondary' | 'muted' | 'error' | 'success';
  as?: keyof JSX.IntrinsicElements;
}

function getDefaultElement(variant: TextProps['variant']): keyof JSX.IntrinsicElements {
  switch (variant) {
    case 'h1':
      return 'h1';
    case 'h2':
      return 'h2';
    case 'h3':
      return 'h3';
    case 'h4':
      return 'h4';
    case 'h5':
      return 'h5';
    case 'h6':
      return 'h6';
    case 'caption':
    case 'small':
      return 'span';
    case 'body':
    default:
      return 'p';
  }
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  weight = 'normal',
  align = 'left',
  color,
  as,
  className = '',
  ...props
}) => {
  const elementType = as ?? getDefaultElement(variant);

  const classes = [
    'atom-text',
    `atom-text--${variant}`,
    `atom-text--weight-${weight}`,
    `atom-text--align-${align}`,
    color && `atom-text--color-${color}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return React.createElement(
    elementType,
    { className: classes, ...props },
    children,
  );
};
