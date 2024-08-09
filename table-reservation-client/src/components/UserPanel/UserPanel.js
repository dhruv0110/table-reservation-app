import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserPanel.css";
import FoodDisplay from "../FoodDisplay/FoodDisplay";
import CulinaryFavorites from "../secondHero/CulinaryFavorites";
import ChoiceOfCustomers from "../ChoiceOfCustomers/ChoiceOfCustomers";

// Import all images you want to use for rotation
import sectionOneRightTopOne from '../../assets/sectionOneRightTopOne.jpg';
import sectionOneRightTopTwo from '../../assets/sectionOneRightTopTwo.jpg'; // New image
import sectionOneRightBottomOne from '../../assets/sectionOneRightBottomOne.jpg';
import sectionOneRightBottomTwo from '../../assets/sectionOneRightBottomTwo.jpg'; // New image

function UserPanel({ showAlert }) {
  const [foodList, setFoodList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  // State for rotating images
  const [topImageIndex, setTopImageIndex] = useState(0);
  const [bottomImageIndex, setBottomImageIndex] = useState(0);
  const [fade, setFade] = useState(true); // State to handle fade effect

  // Array of images for rotation
  const topImages = [sectionOneRightTopOne, sectionOneRightTopTwo];
  const bottomImages = [sectionOneRightBottomOne, sectionOneRightBottomTwo];

  useEffect(() => {
    fetchFoodList();

    // Interval for rotating top image
    const topImageInterval = setInterval(() => {
      setFade(false); // Start fade-out
      setTimeout(() => {
        setTopImageIndex((prevIndex) => (prevIndex + 1) % topImages.length);
        setFade(true); // Start fade-in
      }, 500); // Duration of fade-out
    }, 3000); // Change every 3 seconds

    // Interval for rotating bottom image
    const bottomImageInterval = setInterval(() => {
      setFade(false); // Start fade-out
      setTimeout(() => {
        setBottomImageIndex((prevIndex) => (prevIndex + 1) % bottomImages.length);
        setFade(true); // Start fade-in
      }, 500); // Duration of fade-out
    }, 3000); // Change every 3 seconds

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(topImageInterval);
      clearInterval(bottomImageInterval);
    };
  }, []);

  const fetchFoodList = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/food/list");
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
      showAlert("Error fetching food list", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="hero-section">
        <div className="container hero-content">
          <div className="hero-text">
            <p className="subheading">Best Taste</p>
            <h1>Healthy & Tasty Food</h1>
            <p className="description">
              Delight in the world of delectable, healthful cuisine that thrills
              your taste buds while feeding your body - welcome to the universe of
              Nutritious & Tasty food!
            </p>
            <button className="hero-button">Get Menu</button>
          </div>
          <div className="hero-images">
            <img
              src={topImages[topImageIndex]}
              alt="Top Image"
              className={`hero-image1 ${fade ? "fade-in" : "fade-out"}`}
            />
            <img
              src={bottomImages[bottomImageIndex]}
              alt="Bottom Image"
              className={`hero-image2 ${fade ? "fade-in" : "fade-out"}`}
            />
          </div>
        </div>
      </div>

      <div className="container">
        <CulinaryFavorites />
      </div>
      <div>
        <ChoiceOfCustomers />
      </div>
    </>
  );
}

export default UserPanel;
