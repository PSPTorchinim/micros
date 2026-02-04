// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @ts-ignore - React is needed for JSX
import React from 'react';
import './index.css';
import type { ContactInfo } from '../../../models/api/strapi/apiMap';

export const ContactInfoBlock = (props: ContactInfo) => (
  <div className="contact-info-block">
    <span>{props.iconName}</span>
    <h4>{props.title}</h4>
    <p>{props.content}</p>
    {props.detail && <small>{props.detail}</small>}
  </div>
);
