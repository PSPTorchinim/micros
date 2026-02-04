// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @ts-ignore - React is needed for JSX
import React from 'react';
import { Helmet } from 'react-helmet';
import './index.css';

export const NotFoundComponent = () => {
  return (
    <div className="not-found-container">
      <Helmet>
        <title>404 - Page Not Found</title>
      </Helmet>
      <div className="not-found-content">
        <h3 className="not-found-subtitle">OOPS! PAGE NOT FOUND</h3>
        <div className="not-found-code">
          <h1 className="not-found-number">404</h1>
        </div>
        <div className="not-found-message">
          <h2 className="not-found-text">
            WE ARE SORRY, BUT THE PAGE YOU REQUESTED WAS NOT FOUND
          </h2>
        </div>
        <a href="#/" className="not-found-link">
          Go Back Home
        </a>
      </div>
    </div>
  );
};
