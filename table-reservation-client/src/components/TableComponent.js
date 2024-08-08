// src/components/TableComponent/TableComponent.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomSpinner from '../components/CustomSpinner/CustomSpinner';
// import './TableComponent.css';

const TableComponent = ({ showAlert }) => {
  const [tables, setTables] = useState([]);
  const [userId, setUserId] = useState("");
  const [loadingTable, setLoadingTable] = useState(null);

  useEffect(() => {
    fetchUserDetails();
    fetchTables();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.post(
        "http://localhost:5000/api/users/getuser",
        {},
        {
          headers: { "auth-token": token },
        }
      );
      setUserId(response.data._id);
    } catch (error) {
      console.error("Error fetching user details:", error);
      showAlert("Error fetching user details", "danger");
    }
  };

  const fetchTables = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tables");
      setTables(response.data);
    } catch (error) {
      console.error("Error fetching tables:", error);
      showAlert("Error fetching tables", "danger");
    }
  };

  const toggleReservation = async (number, isReserved, reservedBy) => {
    try {
      setLoadingTable(number);
      const token = localStorage.getItem("token");
      if (!token) return;

      if (isReserved && reservedBy === userId) {
        await axios.post(
          "http://localhost:5000/api/tables/unreserve",
          { number },
          {
            headers: { "auth-token": token },
          }
        );
        showAlert("Table unreserved", "success");
      } else if (!isReserved) {
        await axios.post(
          "http://localhost:5000/api/tables/reserve",
          { number },
          {
            headers: { "auth-token": token },
          }
        );
        showAlert("Table reserved", "success");
      } else {
        showAlert(
          "You do not have permission to unreserve this table",
          "danger"
        );
        setLoadingTable(null);
        return;
      }
      fetchTables();
    } catch (error) {
      console.error("Error toggling reservation:", error);
      showAlert("Error toggling reservation", "danger");
    } finally {
      setLoadingTable(null);
    }
  };

  const sortedTables = [...tables].sort((a, b) => a.number - b.number);

  return (
    <div className="table-container">
      <div className="table-button-container">
        {sortedTables.map((table) => (
          <div key={table.number} className="table-button">
            <button
              onClick={() =>
                toggleReservation(table.number, table.reserved, table.reservedBy?._id)
              }
              className={`table-button-button ${table.reserved ? 'reserved' : ''} ${loadingTable === table.number ? 'loading' : ''}`}
              disabled={loadingTable === table.number || (table.reserved && table.reservedBy?._id !== userId)}
            >
              {loadingTable === table.number ? (
                <div className="spinner-container">
                  <CustomSpinner />
                </div>
              ) : (
                `Table ${table.number}`
              )}
            </button>
            {table.reserved && <div className="table-button-reserved">Reserved</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableComponent;
