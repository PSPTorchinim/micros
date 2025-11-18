import React, { useState } from 'react';
import './index.css';
import { FeatureSection, FeatureTab } from '../../../models/strapi/strapiMap';

export const FeatureBlock = (block: FeatureSection) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="thq-section-padding content-comntainer">
      <div
        className={
          block.reversed ? 'features-container reversed' : 'features-container'
        }
      >
        <div className="features-image-container">
          {block.tabs?.map(
            (tab: FeatureTab, index: number) =>
              activeTab === index && (
                <img
                  key={index}
                  alt={tab.imgAlt}
                  src={tab.imgSrc}
                  className="features-image thq-img-ratio-16-9"
                />
              ),
          )}
        </div>
        <div className="features-tabs-menu">
          {block.tabs?.map((tab: FeatureTab, index: number) => (
            <div
              key={index}
              onClick={() => setActiveTab(index)}
              className={
                block.reversed
                  ? 'features-tab-horizontal reversed'
                  : 'features-tab-horizontal'
              }
            >
              <div className="features-divider-container">
                {activeTab === index && (
                  <div className="features-container-line"></div>
                )}
              </div>
              <div className="features-content">
                <h2 className="thq-heading-2">{tab.title}</h2>
                <span className="thq-body-small">{tab.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
