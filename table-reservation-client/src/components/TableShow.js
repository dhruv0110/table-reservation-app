import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar/Sidebar';
import './TableShow.css'; // Import the CSS file

function TableShow(props) {
  const [tables, setTables] = useState([]);
  const [tableNumber, setTableNumber] = useState('');

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tables');
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const addTable = async () => {
    try {
      await axios.post('http://localhost:5000/api/tables/add', { number: tableNumber });
      props.showAlert('Table added', 'success');
      fetchTables(); // Refresh the table list to reflect changes
      setTableNumber(''); // Clear input field
    } catch (error) {
      console.error('Error adding table:', error);
      props.showAlert('Error adding table', 'error');
    }
  };

  const deleteTable = async (number) => {
    try {
      await axios.delete('http://localhost:5000/api/tables/delete', { data: { number } });
      props.showAlert('Table deleted', 'success');
      fetchTables(); // Refresh the table list to reflect changes
    } catch (error) {
      console.error('Error deleting table:', error);
      props.showAlert('Error deleting table', 'error');
    }
  };

  const unreserveTable = async (number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      await axios.post('http://localhost:5000/api/tables/admin/unreserve', 
        { number }, 
        {
          headers: {
            'auth-token': token,
          },
        }
      );
      props.showAlert('Table unreserved', 'success');
      fetchTables(); // Refresh the table list to reflect changes
    } catch (error) {
      console.error('Error unreserving table:', error);
    }
  };

  // Sort tables by number in ascending order
  const sortedTables = [...tables].sort((a, b) => a.number - b.number);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className='container my-5'>
        <h2>Tables Reservation</h2>
        <div className='table-input-container'>
          <input 
            type="number" 
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="Table Number"
          />
          <button onClick={addTable}>Add Table</button>
        </div>
        <div className='table-list'>
          {sortedTables.map(table => (
            <div key={table.number} className='table-item'>
              <button
                onClick={() => table.reserved && unreserveTable(table.number)}
                className={table.reserved ? 'unreserve-button' : 'reserve-button'}
              >
                Table {table.number}
              </button>
              {table.reserved && (
                <div className='reserved-info'>
                  Reserved by: {table.reservedBy?.name || 'Unknown'} ({table.reservedBy?.contact || 'Unknown'})
                </div>
              )}
              <button
                onClick={() => deleteTable(table.number)}
                className='delete-button'
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TableShow;
