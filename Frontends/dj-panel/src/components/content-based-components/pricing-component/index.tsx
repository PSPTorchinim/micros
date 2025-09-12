import { useState } from 'react';
import './index.css';
import React from 'react';
import PropTypes from 'prop-types';

export const PricingComponent = (props: any) => {
  const [selectedType, setSelectedType] = useState(props.pricingTypes[0]);

  return (
    <div className="pricing thq-section-padding">
      <div className="pricing-max-width thq-section-max-width">
        <div className="pricing-section-title">
          <span className="pricing-text thq-body-small">{props.content1}</span>
          <div className="pricing-content">
            <h2 className="pricing-text thq-heading-2">{props.heading1}</h2>
            <p className="pricing-text thq-body-large">{props.content2}</p>
          </div>
        </div>
        <div className="pricing-tabs">
          {props.pricingTypes.map((type: string) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`pricing-button thq-button-animated ${selectedType === type ? 'thq-button-filled' : 'thq-button-outline'}`}
            >
              <span className="thq-body-small">{type}</span>
            </button>
          ))}
        </div>
        <div className="pricing-container">
          {props.plans.map((plan: any, index: number) => (
            <div key={index} className="pricing-column thq-card">
              <div className="pricing-price">
                <div className="pricing-price">
                  <p className="pricing-text thq-body-large">{plan.name}</p>
                  <h3 className="pricing-text thq-heading-3">
                    {plan.prices[selectedType]}
                  </h3>
                  <p className="thq-body-large">
                    {plan[selectedType]?.description || ''}
                  </p>
                </div>
                <div className="pricing-list">
                  {plan.features.map(
                    (feature: string, featureIndex: number) => (
                      <div key={featureIndex} className="pricing-list-item">
                        <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                          <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                        </svg>
                        <span className="thq-body-small">{feature}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
              <button
                className={`pricing-button thq-button-animated ${plan.actionType}`}
              >
                <span className="thq-body-small">{plan.actionText}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

PricingComponent.propTypes = {
  content1: PropTypes.string,
  heading1: PropTypes.string,
  content2: PropTypes.string,
  pricingTypes: PropTypes.arrayOf(PropTypes.string),
  plans: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      features: PropTypes.arrayOf(PropTypes.string),
      actionText: PropTypes.string,
      actionType: PropTypes.string,
      prices: PropTypes.shape({
        Monthly: PropTypes.string,
        'Every 3 Months': PropTypes.string,
        Yearly: PropTypes.string,
      }),
      Monthly: PropTypes.shape({
        description: PropTypes.string,
      }),
      'Every 3 Months': PropTypes.shape({
        description: PropTypes.string,
      }),
      Yearly: PropTypes.shape({
        description: PropTypes.string,
      }),
    }),
  ),
};
