import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Nav, Tab, Row, Col } from "react-bootstrap";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay"
import './UserPanel.css';
import CustomSpinner from "../CustomSpinner/CustomSpinner";

function UserPanel({ showAlert }) {
  let navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [userId, setUserId] = useState("");
  const [foodList, setFoodList] = useState([]);
  const [category, setCategory] = useState("All");
  const [loadingTable, setLoadingTable] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchUserDetails();
      fetchTables();
      fetchFoodList();
    } else {
      navigate("/login");
    }
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

  const fetchFoodList = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/food/list");
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
      showAlert("Error fetching food list", "danger");
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
    <div className="container my-4">
      <h1>Welcome to Table Reservation System</h1>
      <Tab.Container defaultActiveKey="tables">
        <Row className="no-gutters">
          <Col xs={12} md={3} className="p-3 my-2">
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="tables">Tables</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="food" className="foodlist">Food List</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col xs={12} md={9} className="p-3">
            <Tab.Content>
              <Tab.Pane eventKey="tables">
                <h2>User Panel</h2>
                <div className="table-button-container">
                  {sortedTables.map((table) => (
                    <div
                      key={table.number}
                      className="table-button"
                    >
                      <button
                        onClick={() =>
                          toggleReservation(
                            table.number,
                            table.reserved,
                            table.reservedBy?._id
                          )
                        }
                        className={`table-button-button ${table.reserved ? 'reserved' : ''} ${loadingTable === table.number ? 'loading' : ''}`}
                        disabled={loadingTable === table.number || (table.reserved && table.reservedBy?._id !== userId)}
                      >
                        {loadingTable === table.number ? (
                          <div className="spinner-container">
                            <CustomSpinner /> {/* Use custom spinner */}
                          </div>
                        ) : (
                          `Table ${table.number}`
                        )}
                      </button>
                      {table.reserved && (
                        <div className="table-button-reserved">
                          Reserved
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="food">
                <h2>Food List</h2>
                <FoodDisplay category={category} food_list={foodList} />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}

export default UserPanel;
