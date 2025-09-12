import React from 'react';

import './index.css';

export const HeroComponent = (props: any) => {
  return (
    <div className="hero-header">
      <div className="hero-column thq-section-padding thq-section-max-width">
        <div className="hero-content">
          <h1 className="hero-text thq-heading-1">{props.heading}</h1>
          <p className="hero-text thq-body-large">{props.content}</p>
        </div>
        <div className="hero-actions">
          {props.actions?.map((action: any) => (
            <a href={action.url} className="thq-button-filled hero-button">
              <span className="thq-body-small">{action.text}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
