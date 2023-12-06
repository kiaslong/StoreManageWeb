import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import RightSection from '../components/RightSection';
import DashBoard from '../components/DashBoard';
import Products from '../components/Products';
import Analytics from '../components/Analytics';
import CustomerManagement from '../components/CustomerManagement';
import StaffManagement from '../components/StaffManagement';
import '../scss/HomePage.scss';

const Home = () => {
  const [componentToLoad, setComponentToLoad] = useState(null);
  const [componentContext,setComponentContext] = useState(null);

  const handleSelectedComponent = (component) => {
    switch (component) {
      case 'Dashboard':
        setComponentToLoad(<DashBoard />);
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
      default:
        setComponentToLoad(null);
        break;
    }
  };

  return (
    <div className="container">
      <Sidebar handleSelectedComponent={handleSelectedComponent} />
      <MainContent selectedComponent={componentToLoad} />
      <RightSection selecedContext={componentContext} />
    </div>
  );
};

export default Home;
