import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPanel(props) {
  const [tables, setTables] = useState([]);

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

  return (
    <div className='container my-4'>
      <h2>Admin Panel</h2>
      <div style={{ marginTop: '20px' }}>
        {tables.map(table => (
          <div key={table.number} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <button
              onClick={() => table.reserved && unreserveTable(table.number)}
              style={{
                backgroundColor: table.reserved ? '#f8d7da' : '#d4edda', // Red for reserved, green for available
                color: table.reserved ? '#721c24' : '#155724', // Dark red for reserved, dark green for available
                border: 'none',
                padding: '10px 20px',
                cursor: 'pointer',
                borderRadius: '4px',
                fontSize: '16px',
                minWidth: '80px',
                textAlign: 'center',
              }}
            >
              Table {table.number}
            </button>
            {table.reserved && (
              <div style={{ marginLeft: '20px', fontSize: '14px', color: '#6c757d' }}>
                Reserved by: {table.reservedBy?.name || 'Unknown'} ({table.reservedBy?.email || 'Unknown'})
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;
