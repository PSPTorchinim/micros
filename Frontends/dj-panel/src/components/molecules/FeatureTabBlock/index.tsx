import React from 'react';
import './index.css';
import type { FeatureTab } from '../../../models/api/strapi/apiMap';

export const FeatureTabBlock = (props: FeatureTab) => (
  <div className="feature-tab-block">
    {props.imgSrc && (
      <img
        src={props.imgSrc}
        alt={props.imgAlt ?? props.title ?? ''}
        style={{ maxWidth: 200 }}
      />
    )}
    <h3>{props.title}</h3>
    <p>{props.description}</p>
  </div>
);
