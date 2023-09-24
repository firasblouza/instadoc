import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const AvgRating = ({ rating }) => {
  const starIcons = [];
  const maxStars = 5;

  const fullStars = Math.floor(rating);

  const hasHalfStar = rating - fullStars >= 0.5;

  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    starIcons.push(<FaStar key={i} className="text-yellow-500 text-xs" />);
  }

  if (hasHalfStar) {
    starIcons.push(
      <FaStarHalfAlt key="half" className="text-yellow-500 text-xs" />
    );
  }

  for (let i = 0; i < emptyStars; i++) {
    starIcons.push(
      <FaRegStar
        key={i + fullStars + (hasHalfStar ? 1 : 0)}
        className="text-yellow-500 text-xs"
      />
    );
  }

  return (
    <div className="flex items-center gap-1">
      {starIcons.map((star, index) => (
        <span key={index}>{star}</span>
      ))}
    </div>
  );
};

export default AvgRating;
