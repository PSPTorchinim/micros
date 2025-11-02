import React from 'react';

export const FeatureTabBlock = ({
  imgAlt,
  imgSrc,
  title,
  description,
}: any) => (
  <div className="feature-tab-block">
    {imgSrc && (
      <img src={imgSrc} alt={imgAlt || title} style={{ maxWidth: 200 }} />
    )}
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);
