import React from 'react';
import { format } from 'date-fns';
import { assets } from '../../assets/assets'
import './FoodItem.css';

const FoodItem = ({ name, description, price, image,date}) => {
  // Example function to format date using date-fns
const formatDate = (date) => {
  return format(new Date(date), 'dd-MM-yyyy'); // Format as needed
};
  return (
    <div className='food-item'>
    <div className="food-item-img-container">
    <img className='food-item-image' src={`http://localhost:5000/uploads/${image}`} alt={name} />
    </div>
    <div className="food-item-info">
      <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
      </div>
      <p className="food-item-desc">{description}</p>
      <p className="food-item-price">${price}</p>
    </div>
    </div>
  );
}

export default FoodItem;
