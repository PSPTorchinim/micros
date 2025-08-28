import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './index.css';

export const FeatureComponent = (props: any) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="thq-section-padding content-comntainer">
      <div
        className={
          props.reversed ? 'features-container reversed' : 'features-container'
        }
      >
        <div className="features-image-container">
          {props.tabs?.map((tab: any, index: number) => {
            return (
              activeTab === index && (
                <img
                  alt={tab.imgAlt}
                  src={tab.imgSrc}
                  className="features-image thq-img-ratio-16-9"
                />
              )
            );
          })}
        </div>
        <div className="features-tabs-menu">
          {props.tabs?.map((tab: any, index: number) => {
            return (
              <div
                onClick={() => setActiveTab(index)}
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

FeatureComponent.propTypes = {
  reversed: PropTypes.bool,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      imgAlt: PropTypes.string,
      imgSrc: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
    }),
  ),
};
