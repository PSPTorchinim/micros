import React from 'react';
import './index.css';
import type { StepsContainer, Cta } from '../../../models/strapi/strapiMap';

interface StepData {
  title?: string;
  heading?: string;
  description?: string;
  content?: string;
}

export const StepsContainerBlock = (props: StepsContainer) => {
  // Extract action - in Strapi it's a dynamic zone, take first item if it exists
  const actionArray = Array.isArray(props.action) ? props.action : [];
  const actionItem =
    actionArray.length > 0 ? (actionArray[0] as unknown as Cta) : null;

  // steps is also a dynamic zone in Strapi - convert to simple step data
  const stepsArray = Array.isArray(props.steps)
    ? (props.steps as unknown as StepData[])
    : [];

  return (
    <div className="steps-container thq-section-padding">
      <div className="steps-max-width thq-section-max-width">
        <div className="steps-grid thq-grid-2">
          <div className="steps-section-header">
            <h2 className="thq-heading-2">{props.heading}</h2>
            <p className="thq-body-large">{props.content}</p>
            {actionItem && actionItem.url && (
              <div className="steps-actions">
                <a
                  href={actionItem.url}
                  className="thq-button-animated thq-button-filled steps-button"
                  target={actionItem.OpenInNewTab ? '_blank' : undefined}
                  rel={
                    actionItem.OpenInNewTab ? 'noopener noreferrer' : undefined
                  }
                >
                  <span className="thq-body-small">{actionItem.Label}</span>
                </a>
              </div>
            )}
          </div>
          <div className="steps-card-container">
            {stepsArray.map((step: StepData, index: number) => (
              <div key={index} className="steps-card thq-card">
                <h2 className="thq-heading-2">{step.title || step.heading}</h2>
                <span className="steps-card-text thq-body-small">
                  {step.description || step.content}
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
};
