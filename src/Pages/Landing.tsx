import { useEffect, useState } from 'react';
import { productService, type Category } from '../services/productService';
import { getAssetPath } from '../utils/assetHelper';

export default function Landing() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    document.body.className = "";
    window.scrollTo(0, 0);
    setCategories(productService.getCategories());
  }, []);

  return (
    <>
      <div className="offcanvas sidebar-offcanvas offcanvas-start" tabIndex={-1} id="offcanvasLeft">
      <div className="offcanvas-header">
        <img className="img-fluid profile-pic" src="assets/images/icons/profile.png" alt="profile" />
        <h4>Hello, Agasya!</h4>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        <div className="sidebar-content">
          <ul className="link-section">
            <li>
              <div className="pages">
                <h4>RTL</h4>
                <div className="switch-btn">
                  <input id="dir-switch" type="checkbox" />
                </div>
              </div>
            </li>
            <li>
              <div className="pages">
                <h4>Dark</h4>
                <div className="switch-btn">
                  <input id="dark-switch" type="checkbox" />
                </div>
              </div>
            </li>

            <li>
              <a href="#/page-listing" className="pages">
                <h4>Pages List</h4>
                <i className="ri-arrow-drop-right-line"></i>
              </a>
            </li>

            <li>
              <a href="#/setting" className="pages">
                <h4>Setting</h4>
                <i className="ri-arrow-drop-right-line"></i>
              </a>
            </li>

            <li>
              <a href="#/login" className="pages">
                <h4>Logout</h4>
                <i className="ri-arrow-drop-right-line"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    

    
    <header className="section-t-space">
      <div className="custom-container">
        <div className="header">
          <div className="head-content">
            <button className="sidebar-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft">
              <i className="iconsax menu-icon" data-icon="menu-hamburger"></i>
            </button>
            <div className="header-info">
              <img className="img-fluid profile-pic" src="assets/images/icons/profile.png" alt="profile" />
              <div>
                <h4 className="light-text">Hello</h4>
                <h2 className="theme-color">Agasya!</h2>
              </div>
            </div>
          </div>
          <a href="#/notification" className="notification">
            <i className="iconsax notification-icon" data-icon="bell-2"></i>
          </a>
        </div>
      </div>
    </header>
    

    
    <section>
      <div className="custom-container">
        <form className="theme-form search-head" target="_blank">
          <div className="form-group">
            <div className="form-input">
              <input type="text" className="form-control search" id="inputusername" placeholder="Search here..." />
              <i className="iconsax search-icon" data-icon="search-normal-2"></i>
            </div>

            <a href="#search-filter" className="btn filter-btn mt-0" data-bs-toggle="modal">
              <i className="iconsax filter-icon" data-icon="media-sliders-3"></i>
            </a>
          </div>
        </form>
      </div>
    </section>
    

    
    <section className="banner-wapper">
      <div className="custom-container">
        <div className="banner-bg">
          <img className="img-fluid img-bg w-100" src="assets/images/banner/banner-1.jpg" alt="banner-1" />
          <div className="banner-content">
            <h2 className="fw-semibold">Best Selling</h2>
            <h4>Comforts & Modern life Stylish Sofa</h4>
          </div>
          <a href="#/shop" className="more-btn">
            <h4>View More</h4>
            <i className="iconsax right-arrow" data-icon="arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
    

    
    <section>
      <div className="custom-container">
        <div className="swiper categories">
          <div className="swiper-wrapper ratio_square">
            {categories.map((category) => (
              <div key={category.id} className="swiper-slide">
                <a href={`#/shop?category=${category.id}`} className="categories-item">
                  <img className="categories-img" src={category.image} alt={category.name} style={{ width: '32px', height: '32px', objectFit: 'contain', marginBottom: '8px' }} />
                  <h4>{category.name}</h4>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    

    
    <section className="section-t-space">
      <div className="custom-container">
        <div className="title">
          <h2>New Arrivals</h2>
          <a href="#/shop">View All</a>
        </div>

        <div className="row g-3">
          <div className="col-6">
            <div className="product-box">
              <div className="product-box-img">
                <a href="#/shop"><img className="img" src="assets/images/product/1.png" alt="p1" /></a>

                <div className="cart-box">
                  <a href="#/cart" className="cart-bag">
                    <i className="iconsax bag" data-icon="basket-2"></i>
                  </a>
                </div>
              </div>
              <div className="like-btn animate active inactive">
                <img className="outline-icon" src="assets/images/svg/like.svg" alt="like" />
                <img className="fill-icon" src="assets/images/svg/like-fill.svg" alt="like" />
                <div className="effect-group">
                  <span className="effect"></span>
                  <span className="effect"></span>
                  <span className="effect"></span>
                  <span className="effect"></span>
                  <span className="effect"></span>
                </div>
              </div>
              <div className="product-box-detail">
                <h4>Buddy Chair</h4>
                <h5>Modern saddle arms</h5>
                <div className="bottom-panel">
                  <div className="price">
                    <h4>$14 <del className="pev-price">$20</del></h4>
                  </div>
                  <div className="rating">
                    <img src="assets/images/svg/Star.svg" alt="star" />
                    <h6>4.5</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="product-box">
              <div className="product-box-img">
                <a href="#/shop">
                  <img className="img" src="assets/images/product/2.png" alt="p2" />
                </a>

                <div className="cart-box">
                  <a href="#/cart" className="cart-bag">
                    <i className="iconsax bag" data-icon="basket-2"></i>
                  </a>
                </div>
              </div>
              <div className="like-btn animate inactive">
                <img className="outline-icon" src="assets/images/svg/like.svg" alt="like" />
                <img className="fill-icon" src="assets/images/svg/like-fill.svg" alt="like" />
                <div className="effect-group">
                  <span className="effect"></span>
                  <span className="effect"></span>
                  <span className="effect"></span>
                  <span className="effect"></span>
                  <span className="effect"></span>
                </div>
              </div>
              <div className="product-box-detail">
                <h4>Wingback Chair</h4>
                <h5>Modern saddle arms</h5>
                <div className="bottom-panel">
                  <div className="price">
                    <h4>$14 <del className="pev-price">$20</del></h4>
                  </div>
                  <div className="rating">
                    <img src="assets/images/svg/Star.svg" alt="star" />
                    <h6>4.5</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    

    
    <section className="section-t-space">
      <div className="custom-container">
        <div className="title">
          <h2>Trending Furniture</h2>
          <a href="#/product-details">View All</a>
        </div>

        <div className="row g-3">
          <div className="col-12">
            <div className="horizontal-product-box">
              <a href="#/product-details" className="horizontal-product-img">
                <img className="img-fluid img" src="assets/images/product/3.png" alt="p3" />
              </a>
              <div className="horizontal-product-details">
                <div className="d-flex align-items-center justify-content-between">
                  <h4>Wingback Chair</h4>
                  <div className="rating d-flex align-items-center">
                    <img src="assets/images/svg/Star.svg" alt="star" />

                    <h6 className="theme-color fw-normal">4.5</h6>
                  </div>
                </div>
                <h5>Modern arms chairs</h5>

                <div className="d-flex align-items-center justify-content-between mt-1">
                  <div className="d-flex align-items-center gap-2">
                    <h3 className="fw-semibold">$25</h3>
                    <h6 className="save">Save $10</h6>
                  </div>
                  <a href="#/cart" className="cart-bag">
                    <i className="iconsax bag" data-icon="basket-2"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="horizontal-product-box">
              <a href="#/product-details" className="horizontal-product-img">
                <img className="img-fluid img" src="assets/images/product/4.png" alt="p4" />
              </a>
              <div className="horizontal-product-details">
                <div className="d-flex align-items-center justify-content-between">
                  <h4>Mid Century Sofa</h4>
                  <div className="rating d-flex align-items-center">
                    <img src="assets/images/svg/Star.svg" alt="star" />

                    <h6 className="theme-color fw-normal">4.5</h6>
                  </div>
                </div>
                <h5>Modern arms Sofa</h5>

                <div className="d-flex align-items-center justify-content-between mt-1">
                  <div className="d-flex align-items-center gap-2">
                    <h3 className="fw-semibold">$999</h3>
                  </div>
                  <a href="#/cart" className="cart-bag">
                    <i className="iconsax bag" data-icon="basket-2"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="horizontal-product-box">
              <a href="#/product-details" className="horizontal-product-img">
                <img className="img-fluid img" src="assets/images/product/5.png" alt="p5" />
              </a>
              <div className="horizontal-product-details">
                <div className="d-flex align-items-center justify-content-between">
                  <h4>Beige Chair</h4>
                  <div className="rating d-flex align-items-center">
                    <img src="assets/images/svg/Star.svg" alt="star" />

                    <h6 className="theme-color fw-normal">4.5</h6>
                  </div>
                </div>
                <h5>Modern arms chair</h5>

                <div className="d-flex align-items-center justify-content-between mt-1">
                  <div className="d-flex align-items-center gap-2">
                    <h3 className="fw-semibold">$37</h3>
                  </div>
                  <a href="#/cart" className="cart-bag">
                    <i className="iconsax bag" data-icon="basket-2"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    

    
    <section className="banner-wapper">
      <div className="custom-container">
        <div className="banner-bg">
          <img className="img-fluid img-bg" src="assets/images/banner/banner-2.jpg" alt="banner-2" />
          <div className="banner-content">
            <h2 className="fw-semibold">Best Selling</h2>
            <h4>Comforts & Modern life Stylish Sofa</h4>
          </div>
          <a href="#/shop" className="more-btn">
            <h4>View More</h4>
            <i className="iconsax right-arrow" data-icon="arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
    

    
    <section className="offer-zone section-b-space pt-0">
      <div className="custom-container">
        <div className="title">
          <h2>Offer Zone</h2>
          <a href="#/product-details">View All</a>
        </div>

        <div className="swiper offer">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <div className="horizontal-product-box">
                <a href="#/product-details" className="horizontal-product-img">
                  <img className="img-fluid img" src="assets/images/product/6.png" alt="p6" />
                </a>
                <div className="horizontal-product-details">
                  <div className="d-flex align-items-center justify-content-between">
                    <h4>Table Lamp</h4>
                  </div>
                  <h5>Bedroom Study Table Lamp</h5>
                  <div className="rating d-flex align-items-center gap-1 mt-1">
                    <img src="assets/images/svg/Star.svg" alt="star" />

                    <img src="assets/images/svg/Star.svg" alt="star" />

                    <img src="assets/images/svg/Star.svg" alt="star" />

                    <img src="assets/images/svg/Star.svg" alt="star" />

                    <img src="assets/images/svg/Star.svg" alt="star" />
                  </div>

                  <div className="d-flex align-items-center justify-content-between mt-1">
                    <div className="d-flex align-items-center gap-2">
                      <h3 className="fw-semibold">$37</h3>
                    </div>
                    <a href="#/cart" className="cart-bag">
                      <i className="iconsax bag" data-icon="basket-2"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="horizontal-product-box mt-3">
                <a href="#/product-details" className="horizontal-product-img">
                  <img className="img-fluid img" src="assets/images/product/7.png" alt="p7" />
                </a>
                <div className="horizontal-product-details">
                  <div className="d-flex align-items-center justify-content-between">
                    <h4>Side Table</h4>
                  </div>
                  <h5>Solid wood console table</h5>
                  <div className="rating d-flex align-items-center gap-1 mt-1">
                    <img src="assets/images/svg/Star.svg" alt="star" />

                    <img src="assets/images/svg/Star.svg" alt="star" />

                    <img src="assets/images/svg/Star.svg" alt="star" />

                    <img src="assets/images/svg/Star.svg" alt="star" />

                    <img src="assets/images/svg/Star.svg" alt="star" />
                  </div>

                  <div className="d-flex align-items-center justify-content-between mt-1">
                    <div className="d-flex align-items-center gap-2">
                      <h3 className="fw-semibold">$37</h3>
                    </div>
                    <a href="#/cart" className="cart-bag">
                      <i className="iconsax bag" data-icon="basket-2"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="horizontal-product-box">
                <a href="#/product-details" className="horizontal-product-img">
                  <img className="img-fluid img" src="assets/images/product/8.png" alt="p8" />
                </a>
                <div className="horizontal-product-details">
                  <div className="d-flex align-items-center justify-content-between">
                    <h4>Lounge Chair</h4>
                  </div>
                  <h5>Modern arms chair</h5>
                  <div className="rating d-flex align-items-center gap-1 mt-1">
                    <img src="assets/images/svg/Star.svg" alt="star" />

                    <img src="assets/images/svg/Star.svg" alt="star" />

                    <img src="assets/images/svg/Star.svg" alt="star" />

                    <img src="assets/images/svg/Star.svg" alt="star" />

                    <img src="assets/images/svg/Star.svg" alt="star" />
                  </div>

                  <div className="d-flex align-items-center justify-content-between mt-1">
                    <div className="d-flex align-items-center gap-2">
                      <h3 className="fw-semibold">$37</h3>
                    </div>
                    <a href="#/cart" className="cart-bag">
                      <i className="iconsax bag" data-icon="basket-2"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="horizontal-product-box mt-3">
                <a href="#/product-details" className="horizontal-product-img">
                  <img className="img-fluid img" src="assets/images/product/9.png" alt="p9" />
                </a>
                <div className="horizontal-product-details">
                  <div className="d-flex align-items-center justify-content-between">
                    <h4>Swing Chair</h4>
                  </div>
                  <h5>Modern steel swing chair</h5>
                  <div className="rating d-flex align-items-center gap-1 mt-1">
                    <img src="assets/images/svg/Star.svg" alt="star" />

                    <img src="assets/images/svg/Star.svg" alt="star" />

                    <img src="assets/images/svg/Star.svg" alt="star" />

                    <img src="assets/images/svg/Star.svg" alt="star" />

                    <img src="assets/images/svg/Star.svg" alt="star" />
                  </div>

                  <div className="d-flex align-items-center justify-content-between mt-1">
                    <div className="d-flex align-items-center gap-2">
                      <h3 className="fw-semibold">$37</h3>
                    </div>
                    <a href="#/cart" className="cart-bag">
                      <i className="iconsax bag" data-icon="basket-2"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    

    
    <section className="section-t-space">
      <div className="custom-container">
        <div className="title">
          <h2>Furniture And Decor</h2>
          <a href="#/shop">View All</a>
        </div>

        <div className="row g-4">
          <div className="col-6">
            <div className="product-box">
              <div className="product-box-img">
                <a href="#/shop"> <img className="img" src="assets/images/product/10.png" alt="p10" /></a>

                <div className="cart-box">
                  <a href="#/cart" className="cart-bag">
                    <i className="iconsax bag" data-icon="basket-2"></i>
                  </a>
                </div>
              </div>
              <div className="like-btn animate active inactive">
                <img className="outline-icon" src="assets/images/svg/like.svg" alt="like" />
                <img className="fill-icon" src="assets/images/svg/like-fill.svg" alt="like" />

                <div className="effect-group">
                  <span className="effect"></span>
                  <span className="effect"></span>
                  <span className="effect"></span>
                  <span className="effect"></span>
                  <span className="effect"></span>
                </div>
              </div>
              <div className="product-box-detail">
                <h4>Bubble Swing Chair</h4>
                <div className="d-flex justify-content-between gap-3">
                  <h5>Modern Swing Chair</h5>
                  <h3 className="fw-semibold">$120</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="product-box">
              <div className="product-box-img">
                <a href="#/shop"> <img className="img" src="assets/images/product/11.png" alt="p11" /></a>

                <div className="cart-box">
                  <a href="#/cart" className="cart-bag">
                    <i className="iconsax bag" data-icon="basket-2"></i>
                  </a>
                </div>
              </div>
              <div className="like-btn animate inactive">
                <img className="outline-icon" src="assets/images/svg/like.svg" alt="like" />
                <img className="fill-icon" src="assets/images/svg/like-fill.svg" alt="like" />
                <div className="effect-group">
                  <span className="effect"></span>
                  <span className="effect"></span>
                  <span className="effect"></span>
                  <span className="effect"></span>
                  <span className="effect"></span>
                </div>
              </div>
              <div className="product-box-detail">
                <h4>Lounge Chair</h4>
                <div className="d-flex justify-content-between gap-3">
                  <h5>Modern arms chair</h5>
                  <h3 className="fw-semibold">$120</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="product-box">
              <div className="product-box-img">
                <a href="#/shop"> <img className="img" src="assets/images/product/12.png" alt="p12" /></a>

                <div className="cart-box">
                  <a href="#/cart" className="cart-bag">
                    <i className="iconsax bag" data-icon="basket-2"></i>
                  </a>
                </div>
              </div>
              <div className="like-btn animate inactive">
                <img className="outline-icon" src="assets/images/svg/like.svg" alt="like" />
                <img className="fill-icon" src="assets/images/svg/like-fill.svg" alt="like" />

                <div className="effect-group">
                  <span className="effect"></span>
                  <span className="effect"></span>
                  <span className="effect"></span>
                  <span className="effect"></span>
                  <span className="effect"></span>
                </div>
              </div>
              <div className="product-box-detail">
                <h4>Double Bed Sheet</h4>
                <div className="d-flex justify-content-between gap-3">
                  <h5>Modern double bed sheet</h5>
                  <h3 className="fw-semibold">$120</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="product-box">
              <div className="product-box-img">
                <a href="#/shop"> <img className="img" src="assets/images/product/13.png" alt="p13" /></a>

                <div className="cart-box">
                  <a href="#/cart" className="cart-bag">
                    <i className="iconsax bag" data-icon="basket-2"></i>
                  </a>
                </div>
              </div>
              <div className="like-btn animate inactive">
                <img className="outline-icon" src="assets/images/svg/like.svg" alt="like" />
                <img className="fill-icon" src="assets/images/svg/like-fill.svg" alt="like" />
                <div className="effect-group">
                  <span className="effect"></span>
                  <span className="effect"></span>
                  <span className="effect"></span>
                  <span className="effect"></span>
                  <span className="effect"></span>
                </div>
              </div>
              <div className="product-box-detail">
                <h4>Hanging Light</h4>
                <div className="d-flex justify-content-between gap-3">
                  <h5>Metal hanging light</h5>
                  <h3 className="fw-semibold">$120</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    

    
    <section className="banner-wapper grid-banner">
      <div className="custom-container">
        <div className="row">
          <div className="col-6">
            <div className="banner-bg">
              <img className="img-fluid img-bg" src="assets/images/banner/banner-3.jpg" alt="banner-3" />
              <div className="banner-content">
                <h3>Wingback Chair</h3>
              </div>
              <a href="#/shop" className="more-btn d-block">
                <i className="iconsax right-arrow" data-icon="arrow-right"></i>
                <h3>View More</h3>
              </a>
              <div className="banner-bg"></div>
            </div>
          </div>

          <div className="col-6">
            <div className="banner-bg">
              <img className="img-fluid img-bg" src="assets/images/banner/banner-4.jpg" alt="banner-3" />
              <div className="banner-content">
                <h3>Wingback Chair</h3>
              </div>
              <a href="#/shop" className="more-btn d-block">
                <i className="iconsax right-arrow" data-icon="arrow-right"></i>
                <h3>View More</h3>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    

    
    <div className="modal search-filter" id="search-filter" tabIndex={-1}>
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content">
          <div className="modal-title">
            <a href="#/landing" data-bs-dismiss="modal">
              <i className="iconsax back-btn" data-icon="arrow-left"></i>
            </a>
            <h3 className="fw-semibold">Filter</h3>
          </div>

          <div className="tab-body d-flex align-items-start">
            <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
              <button className="nav-link active" id="v-pills-sort-tab" data-bs-toggle="pill" data-bs-target="#v-pills-sort" type="button" role="tab" aria-controls="v-pills-sort" aria-selected="true">Sort By</button>

              <button className="nav-link" id="v-pills-color-tab" data-bs-toggle="pill" data-bs-target="#v-pills-color" type="button" role="tab" aria-controls="v-pills-color" aria-selected="false">Color</button>

              <button className="nav-link" id="v-pills-price-tab" data-bs-toggle="pill" data-bs-target="#v-pills-price" type="button" role="tab" aria-controls="v-pills-price" aria-selected="false">Price</button>

              <button className="nav-link" id="v-pills-material-tab" data-bs-toggle="pill" data-bs-target="#v-pills-material" type="button" role="tab" aria-controls="v-pills-material" aria-selected="false">Material</button>
            </div>

            <div className="tab-content" id="v-pills-tabContent">
              <div className="tab-pane tab-info fade show active" id="v-pills-sort" role="tabpanel" aria-labelledby="v-pills-sort-tab" tabIndex={0}>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="flexRadioDefault" id="radio1" />
                  <label className="form-check-label" htmlFor="radio1">Relevance</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="radio" id="radio2" />
                  <label className="form-check-label" htmlFor="radio2">Highest Priced First</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="radio" id="radio3" defaultChecked />
                  <label className="form-check-label" htmlFor="radio3">Lowest Priced First</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="radio" id="radio4" />
                  <label className="form-check-label" htmlFor="radio4">Fastest Shipping</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="radio" id="radio5" />
                  <label className="form-check-label" htmlFor="radio5">Newest</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="radio" id="radio6" />
                  <label className="form-check-label" htmlFor="radio6">Highest Rating First</label>
                </div>
              </div>

              <div className="tab-pane tab-info color-info fade" id="v-pills-color" role="tabpanel" aria-labelledby="v-pills-color-tab" tabIndex={0}>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" defaultValue="" id="color1" />
                  <label className="form-check-label" htmlFor="color1">Black</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" defaultValue="" id="color2" />
                  <label className="form-check-label" htmlFor="color2">Gray</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" defaultValue="" id="color3" />
                  <label className="form-check-label" htmlFor="color3">Blue</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" defaultValue="" id="color4" />
                  <label className="form-check-label" htmlFor="color4">Yellow</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" defaultValue="" id="color5" />
                  <label className="form-check-label" htmlFor="color5">Green</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" defaultValue="" id="color6" />
                  <label className="form-check-label" htmlFor="color6">Red</label>
                </div>
              </div>

              <div className="tab-pane price-info fade" id="v-pills-price" role="tabpanel" aria-labelledby="v-pills-price-tab" tabIndex={0}>
                <div className="range-slider">
                  <span>From <input type="number" defaultValue="250" min="0" max="100000" step="50" /> To <input type="number" defaultValue="750" min="0" max="1000" step="50" /> </span>
                  <input defaultValue="250" min="0" max="1000" step="50" type="range" />
                  <input defaultValue="500" min="0" max="1000" step="50" type="range" />
                  <svg width="100%" height="24">
                    <line x1="4" y1="0" x2="480" y2="0" stroke="#444" strokeWidth="12" strokeDasharray="1 28"></line>
                  </svg>
                </div>
              </div>

              <div className="tab-pane tab-info fade" id="v-pills-material" role="tabpanel" aria-labelledby="v-pills-material-tab" tabIndex={0}>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" name="flexRadioDefault" id="flexRadioDefault1" />
                  <label className="form-check-label" htmlFor="flexRadioDefault1">Fabric</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" name="flexRadioDefault" id="flexRadioDefault2" defaultChecked />
                  <label className="form-check-label" htmlFor="flexRadioDefault2">Wooden</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" name="flexRadioDefault" id="flexRadioDefault3" />
                  <label className="form-check-label" htmlFor="flexRadioDefault2">Metal</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" name="flexRadioDefault" id="flexRadioDefault4" />
                  <label className="form-check-label" htmlFor="flexRadioDefault1">Plastic</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" name="flexRadioDefault" id="flexRadioDefault5" />
                  <label className="form-check-label" htmlFor="flexRadioDefault2">Glass</label>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-modal d-flex gap-3">
            <a href="#/landing" className="btn gray-btn btn-inline mt-0 w-50">Clear Filter</a>
            <a href="#/landing" className="theme-btn btn btn-inline mt-0 w-50" data-bs-dismiss="modal">apply</a>
          </div>
        </div>
      </div>
    </div>
    

    
    <section className="panel-space"></section>
    

    
    <div className="navbar-menu">
      <ul>
        <li className="active">
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
