import React from 'react';
import { Skeleton } from './Skeleton';
import './ContentSkeleton.css';

export interface ContentSkeletonProps {
  type?: 'page' | 'block' | 'text' | 'card';
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
    <div className="content-skeleton-container" role="status" aria-label="Loading content">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};
