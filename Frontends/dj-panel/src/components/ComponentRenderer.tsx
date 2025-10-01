import React from 'react';
import { StoryCardsComponent } from './Components/StoryCardsComponent';
import { ArticlesComponent } from './Components/ArticlesComponent';

export const ComponentRenderer: React.FC<{ component: any }> = ({
  component,
}) => {
  switch (component.__component) {
    case 'story-cards.story-cards':
      return <StoryCardsComponent data={component} />;

    case 'articles.articles':
      return <ArticlesComponent data={component} />;

    default:
      return (
        <div className="unknown-component">
          <h3>Unknown Component: {component.__component}</h3>
          <pre>{JSON.stringify(component, null, 2)}</pre>
        </div>
      );
  }
};
