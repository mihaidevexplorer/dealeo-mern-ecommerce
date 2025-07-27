//src/components/RatingTemp.tsx
import React from 'react';
import { FaStar } from 'react-icons/fa';
import { CiStar } from 'react-icons/ci';

interface RatingTempProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  color?: string;
}

const RatingTemp: React.FC<RatingTempProps> = ({ 
  rating, 
  maxRating = 5,
  size = 'md',
  showValue = false,
  color = '#Edbb0E'
}) => {
  // Clamp rating to valid range
  const clampedRating = Math.max(0, Math.min(Math.floor(rating), maxRating));
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base', 
    lg: 'text-lg'
  };

  const renderStars = (): JSX.Element[] => {
    const stars: JSX.Element[] = [];
    
    for (let i = 1; i <= maxRating; i++) {
      const isFilled = i <= clampedRating;
      const StarIcon = isFilled ? FaStar : CiStar;
      
      stars.push(
        <span 
          key={i}
          className="inline-block"
          style={{ color }}
          aria-hidden="true"
        >
          <StarIcon />
        </span>
      );
    }
    
    return stars;
  };

  return (
    <div 
      className={`flex items-center gap-1 ${sizeClasses[size]}`}
      role="img"
      aria-label={`Rating: ${clampedRating} out of ${maxRating} stars`}
    >
      <div className="flex items-center">
        {renderStars()}
      </div>
      
      {showValue && (
        <span className="text-gray-600 text-sm ml-1 font-medium">
          ({clampedRating})
        </span>
      )}
    </div>
  );
};

export default RatingTemp;