import React,{useContext} from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard';
import StarRateIcon from '@mui/icons-material/StarRate';
import InsightsIcon from '@mui/icons-material/Insights';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../assets/logo.png';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ handleSelectedComponent }) => {
  const { currentUser } = useContext(AuthContext);
  function handleLogout(){
    localStorage.removeItem('token') 
    window.location.reload();
   }

  return (
    <aside>
      <div className="toggle">
        <div className="logo">
          <img src={logo} alt="" srcSet="" />
          <h1>MVL <span>STORE</span></h1>
        </div>
      </div>
      <div className="sidebar">
        <a  onClick={() => handleSelectedComponent('Dashboard')}>
          <DashboardIcon />
          <h3>Dashboard</h3>
        </a>
        <a  onClick={() => handleSelectedComponent('Checkout')}>
          <ShoppingCartIcon/>
          <h3>Checkout</h3>
        </a>
        <a  onClick={() => handleSelectedComponent('Products')}>
          <StarRateIcon />
          <h3>Products</h3>
        </a>
        <a onClick={() => handleSelectedComponent('Analytics')}>
          <InsightsIcon />
          <h3>Analytics</h3>
        </a>
        <a onClick={() => handleSelectedComponent('CustomerManagement')}>
          <PersonOutlineIcon />
          <h3>Customers Management</h3>
        </a>
        {currentUser.user.username === 'admin' && (
          <a onClick={() => handleSelectedComponent('StaffManagement')}>
            <PersonOutlineIcon />
            <h3>Staff Management</h3>
          </a>
        )}
        <a onClick={()=> handleLogout()}>
          <LogoutIcon />
          <h3>Logout</h3>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
