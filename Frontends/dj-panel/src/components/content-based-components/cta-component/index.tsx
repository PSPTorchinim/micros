import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import { Link } from 'react-router-dom';

export const CtaComponent = (props: any) => {
  return (
    <div className="thq-section-padding" id={props.id}>
      <div className="thq-section-max-width">
        <div className="cta-accent-bg">
          <div className="cta-inner-bg">
            <div className="cta-container">
              <div className="cta-content">
                <span className="thq-heading-2">{props.heading}</span>
                <p className="thq-body-large">{props.content}</p>
              </div>
              <div className="cta-actions">
                <Link
                  to={props.action?.url}
                  type="button"
                  className="thq-button-filled cta-button"
                >
                  {props.action?.text}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CtaComponent.propTypes = {
  heading1: PropTypes.string,
  content1: PropTypes.string,
  action1: PropTypes.string,
};
