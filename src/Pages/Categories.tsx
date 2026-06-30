import { useEffect, useState } from 'react';
import { productService, type Category } from '../services/productService';
import { getAssetPath } from '../utils/assetHelper';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.body.className = "";
    window.scrollTo(0, 0);
    setCategories(productService.getCategories());
  }, []);

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <header className="section-t-space">
        <div className="custom-container">
          <div className="header-panel">
            <h3>Categories</h3>
            <a href="#/notification" className="notification"> 
              <i className="iconsax notification-icon" data-icon="bell-2"></i> 
            </a>
          </div>
        </div>
      </header>
      
      <section>
        <div className="custom-container">
          <div className="theme-form search-head">
            <div className="form-group">
              <div className="form-input w-100">
                <input 
                  type="text" 
                  className="form-control search" 
                  placeholder="Search categories..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <i className="iconsax search-icon" data-icon="search-normal-2"></i>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section>
        <div className="custom-container">
          <ul className="categories-list">
            {filteredCategories.map((category, index) => (
              <li key={category.id} className={index === 0 ? "mt-0" : ""}>
                <a href={`#/shop?category=${category.id}`} className="d-flex align-items-center">
                  <div className="ps-3">
                    <h2>{category.name}</h2>
                    <h4 className="mt-1">Explore our range of {category.name.toLowerCase()}</h4>
                    <div className="arrow">
                      <i className="iconsax right-arrow" data-icon="arrow-right"></i>
                    </div>
                  </div>
                  <div className="categories-img">
                    <img className="img-fluid categories img" src={category.image} alt={category.name} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                  </div>
                </a>
              </li>
            ))}
            {filteredCategories.length === 0 && (
              <div className="text-center py-5">
                <p style={{ color: '#aaa' }}>No categories found matching "{search}"</p>
              </div>
            )}
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
          <li className="active">
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
          <li>
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
