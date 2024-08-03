// List.js
import React, { useState, useEffect } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from './Sidebar/Sidebar';
import CrossIcon from './CrossIcon'; // Import the CrossIcon component

const List = () => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get("http://localhost:5000/api/food/list");
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  const removeFood = async (foodId) => {
    const response = await axios.post("http://localhost:5000/api/food/admin/remove", { id: foodId });
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className='list my-5' style={{ width: "100%", marginLeft: "10px" }}>
        <p className="header">All Foods List</p>
        <div className="list-table">
          <div className="list-table-format title">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Action</b>
          </div>
          {list.map((item, index) => (
            <div key={index} className='list-table-format'>
              <img src={`http://localhost:5000/uploads/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <CrossIcon onClick={() => removeFood(item._id)} /> {/* Use CrossIcon here */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default List;
