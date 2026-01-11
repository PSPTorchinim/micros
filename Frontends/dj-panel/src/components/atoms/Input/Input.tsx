import React from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const classes = [
    'atom-input',
    fullWidth && 'atom-input--full-width',
    error && 'atom-input--error',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={`atom-input-wrapper ${fullWidth ? 'atom-input-wrapper--full-width' : ''}`}
    >
      {label && (
        <label htmlFor={inputId} className="atom-input-label">
          {label}
        </label>
      )}
      <input id={inputId} className={classes} {...props} />
      {error && <span className="atom-input-error">{error}</span>}
    </div>
  );
};
