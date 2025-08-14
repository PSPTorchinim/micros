import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

export const ContactComponent = (props: any) => {
  return (
    <div className="contact-container thq-section-padding">
      <div className="contact-max-width thq-section-max-width">
        <div className="contact-section-title">
          <span className="thq-body-small">{props.introText}</span>
          <div className="contact-content">
            <h2 className="thq-heading-2">{props.heading}</h2>
            <p className="contact-text thq-body-large">{props.description}</p>
          </div>
        </div>
        <div className="contact-row">
          {props.contactInfo.map((info: any, index: number) => (
            <div className="contact-info" key={index}>
              {React.createElement(info.iconPath, {
                className: 'thq-icon-medium',
              })}
              <div className="contact-info-content">
                <h3 className="contact-info-title thq-heading-3">
                  {info.title}
                </h3>
                <p className="contact-info-text thq-body-large">
                  {info.content}
                </p>
                <span className="contact-info-detail thq-body-small">
                  {info.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ContactComponent.propTypes = {
  introText: PropTypes.string,
  heading: PropTypes.string,
  description: PropTypes.string,
  contactInfo: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.string,
      detail: PropTypes.string,
      iconPath: PropTypes.func,
    }),
  ),
};
