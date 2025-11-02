import React from 'react';
import './index.css';

export const ImageSliderBlock = ({ Title, reversed, Slides, images }: any) => {
  // Accept both Slides (Strapi) and images (static content)
  const slidesArr = Slides || images || [];
  const className = reversed
    ? 'thq-animated-group-horizontal-reverse'
    : 'thq-animated-group-horizontal';
  return (
    <div className="image-slider-content">
      {Title && <h2 className="image-slider-block__title">{Title}</h2>}
      <div className="image-slider-row-container thq-animated-group-container-horizontal thq-mask-image-horizontal">
        <div className={className}>
          {slidesArr?.map((slide: any, idx: number) => (
            <img
              key={idx}
              alt={slide.alt || slide.caption || `slide-${idx}`}
              src={slide.imageUrl || slide.src}
              className="image-slider-placeholder-image thq-img-scale thq-img-ratio-1-1"
            />
          ))}
        </div>
        <div className={className}>
          {slidesArr?.map((slide: any, idx: number) => (
            <img
              key={idx}
              alt={slide.alt || slide.caption || `slide-${idx}`}
              src={slide.imageUrl || slide.src}
              className="image-slider-placeholder-image thq-img-scale thq-img-ratio-1-1"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
