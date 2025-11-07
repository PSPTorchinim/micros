import React from 'react';
import { Skeleton } from './Skeleton';
import './ContentSkeleton.css';

export interface ContentSkeletonProps {
  type?:
    | 'page'
    | 'block'
    | 'text'
    | 'card'
    | 'hero'
    | 'article'
    | 'feature'
    | 'cta'
    | 'slider';
  count?: number;
}

export const ContentSkeleton: React.FC<ContentSkeletonProps> = ({
  type = 'block',
  count = 1,
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'page':
        return (
          <div className="content-skeleton-page">
            <Skeleton variant="rectangular" height={200} width="100%" />
            <div className="content-skeleton-page__content">
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="70%" />
            </div>
          </div>
        );
      case 'hero':
        return (
          <div className="content-skeleton-hero">
            <Skeleton variant="text" height={48} width="70%" />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="80%" />
            <div className="content-skeleton-hero__actions">
              <Skeleton variant="rectangular" height={40} width={120} />
              <Skeleton variant="rectangular" height={40} width={120} />
            </div>
          </div>
        );
      case 'article':
        return (
          <div className="content-skeleton-article">
            <Skeleton variant="text" height={32} width="40%" />
            <div className="content-skeleton-article__list">
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="95%" />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="85%" />
            </div>
          </div>
        );
      case 'feature':
        return (
          <div className="content-skeleton-feature">
            <div className="content-skeleton-feature__image">
              <Skeleton variant="rectangular" height={300} width="100%" />
            </div>
            <div className="content-skeleton-feature__tabs">
              <Skeleton variant="text" height={28} width="80%" />
              <Skeleton variant="text" width="95%" />
              <Skeleton variant="text" width="90%" />
            </div>
          </div>
        );
      case 'cta':
        return (
          <div className="content-skeleton-cta">
            <Skeleton variant="text" height={36} width="50%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="rectangular" height={44} width={150} />
          </div>
        );
      case 'slider':
        return (
          <div className="content-skeleton-slider">
            <Skeleton variant="text" height={32} width="30%" />
            <div className="content-skeleton-slider__images">
              <Skeleton variant="rectangular" height={200} width={200} />
              <Skeleton variant="rectangular" height={200} width={200} />
              <Skeleton variant="rectangular" height={200} width={200} />
            </div>
          </div>
        );
      case 'block':
        return (
          <div className="content-skeleton-block">
            <Skeleton variant="rectangular" height={150} width="100%" />
          </div>
        );
      case 'card':
        return (
          <div className="content-skeleton-card">
            <Skeleton variant="rectangular" height={120} width="100%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </div>
        );
      case 'text':
      default:
        return (
          <div className="content-skeleton-text">
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="80%" />
          </div>
        );
    }
  };

  return (
    <div
      className="content-skeleton-container"
      role="status"
      aria-label="Loading content"
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};
