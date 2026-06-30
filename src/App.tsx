import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useFuzzyEffects } from './hooks/useFuzzyEffects';

import Cart from './Pages/Cart';
import Categories from './Pages/Categories';
import Checkout from './Pages/Checkout';
import Coupon from './Pages/Coupon';
import CreateAccount from './Pages/CreateAccount';
import EmptyCart from './Pages/EmptyCart';
import EmptyNotification from './Pages/EmptyNotification';
import EmptyOrderHistory from './Pages/EmptyOrderHistory';
import EmptySearch from './Pages/EmptySearch';
import EmptyWishlist from './Pages/EmptyWishlist';
import ForgotPassword from './Pages/ForgotPassword';
import Help from './Pages/Help';
import Home from './Pages/Home';
import Index from './Pages/Index';
import Index2 from './Pages/Index2';
import Landing from './Pages/Landing';
import Language from './Pages/Language';
import Login from './Pages/Login';
import ManageAddress from './Pages/ManageAddress';
import ManageDeliveryAddress from './Pages/ManageDeliveryAddress';
import ManagePayment from './Pages/ManagePayment';
import Ne from './Pages/Ne';
import NewAddress from './Pages/NewAddress';
import NewCard from './Pages/NewCard';
import Notification from './Pages/Notification';
import OrderDetails from './Pages/OrderDetails';
import OrderHistory from './Pages/OrderHistory';
import OrderTracking from './Pages/OrderTracking';
import OtherSetting from './Pages/OtherSetting';
import Otp from './Pages/Otp';
import PageListing from './Pages/PageListing';
import Payment from './Pages/Payment';
import Product2Details from './Pages/Product2Details';
import ProductDetails from './Pages/ProductDetails';
import Profile from './Pages/Profile';
import ProfileSetting from './Pages/ProfileSetting';
import ResetPassword from './Pages/ResetPassword';
import Search from './Pages/Search';
import Setting from './Pages/Setting';
import Shipping from './Pages/Shipping';
import ShippingAddress from './Pages/ShippingAddress';
import Shop from './Pages/Shop';
import TermsConditions from './Pages/TermsConditions';
import Voucher from './Pages/Voucher';
import Wishlist from './Pages/Wishlist';
import Admin from './Pages/Admin';

function AppContent() {
  useFuzzyEffects();

  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showInstallPopup, setShowInstallPopup] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const dismissed = localStorage.getItem('fuzzy_install_dismissed');
      if (!dismissed) {
        setShowInstallPopup(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install: ${outcome}`);
      setDeferredPrompt(null);
      setShowInstallPopup(false);
    }
  };

  const handleDismissInstall = () => {
    setShowInstallPopup(false);
    localStorage.setItem('fuzzy_install_dismissed', 'true');
  };

  return (
    <>
      {/* Global CSS Overrides to bypass browser style asset caching and align fixed elements with the 600px mobile root wrapper */}
      <style>{`
        .navbar-menu, 
        .pay-popup, 
        .footer-modal, 
        .offcanvas-bottom, 
        .fixed-cart-btn,
        .addtohome-popup {
          position: fixed !important;
          max-width: 600px !important;
          width: 100% !important;
          left: 50% !important;
          right: auto !important;
          margin: 0 !important;
          transform: translateX(-50%) !important;
          box-sizing: border-box !important;
        }
      `}</style>
      {/* Offline Warning Banner */}
      {isOffline && (
        <div style={{
          position: 'fixed',
          top: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          backgroundColor: '#dc3545',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '25px',
          fontSize: '12px',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          whiteSpace: 'nowrap'
        }}>
          <span className="spinner-grow spinner-grow-sm text-light" role="status" style={{ width: '8px', height: '8px' }}></span>
          Không có kết nối mạng. Đang chạy ngoại tuyến (Offline).
        </div>
      )}

      {/* PWA Add to Home Screen popup */}
      {showInstallPopup && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '400px',
          backgroundColor: '#183044',
          border: '1px solid #ffc107',
          borderRadius: '16px',
          padding: '15px',
          zIndex: 9998,
          boxShadow: '0 8px 25px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div className="d-flex align-items-center gap-3">
            <img src="assets/images/logo/logo.png" alt="logo" style={{ width: '42px', height: '42px', borderRadius: '8px' }} />
            <div>
              <h4 style={{ color: '#fff', fontSize: '13px', margin: 0, fontWeight: 'bold' }}>Cài đặt Fuzzy App</h4>
              <p style={{ color: '#9ba3aa', fontSize: '11px', margin: 0 }}>Thêm Fuzzy vào màn hình chính để mở nhanh và hỗ trợ Offline tốt hơn!</p>
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button 
              onClick={handleDismissInstall}
              className="btn btn-sm btn-outline-light text-white" 
              style={{ fontSize: '11px', borderRadius: '8px', padding: '4px 10px' }}
            >
              Bỏ qua
            </button>
            <button 
              onClick={handleInstallClick}
              className="btn btn-sm btn-warning text-dark fw-bold" 
              style={{ fontSize: '11px', borderRadius: '8px', padding: '4px 12px' }}
            >
              Cài đặt / Install
            </button>
          </div>
        </div>
      )}
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/coupon" element={<Coupon />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/empty-cart" element={<EmptyCart />} />
      <Route path="/empty-notification" element={<EmptyNotification />} />
      <Route path="/empty-order-history" element={<EmptyOrderHistory />} />
      <Route path="/empty-search" element={<EmptySearch />} />
      <Route path="/empty-wishlist" element={<EmptyWishlist />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/help" element={<Help />} />
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<Index />} />
      <Route path="/index" element={<Index />} />
      <Route path="/index2" element={<Index2 />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/language" element={<Language />} />
      <Route path="/login" element={<Login />} />
      <Route path="/manage-address" element={<ManageAddress />} />
      <Route path="/manage-delivery-address" element={<ManageDeliveryAddress />} />
      <Route path="/manage-payment" element={<ManagePayment />} />
      <Route path="/ne" element={<Ne />} />
      <Route path="/new-address" element={<NewAddress />} />
      <Route path="/new-card" element={<NewCard />} />
      <Route path="/notification" element={<Notification />} />
      <Route path="/order-details" element={<OrderDetails />} />
      <Route path="/order-history" element={<OrderHistory />} />
      <Route path="/order-tracking" element={<OrderTracking />} />
      <Route path="/other-setting" element={<OtherSetting />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/page-listing" element={<PageListing />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/product2-details" element={<Product2Details />} />
      <Route path="/product-details" element={<ProductDetails />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile-setting" element={<ProfileSetting />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/search" element={<Search />} />
      <Route path="/setting" element={<Setting />} />
      <Route path="/shipping" element={<Shipping />} />
      <Route path="/shipping-address" element={<ShippingAddress />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/terms-conditions" element={<TermsConditions />} />
      <Route path="/voucher" element={<Voucher />} />
      <Route path="/wishlist" element={<Wishlist />} />

      {/* Catch-all route redirecting to Index */}
      <Route path="*" element={<Index />} />
    </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
