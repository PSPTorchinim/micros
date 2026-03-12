import React, { useId, useMemo } from 'react';
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
  const generatedId = useId();
  const inputId = useMemo(() => id ?? generatedId, [id, generatedId]);
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
