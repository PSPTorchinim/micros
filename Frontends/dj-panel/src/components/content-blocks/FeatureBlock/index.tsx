import React, { useState } from 'react';
import './index.css';

export const FeatureBlock = ({ reversed, tabs }: any) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="thq-section-padding content-comntainer">
      <div
        className={
          reversed ? 'features-container reversed' : 'features-container'
        }
      >
        <div className="features-image-container">
          {tabs?.map(
            (tab: any, index: number) =>
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
          {tabs?.map((tab: any, index: number) => (
            <div
              key={index}
              onClick={() => setActiveTab(index)}
              className={
                reversed
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
