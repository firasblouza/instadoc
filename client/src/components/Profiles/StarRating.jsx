import React, { useState } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

const StarRating = ({ star, setStar }) => {
  const handleMouseEnter = (starValue) => {
    setStar(starValue);
  };

  const handleMouseLeave = () => {
    // Remove this function to retain the selected rating on mouse leave
  };

  const handleClick = (starValue) => {
    setStar(starValue);
  };

  return (
    <div className="flex flex-row justify-center items-center gap-1">
      {[1, 2, 3, 4, 5].map((starValue) => (
        <div
          key={starValue}
          onMouseEnter={() => handleMouseEnter(starValue)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(starValue)} // Handle click to set the rating
        >
          {starValue <= star ? (
            <FaStar
              className="text-yellow-500"
              onClick={() => handleClick(starValue)}
            />
          ) : starValue - 0.5 <= star ? (
            <FaStarHalfAlt
              className="text-yellow-500"
              onClick={() => handleClick(starValue)}
            />
          ) : (
            <FaRegStar
              className="text-yellow-500"
              onClick={() => handleClick(starValue)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default StarRating;
