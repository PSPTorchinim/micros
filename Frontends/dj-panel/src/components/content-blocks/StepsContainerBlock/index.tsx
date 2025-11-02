import React from 'react';
import './index.css';

export const StepsContainerBlock = ({
  heading,
  content,
  action,
  steps,
}: any) => (
  <div className="steps-container thq-section-padding">
    <div className="steps-max-width thq-section-max-width">
      <div className="steps-grid thq-grid-2">
        <div className="steps-section-header">
          <h2 className="thq-heading-2">{heading}</h2>
          <p className="thq-body-large">{content}</p>
          {action && action.url && (
            <div className="steps-actions">
              <a
                href={action.url}
                className="thq-button-animated thq-button-filled steps-button"
                target={action.OpenInNewTab ? '_blank' : undefined}
                rel={action.OpenInNewTab ? 'noopener noreferrer' : undefined}
              >
                <span className="thq-body-small">{action.Label}</span>
              </a>
            </div>
          )}
        </div>
        <div className="steps-card-container">
          {steps?.map((step: any, index: number) => (
            <div key={index} className="steps-card thq-card">
              <h2 className="thq-heading-2">{step.title}</h2>
              <span className="steps-card-text thq-body-small">
                {step.description}
              </span>
              <label className="steps-card-label thq-heading-3">
                {index + 1}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
