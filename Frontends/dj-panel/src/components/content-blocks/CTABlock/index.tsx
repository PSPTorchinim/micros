import React from 'react';
import './index.css';

export const CTABlock = ({ heading, content, action }: any) => (
  <div className="thq-section-padding" id={action?.id}>
    <div className="thq-section-max-width">
      <div className="cta-accent-bg">
        <div className="cta-inner-bg">
          <div className="cta-container">
            <div className="cta-content">
              <span className="thq-heading-2">{heading}</span>
              <p className="thq-body-large">{content}</p>
            </div>
            {action && action.url && (
              <div className="cta-actions">
                <a
                  href={action.url}
                  className="thq-button-filled cta-button"
                  target={action.OpenInNewTab ? '_blank' : undefined}
                  rel={action.OpenInNewTab ? 'noopener noreferrer' : undefined}
                >
                  {action.text || action.Label}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
