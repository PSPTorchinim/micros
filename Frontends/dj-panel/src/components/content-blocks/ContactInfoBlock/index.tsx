import React from 'react';

export const ContactInfoBlock = ({ title, content, detail, iconName }: any) => (
  <div className="contact-info-block">
    <span>{iconName}</span>
    <h4>{title}</h4>
    <p>{content}</p>
    {detail && <small>{detail}</small>}
  </div>
);
