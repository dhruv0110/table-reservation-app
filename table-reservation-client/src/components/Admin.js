import React from 'react'
import Sidebar from './Sidebar/Sidebar'

const Admin = ({showAlert}) => {
  return (
    <div>
      <Sidebar showAlert={showAlert}/>
    </div>
  )
}

export default Admin
