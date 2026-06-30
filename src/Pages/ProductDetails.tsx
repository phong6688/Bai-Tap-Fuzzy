import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { productService, type Product } from '../services/productService';
import { apiClient } from '../services/apiClient';

export default function ProductDetails() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get('id') || 'prod_1';
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCartSheet, setShowCartSheet] = useState(false);

  // Load similar products
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

  useEffect(() => {
    document.body.className = "details-page";
    window.scrollTo(0, 0);
  }, [productId]);

  useEffect(() => {
    if (showCartSheet && typeof (window as any).init_iconsax === 'function') {
      (window as any).init_iconsax();
    }
  }, [showCartSheet]);

  useEffect(() => {
    setLoading(true);
    const prod = productService.getProductById(productId);
    if (prod) {
      setProduct(prod);
      setSelectedSize(prod.sizes[0] || '');
      setSelectedColor(prod.colors[0] || '');
      
      // Load other chairs in same category
      const sim = productService.getProducts({ categoryId: prod.categoryId, limit: 6 });
      setSimilarProducts(sim.products.filter((p: any) => p.id !== prod.id));
    }
    setLoading(false);
  }, [productId]);

  useEffect(() => {
    if (!loading && product && typeof (window as any).init_iconsax === 'function') {
      (window as any).init_iconsax();
    }
  }, [loading, product]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product) return;
    apiClient.addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      quantity,
      color: selectedColor || 'Standard',
      size: selectedSize || 'Standard'
    });
    setAddedMessage(`Added ${quantity}x ${product?.name} (${selectedColor || 'Standard'}, Size ${selectedSize || 'Standard'}) to your cart!`);
    setTimeout(() => setAddedMessage(''), 3000);
  };

  const handleQtyChange = (val: number) => {
    if (val >= 1 && val <= 10) {
      setQuantity(val);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff' }}>
        <h3>Loading details...</h3>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#fff' }}>
        <h2>Product Not Found</h2>
        <a href="#/shop" className="btn btn-warning mt-3" style={{ borderRadius: '20px' }}>Back to Shop</a>
      </div>
    );
  }

  const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <>
      <div className="top-image">
        <img className="product-header img-fluid" src="assets/images/background/header-bg.png" alt="header-bg" />
      </div>
      
      <header className="product-page-header">
        <div className="header-panel">
          <a href="#/shop" className="product-back">
            <i className="iconsax back-btn" data-icon="arrow-left"></i>
          </a>
          <h3 className="title">Chairs Shop</h3>
          <div className="d-flex gap-2">
            <a href="#/search" className="search">
              <i className="iconsax icons" data-icon="search-normal-2"></i>
            </a>

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
          </div>
        </div>
      </header>
      
      <section>
        <div className="product-image-slider">
          <div className="swiper product-1 ms-4">
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <img className="img-fluid product-img" src={product.image} alt={product.name} />
              </div>
              <div className="swiper-slide">
                <img className="img-fluid product-img" src={product.image} alt={product.name} />
              </div>
              <div className="swiper-slide">
                <img className="img-fluid product-img" src={product.image} alt={product.name} />
              </div>
            </div>
            <div className="product-info d-flex justify-content-between">
              <div className="swiper-pagination"></div>
              <ul className="color-variation" style={{ display: 'none' }}>
                <li className="product-color color1"></li>
                <li className="product-color color2"></li>
                <li className="product-color color3"></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <section className="pt-0">
        <div className="custom-container">
          {addedMessage && (
            <div className="alert alert-success" role="alert" style={{ fontSize: '13px', padding: '10px 15px', borderRadius: '5px', marginBottom: '15px' }}>
              {addedMessage}
            </div>
          )}

          <div className="product-details">
            <div className="product-name">
              <h2 className="theme-color">{product.name}</h2>
              {discountPercentage > 0 && <h6>{discountPercentage}% OFF</h6>}
            </div>

            <div className="ratings mt-1">
              <div className="d-flex align-items-center gap-1">
                <h4 className="theme-color fw-normal">{product.rating}</h4>
                <ul className="rating-stars">
                  <li><img className="img-fluid stars" src="assets/images/svg/Star.svg" alt="star" /></li>
                  <li><img className="img-fluid stars" src="assets/images/svg/Star.svg" alt="star" /></li>
                  <li><img className="img-fluid stars" src="assets/images/svg/Star.svg" alt="star" /></li>
                  <li><img className="img-fluid stars" src="assets/images/svg/Star.svg" alt="star" /></li>
                  <li><img className="img-fluid stars" src="assets/images/svg/star1.svg" alt="star" /></li>
                </ul>
                <h4 className="reviews">156 Reviews</h4>
              </div>
            </div>

            <div className="product-price">
              <h3>${product.price} <del>${product.originalPrice}</del></h3>
              <div className="plus-minus">
                <i className="iconsax sub" data-icon="minus" onClick={() => handleQtyChange(quantity - 1)}></i>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => handleQtyChange(Number(e.target.value))}
                  min="1" 
                  max="10" 
                />
                <i className="iconsax add" data-icon="add" onClick={() => handleQtyChange(quantity + 1)}></i>
              </div>
            </div>

            {/* COLOR SELECTOR */}
            <div className="mt-4">
              <h5 style={{ color: '#fff', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Select Color</h5>
              <div className="d-flex gap-2">
                {product.colors.map(color => {
                  const isSelected = selectedColor === color;
                  return (
                    <button 
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className="btn"
                      style={{ 
                        borderRadius: '50%', 
                        width: '32px', 
                        height: '32px', 
                        padding: 0,
                        border: isSelected ? '3px solid #ffc107' : '1px solid rgba(255,255,255,0.2)',
                        backgroundColor: color.toLowerCase() === 'beige' ? '#e2d4be' : 
                                         color.toLowerCase() === 'blue' ? '#0d6efd' :
                                         color.toLowerCase() === 'grey' ? '#8e8e8e' :
                                         color.toLowerCase() === 'black' ? '#000' :
                                         color.toLowerCase() === 'brown' ? '#8b4513' :
                                         color.toLowerCase() === 'white' ? '#fff' : '#aaa'
                      }}
                      title={color}
                    />
                  );
                })}
              </div>
            </div>

            {/* SIZE SELECTOR */}
            <div className="mt-4 mb-4">
              <h5 style={{ color: '#fff', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Select Size</h5>
              <div className="d-flex gap-2">
                {product.sizes.map(size => {
                  const isSelected = selectedSize === size;
                  return (
                    <button 
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`btn btn-sm ${isSelected ? 'btn-warning text-dark' : 'btn-outline-light text-white'}`}
                      style={{ borderRadius: '50%', width: '40px', height: '40px', fontWeight: 'bold', fontSize: '12px' }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <p>{product.description}</p>

            <div className="accordion details-accordion mt-4" id="accordionPanelsStayOpenExample">
              <div className="accordion-item">
                <div className="accordion-header" id="headingOne">
                  <div className="accordion-button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-p1">Dimensions</div>
                </div>

                <div id="panelsStayOpen-p1" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    <table className="table table-bordered text-center m-0">
                      <thead>
                        <tr>
                          <th scope="col">Height</th>
                          <th scope="col">Width</th>
                          <th scope="col">Length</th>
                          <th scope="col">Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>115 cm</td>
                          <td>85 cm</td>
                          <td>18 lb</td>
                          <td>5 kg</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <div className="accordion-header" id="headingTwo">
                  <div className="accordion-button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-p2">Check Delivery</div>
                </div>
                <div id="panelsStayOpen-p2" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    <div className="input-group">
                      <input type="text" className="form-control" placeholder="Pincode" />
                      <button className="btn theme-btn" type="button" id="button-addon2">Check</button>
                    </div>

                    <ul className="address-type">
                      <li>
                        <i className="iconsax icon" data-icon="truck-fast"></i>
                        <h6>Free Delivery</h6>
                      </li>
                      <li>
                        <i className="iconsax icon" data-icon="dollar-circle"></i>
                        <h6>COD Available</h6>
                      </li>
                      <li>
                        <i className="iconsax icon" data-icon="box-rotate"></i>
                        <h6>21 days Return</h6>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SIMILAR PRODUCTS */}
      {similarProducts.length > 0 && (
        <section className="similer-product section-b-space pt-0">
          <div className="custom-container">
            <div className="title">
              <h2>Similar Products</h2>
              <a href="#/shop">View All</a>
            </div>

            <div className="swiper similer-product">
              <div className="swiper-wrapper">
                {similarProducts.map(sim => (
                  <div key={sim.id} className="swiper-slide" style={{ width: '150px' }}>
                    <div className="product-box">
                      <div className="product-box-img">
                        <a href={`#/product-details?id=${sim.id}`}>
                          <img className="img" src={sim.image} alt={sim.name} />
                        </a>
                        <div className="cart-box">
                          <a href={`#/product-details?id=${sim.id}`} className="cart-bag">
                            <i className="iconsax bag" data-icon="basket-2"></i>
                          </a>
                        </div>
                      </div>
                      <div className="product-box-detail">
                        <h4>{sim.name}</h4>
                        <div className="bottom-panel">
                          <div className="price">
                            <h4>${sim.price}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* STICKY ADD TO CART BUTTON (ALWAYS PINNED TO BOTTOM) */}
      <section className="fixed-cart-btn section-b-space">
        <div className="custom-container">
          <a href="#/add-to-cart" onClick={(e) => { e.preventDefault(); setShowCartSheet(true); }} className="cart-box-sec" style={{ textDecoration: 'none' }}>
            <div className="d-flex align-items-center gap-2">
              <i className="iconsax bag" data-icon="basket-2"></i>
              <h2>Add to cart</h2>
            </div>
            <h2>${(product.price * quantity).toFixed(2)}</h2>
          </a>
        </div>
      </section>
      
      {/* MOBILE ADD TO CART BOTTOM SHEET (SLIDE UP DRAWER) */}
      <div 
        className="offcanvas offcanvas-bottom show" 
        tabIndex={-1} 
        style={{ 
          visibility: showCartSheet ? 'visible' : 'hidden', 
          transform: showCartSheet ? 'translate(-50%, 0)' : 'translate(-50%, 100%)',
          transition: 'transform 0.3s ease-in-out, visibility 0.3s',
          backgroundColor: '#122636',
          borderTopLeftRadius: '25px',
          borderTopRightRadius: '25px',
          height: 'auto',
          maxHeight: '90%',
          width: '100%',
          maxWidth: '480px',
          position: 'fixed',
          bottom: 0,
          left: '50%',
          zIndex: 1050,
          padding: '20px',
          boxShadow: '0 -5px 25px rgba(0,0,0,0.6)',
          transformOrigin: 'bottom center'
        }}
      >
        {/* Header Summary */}
        <div className="d-flex justify-content-between align-items-start pb-3 mb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="d-flex gap-3">
            <img src={product.image} alt={product.name} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
            <div>
              <h4 className="text-white fw-bold" style={{ fontSize: '16px', margin: 0 }}>{product.name}</h4>
              <h3 className="text-warning fw-semibold mt-1" style={{ fontSize: '18px', margin: 0 }}>${product.price}</h3>
              <p className="light-text mb-0" style={{ fontSize: '11px' }}>Tồn kho: {product.stock} cái</p>
            </div>
          </div>
          <button 
            type="button" 
            className="btn-close btn-close-white" 
            onClick={() => setShowCartSheet(false)}
            style={{ padding: '5px' }}
          ></button>
        </div>

        {/* Variations Selector */}
        <div className="sheet-body" style={{ maxHeight: '350px', overflowY: 'auto' }}>
          {/* Color Option */}
          <div className="mb-3">
            <h5 className="text-white fw-semibold" style={{ fontSize: '14px', marginBottom: '8px' }}>Màu sắc / Color</h5>
            <div className="d-flex gap-2">
              {product.colors.map(color => {
                const isSelected = selectedColor === color;
                return (
                  <button 
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className="btn"
                    style={{ 
                      borderRadius: '50%', 
                      width: '32px', 
                      height: '32px', 
                      padding: 0,
                      border: isSelected ? '3px solid #ffc107' : '1px solid rgba(255,255,255,0.2)',
                      backgroundColor: color.toLowerCase() === 'beige' ? '#e2d4be' : 
                                       color.toLowerCase() === 'blue' ? '#0d6efd' :
                                       color.toLowerCase() === 'grey' ? '#8e8e8e' :
                                       color.toLowerCase() === 'black' ? '#000' :
                                       color.toLowerCase() === 'brown' ? '#8b4513' :
                                       color.toLowerCase() === 'white' ? '#fff' : '#aaa'
                    }}
                    title={color}
                  />
                );
              })}
            </div>
          </div>

          {/* Size Option */}
          <div className="mb-3">
            <h5 className="text-white fw-semibold" style={{ fontSize: '14px', marginBottom: '8px' }}>Kích thước / Size</h5>
            <div className="d-flex gap-2">
              {product.sizes.map(size => {
                const isSelected = selectedSize === size;
                return (
                  <button 
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`btn btn-sm ${isSelected ? 'btn-warning text-dark' : 'btn-outline-light text-white'}`}
                    style={{ borderRadius: '50%', width: '38px', height: '38px', fontWeight: 'bold', fontSize: '12px' }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <h5 className="text-white fw-semibold mb-0" style={{ fontSize: '14px' }}>Số lượng / Quantity</h5>
            <div className="plus-minus">
              <i className="iconsax sub" data-icon="minus" onClick={() => handleQtyChange(quantity - 1)} style={{ cursor: 'pointer' }}></i>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => handleQtyChange(Number(e.target.value))}
                min="1" 
                max="10" 
              />
              <i className="iconsax add" data-icon="add" onClick={() => handleQtyChange(quantity + 1)} style={{ cursor: 'pointer' }}></i>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-3">
          <button 
            type="button" 
            onClick={(e) => {
              handleAddToCart(e);
              setShowCartSheet(false);
            }} 
            className="btn btn-warning w-100 py-3 text-dark fw-bold"
            style={{ borderRadius: '12px', fontSize: '15px' }}
          >
            Xác nhận thêm vào giỏ • ${(product.price * quantity).toFixed(2)}
          </button>
        </div>
      </div>

      {/* Sheet Backdrop */}
      {showCartSheet && (
        <div 
          onClick={() => setShowCartSheet(false)}
          className="offcanvas-backdrop fade show" 
          style={{ maxWidth: '480px', left: '50%', transform: 'translateX(-50%)', zIndex: 1040 }}
        ></div>
      )}

      <section className="panel-space"></section>
    </>
  );
}
