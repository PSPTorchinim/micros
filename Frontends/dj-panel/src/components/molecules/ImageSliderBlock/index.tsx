// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @ts-ignore - React is needed for JSX
import React from 'react';
import './index.css';
import type { ImageSlider } from '../../../models/api/strapi/apiMap';

interface SlideData {
  imageUrl?: string;
  src?: string;
  url?: string;
  alt?: string;
  caption?: string;
  alternativeText?: string;
}

export const ImageSliderBlock = (props: ImageSlider) => {
  // Slides is a dynamic zone in Strapi - extract as slide data
  const slidesArr = Array.isArray(props.Slides)
    ? (props.Slides as unknown as SlideData[])
    : [];
  const className = props.reversed
    ? 'thq-animated-group-horizontal-reverse'
    : 'thq-animated-group-horizontal';
  return (
    <div className="image-slider-block">
      <div className="image-slider-content">
        {props.Title && (
          <h2 className="image-slider-block__title">{props.Title}</h2>
        )}
        <div className="image-slider-row-container thq-animated-group-container-horizontal thq-mask-image-horizontal">
          <div className={className}>
            {slidesArr.map((slide: SlideData, idx: number) => (
              <img
                key={idx}
                alt={
                  slide.alt ??
                  slide.caption ??
                  slide.alternativeText ??
                  `slide-${idx}`
                }
                src={slide.imageUrl ?? slide.src ?? slide.url}
                className="image-slider-placeholder-image thq-img-scale thq-img-ratio-1-1"
              />
            ))}
          </div>
          <div className={className}>
            {slidesArr.map((slide: SlideData, idx: number) => (
              <img
                key={idx}
                alt={
                  slide.alt ??
                  slide.caption ??
                  slide.alternativeText ??
                  `slide-${idx}`
                }
                src={slide.imageUrl ?? slide.src ?? slide.url}
                className="image-slider-placeholder-image thq-img-scale thq-img-ratio-1-1"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
