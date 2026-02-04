// @ts-ignore - React is needed for JSX
import React from 'react';
import './index.css';
import type { HeroBlock as HeroBlockType } from '../../../models/api/strapi/apiMap';

export const HeroBlock = (props: HeroBlockType) => (
  <div className="hero-header">
    <div className="hero-column thq-section-padding thq-section-max-width">
      <div className="hero-content">
        <h1 className="hero-text thq-heading-1">{props.heading}</h1>
        <p className="hero-text thq-body-large">{props.content}</p>
      </div>
      <div className="hero-actions">
        {props.actions?.map((action, idx: number) => (
          <a
            key={idx}
            href={action.url}
            className="thq-button-filled hero-button"
            target={action.OpenInNewTab ? '_blank' : undefined}
            rel={action.OpenInNewTab ? 'noopener noreferrer' : undefined}
          >
            <span className="thq-body-small">{action.Label}</span>
          </a>
        ))}
      </div>
    </div>
  </div>
);
