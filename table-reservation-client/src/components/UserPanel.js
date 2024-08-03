import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserPanel({ showAlert }) {
  let navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchUserDetails();
      fetchTables();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.post('http://localhost:5000/api/users/getuser', {}, {
        headers: { 'auth-token': token },
      });
      setUserId(response.data._id);
    } catch (error) {
      console.error('Error fetching user details:', error);
      showAlert('Error fetching user details', 'danger');
    }
  };

  const fetchTables = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tables');
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
      showAlert('Error fetching tables', 'danger');
    }
  };

  const toggleReservation = async (number, isReserved, reservedBy) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      if (isReserved && reservedBy === userId) {
        await axios.post('http://localhost:5000/api/tables/unreserve', { number }, {
          headers: { 'auth-token': token },
        });
        showAlert('Table unreserved', 'success');
      } else if (!isReserved) {
        await axios.post('http://localhost:5000/api/tables/reserve', { number, userId }, {
          headers: { 'auth-token': token },
        });
        showAlert('Table reserved', 'success');
      } else {
        showAlert('You do not have permission to unreserve this table', 'danger');
        return;
      }
      fetchTables();
    } catch (error) {
      console.error('Error toggling reservation:', error);
      showAlert('Error toggling reservation', 'danger');
    }
  };

  return (
    <div className='container my-4'>
      <h1>Welcome to Table Reservation System</h1>
      <h2>User Panel</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
        {tables.map(table => (
          <div key={table.number} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => toggleReservation(table.number, table.reserved, table.reservedBy?._id)}
              style={{
                backgroundColor: table.reserved ? '#f8d7da' : '#d4edda',
                color: table.reserved ? '#721c24' : '#155724',
                border: 'none',
                padding: '10px 20px',
                cursor: 'pointer',
                borderRadius: '4px',
                fontSize: '16px',
                minWidth: '80px',
                marginRight: '10px',
              }}
              disabled={table.reserved && table.reservedBy?._id !== userId} // Disable button if not the owner
            >
              Table {table.number}
            </button>
            {table.reserved && (
              <div style={{ fontSize: '14px', color: '#6c757d' }}>
                Reserved by: {table.reservedBy?.name || 'Unknown'} ({table.reservedBy?.email || 'Unknown'})
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserPanel;
