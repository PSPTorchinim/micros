import React from 'react';
import './index.css';
import type { Cta } from '../../../models/strapi/strapiMap';

export const CTABlock = (props: Cta) => (
  <div className="thq-section-padding" id={props.id?.toString()}>
    <div className="thq-section-max-width">
      <div className="cta-accent-bg">
        <div className="cta-inner-bg">
          <div className="cta-container">
            <div className="cta-content">
              <span className="thq-heading-2">{props.Label}</span>
              {/* CTA doesn't have content field in Strapi, using Label */}
            </div>
            {props.url && (
              <div className="cta-actions">
                <a
                  href={props.url}
                  className="thq-button-filled cta-button"
                  target={props.OpenInNewTab ? '_blank' : undefined}
                  rel={props.OpenInNewTab ? 'noopener noreferrer' : undefined}
                >
                  {props.Label}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
