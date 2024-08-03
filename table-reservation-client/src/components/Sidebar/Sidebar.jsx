import React from 'react'
import "./Sidebar.css"
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Sidebar = ({showAlert}) => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/admin/add' className="sidebar-option">
        <img src={assets.add_icon} alt="" />
            <p>Add Items</p>
        </NavLink>

        <NavLink to='/list' className="sidebar-option">
        <img src={assets.order_icon} alt="" />
            <p>List Items</p>
        </NavLink>

        <NavLink to='/admin/table' className="sidebar-option">
        <img src={assets.table_resrvation} alt="" />
            <p>Tables</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
