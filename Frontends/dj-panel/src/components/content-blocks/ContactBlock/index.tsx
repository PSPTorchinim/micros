import React from 'react';
import './index.css';
import { ContactInfo, ContactSection } from '../../../models/strapi/strapiMap';

export const ContactBlock = (contactBlock: ContactSection) => (
  <div className="contact-container thq-section-padding">
    <div className="contact-max-width thq-section-max-width">
      <div className="contact-section-title">
        <span className="thq-body-small">{contactBlock.introText}</span>
        <div className="contact-content">
          <h2 className="thq-heading-2">{contactBlock.heading}</h2>
          <p className="contact-text thq-body-large">
            {contactBlock.description}
          </p>
        </div>
      </div>
      <div className="contact-row">
        {contactBlock.contactInfo?.map((info: ContactInfo, index: number) => (
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
