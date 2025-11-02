import React from 'react';
import './index.css';

export const HeroBlock = ({ heading, content, actions }: any) => (
  <div className="hero-header">
    <div className="hero-column thq-section-padding thq-section-max-width">
      <div className="hero-content">
        <h1 className="hero-text thq-heading-1">{heading}</h1>
        <p className="hero-text thq-body-large">{content}</p>
      </div>
      <div className="hero-actions">
        {actions?.map((action: any, idx: number) => (
          <a
            key={idx}
            href={action.url}
            className="thq-button-filled hero-button"
            target={action.OpenInNewTab ? '_blank' : undefined}
            rel={action.OpenInNewTab ? 'noopener noreferrer' : undefined}
          >
            <span className="thq-body-small">
              {action.text || action.Label}
            </span>
          </a>
        ))}
      </div>
    </div>
  </div>
);
