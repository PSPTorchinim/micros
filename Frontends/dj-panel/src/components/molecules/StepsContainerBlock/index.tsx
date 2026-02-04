// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @ts-ignore - React is needed for JSX
import React from 'react';
import './index.css';
import type { StepsContainer, Cta } from '../../../models/api/strapi/apiMap';

interface Step {
  id?: number;
  title?: string;
  description?: string;
  icon?: string;
}

export const StepsContainerBlock = (props: StepsContainer) => {
  // Extract action - now it's a direct relation to CTA (oneToOne)
  const actionItem = props.action as unknown as Cta | null | undefined;

  // steps is now a repeatable component array
  const stepsArray = Array.isArray(props.steps)
    ? (props.steps as unknown as Step[])
    : [];

  return (
    <div className="steps-container thq-section-padding">
      <div className="steps-max-width thq-section-max-width">
        <div className="steps-grid thq-grid-2">
          <div className="steps-section-header">
            <h2 className="thq-heading-2">{props.heading}</h2>
            <p className="thq-body-large">{props.content}</p>
            {actionItem?.url && (
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
            {stepsArray.map((step: Step, index: number) => (
              <div key={step.id ?? index} className="steps-card thq-card">
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
};
