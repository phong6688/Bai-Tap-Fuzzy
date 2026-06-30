import { useEffect, useState } from 'react';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { logoutUser, type User } from '../services/apiClient';
import { getAssetPath } from '../utils/assetHelper';

export default function Profile() {
  const { currentUser, loading } = useRequireAuth();
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    document.body.className = "";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (currentUser) {
      setProfile(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!loading && profile && typeof (window as any).init_iconsax === 'function') {
      (window as any).init_iconsax();
    }
  }, [loading, profile]);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logoutUser();
    window.location.hash = '/login';
  };

  if (loading || !profile) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff' }}>
        <h3>Loading profile...</h3>
      </div>
    );
  }

  return (
    <>
      <header className="profile-header section-t-space">
        <div className="custom-container">
          <div className="header-panel">
            <h3>Profile</h3>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="profile-pic mt-5">
              <img className="img-fluid img" src={getAssetPath(profile.avatar || "/assets/images/icons/profile1.png")} alt="profile" />
            </div>
            <div className="profile-name d-flex align-items-center justify-content-between mt-3 w-100">
              <h4 className="theme-color">{profile.name}</h4>
              <a href="#/profile-setting" className="d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)', transition: 'background-color 0.2s', textDecoration: 'none' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="section-b-space pt-0">
        <div className="custom-container">
          <ul className="profile-list">
            <li>
              <a href="#/order-history" className="profile-box">
                <div className="profile-img">
                  <i className="iconsax icon" data-icon="box"></i>
                </div>
                <div className="profile-details">
                  <h4>Orders</h4>
                  <h5>Ongoing orders, Recent orders..</h5>
                </div>
              </a>
            </li>
            <li>
              <a href="#/wishlist" className="profile-box">
                <div className="profile-img">
                  <i className="iconsax icon" data-icon="heart"></i>
                </div>
                <div className="profile-details">
                  <h4>Wishlist</h4>
                  <h5>Your save product</h5>
                </div>
              </a>
            </li>
            <li>
              <a href="#/manage-payment" className="profile-box">
                <div className="profile-img">
                  <i className="iconsax icon" data-icon="wallet-open"></i>
                </div>
                <div className="profile-details">
                  <h4>Payment</h4>
                  <h5>Saved card, Wallets</h5>
                </div>
              </a>
            </li>
            <li>
              <a href="#/manage-address" className="profile-box">
                <div className="profile-img">
                  <i className="iconsax icon" data-icon="location"></i>
                </div>
                <div className="profile-details">
                  <h4>Saved Address</h4>
                  <h5>Home, Office</h5>
                </div>
              </a>
            </li>
            <li>
              <a href="#/language" className="profile-box">
                <div className="profile-img">
                  <i className="iconsax icon" data-icon="translate"></i>
                </div>
                <div className="profile-details">
                  <h4>Language</h4>
                  <h5>Select your language here</h5>
                </div>
              </a>
            </li>
            <li>
              <a href="#/notification" className="profile-box">
                <div className="profile-img">
                  <i className="iconsax icon" data-icon="bell-1"></i>
                </div>
                <div className="profile-details">
                  <h4>Notification</h4>
                  <h5>Offers, Order tracking messages</h5>
                </div>
              </a>
            </li>
            <li>
              <a href="#/setting" className="profile-box">
                <div className="profile-img">
                  <i className="iconsax icon" data-icon="setting-1"></i>
                </div>
                <div className="profile-details">
                  <h4>Settings</h4>
                  <h5>app settings, Dark mode</h5>
                </div>
              </a>
            </li>
            <li>
              <a href="#/terms-conditions" className="profile-box">
                <div className="profile-img">
                  <i className="iconsax icon" data-icon="info-circle"></i>
                </div>
                <div className="profile-details">
                  <h4>Terms & Conditions</h4>
                  <h5>T&C for use of platform</h5>
                </div>
              </a>
            </li>
            <li>
              <a href="#/help" className="profile-box">
                <div className="profile-img">
                  <i className="iconsax icon" data-icon="phone"></i>
                </div>
                <div className="profile-details">
                  <h4>Help</h4>
                  <h5>Customer Support, FAQs</h5>
                </div>
              </a>
            </li>
            <li>
              <a href="#/admin" className="profile-box">
                <div className="profile-img" style={{ backgroundColor: 'rgba(229, 185, 59, 0.1)' }}>
                  <i className="iconsax icon" data-icon="setting-5" style={{ color: '#e5b93b' }}></i>
                </div>
                <div className="profile-details">
                  <h4 style={{ color: '#e5b93b' }}>Quản trị (Admin)</h4>
                  <h5>Quản lý sản phẩm, kho hàng & đơn hàng</h5>
                </div>
              </a>
            </li>
            <li className="border-bottom-0">
              <a href="#/logout" onClick={handleLogout} className="profile-box">
                <div className="profile-img" style={{ backgroundColor: 'rgba(255, 77, 79, 0.1)' }}>
                  <i className="iconsax icon" data-icon="logout" style={{ color: '#ff4d4f' }}></i>
                </div>
                <div className="profile-details">
                  <h4 style={{ color: '#ff4d4f' }}>Log Out</h4>
                  <h5>Log out of your account securely</h5>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="panel-space"></section>

      <div className="navbar-menu">
        <ul>
          <li>
            <a href="#/landing">
              <div className="icon">
                <img className="unactive" src={getAssetPath("/assets/images/svg/home.svg")} alt="home" />
                <img className="active" src={getAssetPath("/assets/images/svg/home-fill.svg")} alt="home" />
              </div>
            </a>
          </li>
          <li>
            <a href="#/categories">
              <div className="icon">
                <img className="unactive" src={getAssetPath("/assets/images/svg/categories.svg")} alt="categories" />
                <img className="active" src={getAssetPath("/assets/images/svg/categories-fill.svg")} alt="categories" />
              </div>
            </a>
          </li>
          <li>
            <a href="#/cart">
              <div className="icon">
                <img className="unactive" src={getAssetPath("/assets/images/svg/bag.svg")} alt="bag" />
                <img className="active" src={getAssetPath("/assets/images/svg/bag-fill.svg")} alt="bag" />
              </div>
            </a>
          </li>
          <li>
            <a href="#/wishlist">
              <div className="icon">
                <img className="unactive" src={getAssetPath("/assets/images/svg/heart.svg")} alt="heart" />
                <img className="active" src={getAssetPath("/assets/images/svg/heart-fill.svg")} alt="heart" />
              </div>
            </a>
          </li>
          <li className="active">
            <a href="#/profile">
              <div className="icon">
                <img className="unactive" src={getAssetPath("/assets/images/svg/profile.svg")} alt="profile" />
                <img className="active" src={getAssetPath("/assets/images/svg/profile-fill.svg")} alt="profile" />
              </div>
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
