import React from 'react';

interface StoryCardsData {
  id: number;
  Title: string;
  Description: Array<{
    type: string;
    children: Array<{
      text: string;
      type: string;
    }>;
  }>;
}

export const StoryCardsComponent: React.FC<{ data: StoryCardsData }> = ({
  data,
}) => {
  const renderDescription = (description: StoryCardsData['Description']) => {
    if (!description) return null;
    return description.map((block, index) => {
      if (block.type === 'paragraph') {
        return (
          <p key={index}>
            {block.children.map((child, childIndex) => (
              <span key={childIndex}>{child.text}</span>
            ))}
          </p>
        );
      }
      return null;
    });
  };

  return (
    <div className="story-cards-component">
      <h2>{data.Title}</h2>
      <div className="story-cards-description">
        {renderDescription(data.Description)}
      </div>
    </div>
  );
};
