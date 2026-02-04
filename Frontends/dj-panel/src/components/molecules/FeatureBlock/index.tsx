// @ts-ignore - React is needed for JSX
import React, { useState } from 'react';
import './index.css';
import type { FeatureSection } from '../../../models/api/strapi/apiMap';

export const FeatureBlock = (props: FeatureSection) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = Array.isArray(props.tabs) ? props.tabs : [];

  return (
    <div className="thq-section-padding content-container">
      <div
        className={
          props.reversed ? 'features-container reversed' : 'features-container'
        }
      >
        <div className="features-image-container">
          {tabs.map(
            (tab, index: number) =>
              activeTab === index && (
                <img
                  key={`${tab.imgSrc}-${tab.title}`}
                  alt={tab.imgAlt ?? ''}
                  src={tab.imgSrc ?? ''}
                  className="features-image thq-img-ratio-16-9"
                />
              ),
          )}
        </div>
        <div className="features-tabs-menu" role="tablist">
          {tabs.map((tab, index: number) => (
            <div
              key={`${tab.title}-${tab.description}`}
              onClick={() => setActiveTab(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveTab(index);
                }
              }}
              role="tab"
              aria-selected={activeTab === index}
              tabIndex={0}
              className={
                props.reversed
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
