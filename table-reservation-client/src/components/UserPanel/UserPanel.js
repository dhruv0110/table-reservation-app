// src/components/UserPanel/UserPanel.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import "./UserPanel.css";

function UserPanel({ showAlert }) {
  let navigate = useNavigate();
  const [foodList, setFoodList] = useState([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchFoodList();
    } else {
      navigate("/login");
    }
  }, []);

  const fetchFoodList = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/food/list");
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
      showAlert("Error fetching food list", "danger");
    }
  };

  return (
    <div className="container my-4">
      <h1>Welcome to Table Reservation System</h1>

      <h2>Food List</h2>
      <FoodDisplay category={category} food_list={foodList} />
    </div>
  );
}

export default UserPanel;
