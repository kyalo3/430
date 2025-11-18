import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Landing from './pages/Landing';
import ShoppingPage from './pages/ShoppingPage';
import CollectionsPage from './pages/CollectionsPage';
import ProductPage from './pages/ProductPage';
import DonorDashboard from './pages/DonorDashboard';
import RecipientDashboard from './pages/RecipientDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [popupType, setPopupType] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = (type) => {
    if (type === '' && isOpen){
      setPopupType(type);
      setIsOpen(!isOpen);
    } else if (type !== '' && isOpen) {
      setPopupType(type);
    } else {
      setPopupType(type);
      setIsOpen(!isOpen);
    }
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Landing 
                      isOpen={isOpen}
                      popupType={popupType}
                      setPopupType = {setPopupType}
                      togglePopup={togglePopup}
                  />} />
        <Route path="/shop" element={<ShoppingPage/>} />
        <Route path="/shop/collection/:category"  element={<CollectionsPage/>} />
        <Route path="/shop/collection/:category/:product/:productid"  element={<ProductPage/>} />
        <Route path="/dashboard/donor" element={<DonorDashboard/>} />
        <Route path="/dashboard/recipient" element={<RecipientDashboard/>} />
        <Route path="/dashboard/volunteer" element={<VolunteerDashboard/>} />
        <Route path="/dashboard/admin" element={<AdminDashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;