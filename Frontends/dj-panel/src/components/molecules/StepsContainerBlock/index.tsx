// @ts-ignore - React is needed for JSX
import React, { useRef, useEffect } from 'react';
import './index.css';
import type { StepsContainer, Cta } from '../../../models/api/strapi/apiMap';

interface Step {
  id?: number;
  title?: string;
  description?: string;
  icon?: string;
}

const CARD_STICKY_TOP_BASE_PX = 80;
const CARD_STICKY_TOP_INCREMENT_PX = 20;
const CARD_SCALE_MAX_REDUCTION = 0.05;

export const StepsContainerBlock = (props: StepsContainer) => {
  // Extract action - now it's a direct relation to CTA (oneToOne)
  const actionItem = props.action as unknown as Cta | null | undefined;

  // steps is now a repeatable component array
  const stepsArray = Array.isArray(props.steps)
    ? (props.steps as unknown as Step[])
    : [];

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const updateCards = () => {
      cardRefs.current.forEach((card, i) => {
        if (!card || i >= cardRefs.current.length - 1) return;
        const nextCard = cardRefs.current[i + 1];
        if (!nextCard) return;

        const rect = card.getBoundingClientRect();
        const nextRect = nextCard.getBoundingClientRect();
        const nextStickyTop =
          CARD_STICKY_TOP_BASE_PX + (i + 1) * CARD_STICKY_TOP_INCREMENT_PX;

        // How far the next card is from its sticky position.
        // 0 means the next card is stuck; positive means it's still scrolling toward its sticky position.
        const distanceFromNextSticky = nextRect.top - nextStickyTop;

        // Animate card i as the next card approaches its sticky position within one card height.
        const progress = Math.min(
          Math.max(0, 1 - distanceFromNextSticky / rect.height),
          1,
        );

        if (progress > 0) {
          const scale = 1 - progress * CARD_SCALE_MAX_REDUCTION;
          card.style.transform = `scale(${scale})`;
        } else {
          card.style.transform = '';
        }
      });
      rafRef.current = null;
    };

    const handleScroll = () => {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(updateCards);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateCards();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [stepsArray.length]);

  return (
    <div className="steps-container thq-section-padding">
      <div className="steps-max-width thq-section-max-width">
        <div className="steps-grid thq-grid-2">
          <div className="steps-section-header">
            <h2 className="thq-heading-2">{props.heading}</h2>
            <p className="thq-body-large">{props.content}</p>
            {actionItem?.url && (
              <div className="steps-actions">
                <a
                  href={actionItem.url}
                  className="thq-button-animated thq-button-filled steps-button"
                  target={actionItem.OpenInNewTab ? '_blank' : undefined}
                  rel={
                    actionItem.OpenInNewTab ? 'noopener noreferrer' : undefined
                  }
                >
                  <span className="thq-body-small">{actionItem.Label}</span>
                </a>
              </div>
            )}
          </div>
          <div className="steps-card-container">
            {stepsArray.map((step: Step, index: number) => (
              <div
                key={step.id ?? index}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="steps-card thq-card"
                style={{
                  top: `${CARD_STICKY_TOP_BASE_PX + index * CARD_STICKY_TOP_INCREMENT_PX}px`,
                  zIndex: index + 1,
                }}
              >
                <h2 className="thq-heading-2">{step.title}</h2>
                <span className="steps-card-text thq-body-small">
                  {step.description}
                </span>
                <label className="steps-card-label thq-heading-3">
                  {index + 1}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
