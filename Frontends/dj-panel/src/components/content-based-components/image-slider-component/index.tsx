import React from 'react';
import './index.css';

export const ImageSliderComponent = (props: any) => {
  const className = props.reversed
    ? 'thq-animated-group-horizontal-reverse'
    : 'thq-animated-group-horizontal';
  return (
    <div className="image-slider-content">
      <div className="image-slider-row-container thq-animated-group-container-horizontal thq-mask-image-horizontal">
        <div className={className}>
          {props?.images?.map((image: any) => (
            <img
              alt={image.alt}
              src={image.src}
              className="image-slider-placeholder-image thq-img-scale thq-img-ratio-1-1"
            />
          ))}
        </div>
        <div className={className}>
          {props?.images?.map((image: any) => (
            <img
              alt={image.alt}
              src={image.src}
              className="image-slider-placeholder-image thq-img-scale thq-img-ratio-1-1"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
