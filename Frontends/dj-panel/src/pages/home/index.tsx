import React from 'react';
import { HeroComponent } from '../../components/content-based-components/hero-component';
import { ImageSliderComponent } from '../../components/content-based-components/image-slider-component';
import { FeatureComponent } from '../../components/content-based-components/feature-component';
import { CtaComponent } from '../../components/content-based-components/cta-component';
import { StepCardsComponent } from '../../components/content-based-components/step-cards-component';

import './index.css';
import { PricingComponent } from '../../components/content-based-components/pricing-component';
import { ContactComponent } from '../../components/content-based-components/contact-component';

export const HomeComponent = (props: any) => {
  return props.content.map((element: any, index: number) => {
    const sectionId = element.id || `section-${index}`;
    switch (element.type) {
      case 'hero':
        return (
          <div className="home-container" id={sectionId}>
            <HeroComponent {...element.data} />
          </div>
        );
      case 'image-slider':
        return (
          <div className="home-container" id={sectionId}>
            <ImageSliderComponent {...element.data} />
          </div>
        );
      case 'feature-section':
        return (
          <div className="home-container" id={sectionId}>
            <FeatureComponent {...element.data} />
          </div>
        );
      case 'cta':
        return (
          <div className="home-container" id={sectionId}>
            <CtaComponent {...element.data} />
          </div>
        );
      case 'steps':
        return (
          <div className="home-container" id={sectionId}>
            <StepCardsComponent {...element.data} />
          </div>
        );
      case 'pricing':
        return (
          <div className="home-container" id={sectionId}>
            <PricingComponent {...element.data} />
          </div>
        );
      case 'contact':
        return (
          <div className="home-container" id={sectionId}>
            <ContactComponent {...element.data} />
          </div>
        );
      default:
        return null;
    }
  });
};
