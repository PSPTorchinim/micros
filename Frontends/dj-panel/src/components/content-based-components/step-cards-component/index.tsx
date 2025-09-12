import React from 'react';

import './index.css';
import { Link } from 'react-router-dom';

export const StepCardsComponent = (props: any) => {
  return (
    <div className="steps-container thq-section-padding">
      <div className="steps-max-width thq-section-max-width">
        <div className="steps-grid thq-grid-2">
          <div className="steps-section-header">
            <h2 className="thq-heading-2">{props.heading}</h2>
            <p className="thq-body-large">{props.content}</p>
            <div className="steps-actions">
              <Link
                to={props.action?.src}
                className="thq-button-animated thq-button-filled steps-button"
              >
                <span className="thq-body-small">{props.action?.text}</span>
              </Link>
            </div>
          </div>
          <div className="steps-card-container">
            {props.steps?.map((step: any, index: any) => (
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
};
