import { useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient';
import type { CartItem } from '../services/apiClient';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQty: (id: string, qty: number) => void;
  onDelete: (id: string) => void;
}

function CartItemRow({ item, onUpdateQty, onDelete }: CartItemRowProps) {
  const [startX, setStartX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0); 
  const [isOpen, setIsOpen] = useState(false); 

  const handleStart = (clientX: number) => {
    setStartX(clientX);
    setIsSwiping(true);
  };

  const handleMove = (clientX: number) => {
    if (!isSwiping) return;
    const diffX = clientX - startX;
    
    // Calculate new offset based on whether it is already swiped open
    let newOffset = isOpen ? -80 + diffX : diffX;
    
    // Limit bounds (allow swiping left only)
    if (newOffset > 0) newOffset = 0;
    if (newOffset < -120) newOffset = -120;
    
    setSwipeOffset(newOffset);
  };

  const handleEnd = () => {
    setIsSwiping(false);
    if (swipeOffset < -40) {
      setSwipeOffset(-80);
      setIsOpen(true);
    } else {
      setSwipeOffset(0);
      setIsOpen(false);
    }
  };

  return (
    <li 
      className="cart-product-box" 
      style={{ position: 'relative', overflow: 'hidden', listStyle: 'none', padding: 0, margin: '0 0 15px' }}
    >
      {/* Red Swipe Delete Background */}
      <div 
        onClick={() => onDelete(item.id)}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '80px',
          backgroundColor: '#dc3545',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          borderRadius: '12px',
          zIndex: 1
        }}
      >
        <i className="iconsax" data-icon="trash" style={{ fontSize: '20px', color: '#fff' }}></i>
      </div>
      
      {/* Main product card */}
      <div 
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => isSwiping && handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={isSwiping ? handleEnd : undefined}
        className="horizontal-product-box"
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwiping ? 'none' : 'transform 0.2s ease-out',
          backgroundColor: '#183044',
          position: 'relative',
          zIndex: 2,
          userSelect: 'none',
          cursor: 'grab'
        }}
      >
        <div className="horizontal-product-img">
          <a href={`#/product-details?id=${item.productId}`}>
            <img className="img-fluid img" src={item.image} alt={item.name} />
          </a>
        </div>
        <div className="horizontal-product-details">
          <div className="d-flex align-items-center justify-content-between">
            <a href={`#/product-details?id=${item.productId}`}>
              <h4>{item.name}</h4>
            </a>
            <i 
              className="iconsax trash" 
              data-icon="trash" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              style={{ cursor: 'pointer' }}
            ></i>
          </div>
          <ul className="product-info" style={{ display: 'flex', gap: '15px', padding: 0, margin: '5px 0 0' }}>
            <li>Size: {item.size}</li>
            <li className="d-flex align-items-center gap-1">
              Color: {item.color}
            </li>
          </ul>

          <div className="d-flex align-items-center justify-content-between mt-3">
            <div className="d-flex align-items-center gap-2">
              <h3 className="fw-semibold">${item.price} <del className="light-text fw-normal">${item.originalPrice}</del></h3>
            </div>
            <div className="plus-minus">
              <button 
                type="button"
                className="sub plus-minus-button" 
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateQty(item.id, item.quantity - 1);
                }}
              >
                <i className="iconsax" data-icon="minus"></i>
              </button>
              <input type="number" value={item.quantity} readOnly min="1" max="10" />
              <button 
                type="button"
                className="add plus-minus-button" 
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateQty(item.id, item.quantity + 1);
                }}
              >
                <i className="iconsax" data-icon="add"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const loadCart = () => {
    const items = apiClient.getCart();
    setCart(items);
  };

  useEffect(() => {
    document.body.className = "";
    window.scrollTo(0, 0);
    loadCart();
  }, []);

  // Trigger iconsax replacement after loading cart or when cart updates
  useEffect(() => {
    if (typeof (window as any).init_iconsax === 'function') {
      (window as any).init_iconsax();
    }
  }, [cart]);

  const handleUpdateQty = (id: string, newQty: number) => {
    if (newQty < 1 || newQty > 10) return;
    apiClient.updateCartQty(id, newQty);
    loadCart();
  };

  const handleDelete = (id: string) => {
    apiClient.removeFromCart(id);
    loadCart();
  };

  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <>
        <header className="section-t-space">
          <div className="custom-container">
            <div className="header-panel">
              <a href="#/landing">
                <i className="iconsax back-btn" data-icon="arrow-left"></i>
              </a>
              <h3>My Cart</h3>
            </div>
          </div>
        </header>
        
        <div className="custom-container">
          <div className="empty-tab text-center mt-5">
            <img className="img-fluid empty-img w-50" src="assets/images/gif/cart.gif" alt="empty-cart" style={{ display: 'block', margin: '0 auto 20px', maxWidth: '200px' }} />
            <h2>Your cart is empty.</h2>
            <h5 className="mt-3 light-text">Check out our top products to get the right one for you.</h5>
            <a href="#/shop" className="btn theme-btn w-100 mt-4 mb-3" role="button">Start Shopping</a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="section-t-space">
        <div className="custom-container">
          <div className="header-panel">
            <a href="#/landing">
              <i className="iconsax back-btn" data-icon="arrow-left"></i>
            </a>
            <h3>Cart</h3>
          </div>
        </div>
      </header>
      
      <section style={{ paddingBottom: '120px' }}>
        <div className="custom-container">
          <ul className="horizontal-product-list" style={{ padding: 0 }}>
            {cart.map((item) => (
              <CartItemRow 
                key={item.id} 
                item={item} 
                onUpdateQty={handleUpdateQty} 
                onDelete={handleDelete} 
              />
            ))}
          </ul>
        </div>
      </section>
      
      <div className="pay-popup">
        <div className="price-items">
          <h6>Total price</h6>
          <h2>${totalPrice.toFixed(2)}</h2>
        </div>
        <a href="#/checkout" className="btn btn-lg theme-btn pay-btn mt-0">Checkout</a>
      </div>
      
      <section className="panel-space"></section>
    </>
  );
}
