import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserPanel.css";
import sectionOneRightTopOne from '../../assets/sectionOneRightTopOne.jpg';
import sectionOneRightBottomOne from '../../assets/sectionOneRightBottomOne.jpg';
import FoodDisplay from "../FoodDisplay/FoodDisplay";
import CulinaryFavorites from "../secondHero/CulinaryFavorites";
import ChoiceOfCustomers from "../ChoiceOfCustomers/ChoiceOfCustomers";

function UserPanel({ showAlert }) {
  const [foodList, setFoodList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchFoodList();
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
          src={sectionOneRightTopOne} // Replace with the actual image URL
          alt="Burger"
          className="hero-image1"
        />
        <img
          src={sectionOneRightBottomOne} // Replace with the actual image URL
          alt="Food"
          className="hero-image2"
        />
      </div>
    </div>
    </div>
    
      <div className="container">
      <CulinaryFavorites/>
      </div>
      <div>
      <ChoiceOfCustomers/>
      </div>
    </>
  );
}

export default UserPanel;



































// src/components/UserPanel/UserPanel.js

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
// import "./UserPanel.css";

// function UserPanel({ showAlert }) {
//   let navigate = useNavigate();
//   const [foodList, setFoodList] = useState([]);
//   const [category, setCategory] = useState("All");

//   useEffect(() => {
//     if (localStorage.getItem("token")) {
//       fetchFoodList();
//     } else {
//       navigate("/login");
//     }
//   }, []);

//   const fetchFoodList = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/food/list");
//       setFoodList(response.data.data);
//     } catch (error) {
//       console.error("Error fetching food list:", error);
//       showAlert("Error fetching food list", "danger");
//     }
//   };

//   return (
//     <div className="container my-4">
//       <h1>Welcome to Table Reservation System</h1>

//       <h2>Food List</h2>
//       <FoodDisplay category={category} food_list={foodList} />
//     </div>
//   );
// }

// export default UserPanel;