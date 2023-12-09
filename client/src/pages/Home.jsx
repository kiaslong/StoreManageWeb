import React, { useState, useContext, useEffect} from 'react';
import '../scss/HomePage.scss';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import RightSection from '../components/RightSection';
import DashBoard from '../components/DashBoard';
import Products from '../components/Products';
import Analytics from '../components/Analytics';
import CustomerManagement from '../components/CustomerManagement';
import StaffManagement from '../components/StaffManagement';
import ChangePassword from '../components/ChangePassword';
import EditProfile from '../components/EditProfile';
import Checkout from '../components/Checkout';
import { EditIndexProvider } from '../context/EditContext';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [componentToLoad, setComponentToLoad] = useState(<DashBoard/>);
  const [componentContext,setComponentContext] = useState(null);
  const { currentUser} = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cleanup messages after 3 seconds
    const cleanupMessages = setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 3000);

    return () => clearTimeout(cleanupMessages);
  }, [successMessage, errorMessage]);



 const  handleLogout = () => {
    localStorage.removeItem('token') 
    window.location.reload();
   }

  const handleSelectedComponent = (component) => {
    switch (component) {
      case 'Dashboard':
        setComponentToLoad(<DashBoard />);
        setComponentContext(component)
        break;
      case 'Checkout':
        setComponentToLoad(<Checkout/>);
        setComponentContext(component)
        break;
      case 'Products':
        setComponentToLoad(<Products />);
        setComponentContext(component)
        break;
      case 'Analytics':
        setComponentToLoad(<Analytics />);
        setComponentContext(component)
        break;
      case 'CustomerManagement':
        setComponentToLoad(<CustomerManagement />);
        setComponentContext(component)
        break;
      case 'StaffManagement':
        setComponentToLoad(<StaffManagement />);
        setComponentContext(component)
        break;
      case 'ChangePassword':
        setComponentToLoad(<ChangePassword />);  
        setComponentContext(component)
        break;
      case 'EditProfile':
        setComponentToLoad(<EditProfile />);
        setComponentContext(component)
        break;
      default:
        break;
    }


  };
 
  
  const handleChangePassword = async (newPassword) => {
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await axios.put(`http://localhost:8080/users/change-password/${currentUser.user._id}`, {
        newPassword: newPassword,
        passwordChange: !currentUser.user.passwordChangeRequired,
      });

      if (response.status === 200) {
        setSuccessMessage('Password changed successfully');

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setErrorMessage('Error changing password. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  
  return (
    <EditIndexProvider>
    <div className="container">
  {currentUser.user.isLock ? (
    <div className="change-password-dialog">
      <h1>Your account is locked</h1>
      <p>Contact an administrator for assistance.</p>
      <button onClick={handleLogout} className="btn">
        Logout
      </button>
    </div>
  ) : (
    <>
      {currentUser.user.passwordChangeRequired ? (
        <div className="change-password-dialog">
          <h1>You Must Change Password To Access</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const newPassword = e.target.elements.newPassword.value;
              handleChangePassword(newPassword);
            }}
          >
            <label htmlFor="newPassword">New Password:</label>
            <input type="password" id="newPassword" name="newPassword" required className="input-box" />
            <button type="submit" disabled={loading}>
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <button onClick={handleLogout} className="btn">
            Logout
          </button>
        </div>
      ) : (
        <>
          <Sidebar handleSelectedComponent={handleSelectedComponent} />
          <MainContent selectedComponent={componentToLoad} />
          <RightSection selectedContext={componentContext} handleSelectedComponent={handleSelectedComponent} />
        </>
      )}
    </>
  )}
</div>
</EditIndexProvider>
  );
  

};

export default Home;
