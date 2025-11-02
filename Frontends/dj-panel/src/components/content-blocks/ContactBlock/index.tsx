import React from 'react';
import './index.css';

export const ContactBlock = ({
  introText,
  heading,
  description,
  contactInfo,
}: any) => (
  <div className="contact-container thq-section-padding">
    <div className="contact-max-width thq-section-max-width">
      <div className="contact-section-title">
        <span className="thq-body-small">{introText}</span>
        <div className="contact-content">
          <h2 className="thq-heading-2">{heading}</h2>
          <p className="contact-text thq-body-large">{description}</p>
        </div>
      </div>
      <div className="contact-row">
        {contactInfo?.map((info: any, index: number) => (
          <div className="contact-info" key={index}>
            {/* Render icon by name using a dynamic import or a mapping in your app */}
            <span className="thq-icon-medium">{info.iconName}</span>
            <div className="contact-info-content">
              <h3 className="contact-info-title thq-heading-3">{info.title}</h3>
              <p className="contact-info-text thq-body-large">{info.content}</p>
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
