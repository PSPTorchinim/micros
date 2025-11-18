import React from 'react';
import type { ContactInfo } from '../../../models/strapi/strapiMap';

export const ContactInfoBlock = (props: ContactInfo) => (
  <div className="contact-info-block">
    <span>{props.iconName}</span>
    <h4>{props.title}</h4>
    <p>{props.content}</p>
    {props.detail && <small>{props.detail}</small>}
  </div>
);
