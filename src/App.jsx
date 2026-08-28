import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { lazy, Suspense, useState } from 'react';
import Landing from './pages/Landing';
import RoleRoute from './components/RoleRoute';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';
import RouteMeta from './components/RouteMeta';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ShoppingPage = lazy(() => import('./pages/ShoppingPage'));
const FaqsPage = lazy(() => import('./pages/FaqsPage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const DonorDashboard = lazy(() => import('./pages/DonorDashboard'));
const RecipientDashboard = lazy(() => import('./pages/RecipientDashboard'));
const VolunteerDashboard = lazy(() => import('./pages/VolunteerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Reports = lazy(() => import('./pages/Reports'));
const AccountPrivacy = lazy(() => import('./pages/AccountPrivacy'));
const GuidancePage = lazy(() => import('./pages/GuidancePage'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));

function App() {
  const [popupType, setPopupType] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = (type) => {
    if (type === '' && isOpen) {
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
    <ErrorBoundary>
      <Router>
        <RouteMeta />
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
          <Routes>
            <Route
              path="/"
              element={
                <Landing
                  isOpen={isOpen}
                  popupType={popupType}
                  setPopupType={setPopupType}
                  togglePopup={togglePopup}
                />
              }
            />
            <Route path="/shop" element={<ShoppingPage />} />
            <Route path="/faqs" element={<FaqsPage />} />
            <Route path="/guidance" element={<GuidancePage />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route
              path="/account/privacy"
              element={
                <PrivateRoute>
                  <AccountPrivacy />
                </PrivateRoute>
              }
            />
            <Route path="/shop/collection/:category" element={<CollectionsPage />} />
            <Route path="/shop/collection/:category/:product/:productid" element={<ProductPage />} />
            <Route
              path="/dashboard/donor"
              element={
                <RoleRoute roles={['donor']}>
                  <DonorDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/dashboard/recipient"
              element={
                <RoleRoute roles={['recipient']}>
                  <RecipientDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/dashboard/volunteer"
              element={
                <RoleRoute roles={['volunteer']}>
                  <VolunteerDashboard />
                </RoleRoute>
              }
            />
            <Route path="/volunteer" element={<Navigate to="/dashboard/volunteer" replace />} />
            <Route
              path="/dashboard/admin"
              element={
                <RoleRoute roles={['admin']}>
                  <AdminDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/dashboard/reports"
              element={
                <RoleRoute roles={['admin']}>
                  <Reports />
                </RoleRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
