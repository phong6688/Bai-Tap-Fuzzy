import { useEffect, useState } from 'react';
import { apiClient, getCurrentUser } from '../services/apiClient';
import type { CartItem, Address, Order } from '../services/apiClient';

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Bank Transfer' | 'Momo' | 'VNPay'>('COD');
  
  // Order Success state
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponAppliedMessage, setCouponAppliedMessage] = useState('');

  const currentUser = getCurrentUser() || { id: 'user_1', name: 'Marlin Watkin', email: 'marlinw25@gmail.com' };

  useEffect(() => {
    document.body.className = "";
    window.scrollTo(0, 0);
    
    // Load cart
    const cartItems = apiClient.getCart();
    setCart(cartItems);

    // Load addresses
    const fetchAddresses = async () => {
      try {
        const addr = await apiClient.getAddresses();
        setAddresses(addr);
        const def = addr.find(a => a.isDefault) || addr[0] || null;
        setSelectedAddress(def);
      } catch (e) {
        // Fallback mock address if not logged in
        const mockAddr: Address = {
          id: 'addr_1',
          name: 'Marlin Watkin (Home)',
          phone: '+4498456215',
          type: 'Home',
          addressLine: '123 Queens Road, Richmond, London, TW10 6HY',
          isDefault: true
        };
        setAddresses([mockAddr]);
        setSelectedAddress(mockAddr);
      }
    };
    
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (typeof (window as any).init_iconsax === 'function') {
      (window as any).init_iconsax();
    }
  }, [step]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'GOOGLE20') {
      setDiscountPercent(20);
      setCouponAppliedMessage('Coupon applied! 20% Discount.');
      setCouponError('');
    } else if (couponCode.trim() === '') {
      setCouponError('Please enter a coupon code.');
      setCouponAppliedMessage('');
    } else {
      setCouponError('Invalid coupon code.');
      setCouponAppliedMessage('');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please confirm your shipping address first.');
      return;
    }
    setLoading(true);

    const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCharge = 20;
    const discount = Math.round(subTotal * (discountPercent / 100));
    const grandTotal = subTotal + shippingCharge - discount;

    const orderData = {
      userId: currentUser.id,
      items: cart.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        color: item.color,
        size: item.size
      })),
      address: selectedAddress,
      paymentMethod,
      shippingCharge,
      discount,
      subTotal,
      grandTotal
    };

    try {
      const res = await apiClient.createOrder(orderData);
      if (res.success) {
        setPlacedOrder(res.order);
        setStep(3);
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred while placing order.');
    } finally {
      setLoading(false);
    }
  };

  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCharge = 20;
  const discount = Math.round(subTotal * (discountPercent / 100));
  const grandTotal = subTotal + shippingCharge - discount;

  // Step 1: Shipping Address Confirmation
  if (step === 1) {
    return (
      <>
        <header className="section-t-space">
          <div className="custom-container">
            <div className="header-panel">
              <a href="#/cart">
                <i className="iconsax back-btn" data-icon="arrow-left"></i>
              </a>
              <h3>Checkout - Step 1</h3>
            </div>
          </div>
        </header>

        <section>
          <div className="custom-container">
            <div className="address-section">
              <h2>Xác nhận địa chỉ giao hàng</h2>
              {addresses.map((addr) => (
                <div 
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr)}
                  className={`shipping-address p-3 mt-3 ${selectedAddress?.id === addr.id ? 'active-border' : ''}`}
                  style={{
                    border: selectedAddress?.id === addr.id ? '2px solid #ffc107' : '1px solid #203342',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    backgroundColor: '#183044',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                  }}
                >
                  <div className="address-icon" style={{
                    backgroundColor: selectedAddress?.id === addr.id ? '#ffc107' : '#203342',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="iconsax" data-icon="gps" style={{ color: selectedAddress?.id === addr.id ? '#000' : '#fff' }}></i>
                  </div>
                  <div className="address-details" style={{ flexGrow: 1 }}>
                    <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: '600' }}>{addr.name} ({addr.type})</h4>
                    <p style={{ color: '#9ba3aa', fontSize: '13px', margin: '2px 0 0' }}>{addr.addressLine}</p>
                    <p style={{ color: '#9ba3aa', fontSize: '13px', margin: '2px 0 0' }}>SĐT: {addr.phone}</p>
                  </div>
                </div>
              ))}
              
              <a href="#/new-address" className="btn btn-outline-warning w-100 mt-3" style={{ borderRadius: '10px' }}>
                + Thêm địa chỉ mới
              </a>
            </div>
          </div>
        </section>

        <section>
          <div className="custom-container">
            <div className="apply-coupon">
              <h2 className="theme-color">Apply Coupon</h2>
              <form onSubmit={handleApplyCoupon} className="d-flex gap-2 mt-2">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter code (Try GOOGLE20)" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{ backgroundColor: '#183044', border: 'none', borderRadius: '10px', color: '#fff', padding: '10px 15px' }}
                />
                <button type="submit" className="btn btn-warning" style={{ borderRadius: '10px', whiteSpace: 'nowrap' }}>Apply</button>
              </form>
              {couponError && <p className="text-danger mt-1" style={{ fontSize: '12px' }}>{couponError}</p>}
              {couponAppliedMessage && <p className="text-success mt-1" style={{ fontSize: '12px' }}>{couponAppliedMessage}</p>}
            </div>
          </div>
        </section>

        <section className="bill-details section-b-space">
          <div className="custom-container">
            <div className="total-detail" style={{ backgroundColor: '#183044', borderRadius: '12px', padding: '15px' }}>
              <div className="sub-total d-flex justify-content-between">
                <h5 className="light-text">Sub Total</h5>
                <h4 className="fw-medium text-white">${subTotal}</h4>
              </div>
              <div className="sub-total mt-3 d-flex justify-content-between">
                <h5 className="light-text">Shipping charge</h5>
                <h4 className="fw-medium text-white">${shippingCharge}</h4>
              </div>
              {discount > 0 && (
                <div className="sub-total mt-3 d-flex justify-content-between">
                  <h5 className="light-text text-success">Discount ({discountPercent}%)</h5>
                  <h4 className="fw-medium text-success">-${discount}</h4>
                </div>
              )}
              <hr style={{ borderColor: '#203342' }} />
              <div className="grand-total d-flex justify-content-between">
                <h5 className="fw-medium text-white">Grand Total</h5>
                <h4 className="fw-semibold amount text-warning">${grandTotal}</h4>
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              className="btn theme-btn w-100 mt-4"
              disabled={cart.length === 0}
            >
              Continue to Payment
            </button>
          </div>
        </section>
      </>
    );
  }

  // Step 2: Payment Method Selection
  if (step === 2) {
    return (
      <>
        <header className="section-t-space">
          <div className="custom-container">
            <div className="header-panel">
              <button 
                onClick={() => setStep(1)}
                style={{ background: 'none', border: 'none', padding: 0 }}
              >
                <i className="iconsax back-btn" data-icon="arrow-left"></i>
              </button>
              <h3>Checkout - Step 2</h3>
            </div>
          </div>
        </header>

        <section>
          <div className="custom-container">
            <h2>Chọn phương thức thanh toán</h2>
            <div className="payment-options mt-3">
              {[
                { id: 'COD', label: 'COD (Thanh toán khi nhận hàng)', icon: 'wallet-money', desc: 'Thanh toán tiền mặt khi shipper giao hàng.' },
                { id: 'Bank Transfer', label: 'Chuyển khoản Ngân hàng', icon: 'card', desc: 'Chuyển khoản tới tài khoản ngân hàng của cửa hàng.' },
                { id: 'Momo', label: 'Ví điện tử MoMo', icon: 'mobile', desc: 'Thanh toán nhanh qua ví điện tử MoMo.' },
                { id: 'VNPay', label: 'Cổng VNPay', icon: 'direct', desc: 'Thanh toán bằng thẻ ATM, thẻ tín dụng hoặc QR Pay.' }
              ].map(method => (
                <div 
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`payment-card p-3 mb-3 d-flex align-items-center gap-3`}
                  style={{
                    backgroundColor: '#183044',
                    border: paymentMethod === method.id ? '2px solid #ffc107' : '1px solid #203342',
                    borderRadius: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <div className="payment-icon" style={{
                    backgroundColor: paymentMethod === method.id ? '#ffc107' : '#203342',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {method.icon === 'wallet-money' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: paymentMethod === method.id ? '#000' : '#fff' }}>
                        <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                        <line x1="12" y1="18" x2="12" y2="18.01"></line>
                        <line x1="12" y1="6" x2="12" y2="6.01"></line>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                    {method.icon === 'card' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: paymentMethod === method.id ? '#000' : '#fff' }}>
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                      </svg>
                    )}
                    {method.icon === 'mobile' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: paymentMethod === method.id ? '#000' : '#fff' }}>
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                        <line x1="12" y1="18" x2="12" y2="18.01"></line>
                      </svg>
                    )}
                    {method.icon === 'direct' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: paymentMethod === method.id ? '#000' : '#fff' }}>
                        <polyline points="16 3 21 3 21 8"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                        <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"></path>
                      </svg>
                    )}
                  </div>
                  <div className="payment-text" style={{ flexGrow: 1 }}>
                    <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: '600', margin: 0 }}>{method.label}</h4>
                    <p style={{ color: '#9ba3aa', fontSize: '12px', margin: '2px 0 0' }}>{method.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Simulated Payment Detail based on choice */}
            {paymentMethod === 'Bank Transfer' && (
              <div className="card p-3 mt-4" style={{ backgroundColor: '#122636', border: '1px dashed #ffc107', borderRadius: '12px' }}>
                <h5 className="text-warning fw-semibold">Thông tin chuyển khoản</h5>
                <p className="text-white mt-2" style={{ fontSize: '13px', margin: '0' }}>Ngân hàng: **Vietcombank**</p>
                <p className="text-white" style={{ fontSize: '13px', margin: '2px 0 0' }}>Số tài khoản: **1023485743**</p>
                <p className="text-white" style={{ fontSize: '13px', margin: '2px 0 0' }}>Chủ tài khoản: **FUZZY SHOP**</p>
                <p className="text-white" style={{ fontSize: '13px', margin: '2px 0 0' }}>Số tiền: **${grandTotal}**</p>
                <p className="text-white" style={{ fontSize: '13px', margin: '2px 0 0' }}>Nội dung: **CK {currentUser.name}**</p>
              </div>
            )}

            {(paymentMethod === 'Momo' || paymentMethod === 'VNPay') && (
              <div className="card p-3 mt-4 text-center" style={{ backgroundColor: '#122636', border: '1px dashed #ffc107', borderRadius: '12px' }}>
                <h5 className="text-warning fw-semibold">Quét mã QR để thanh toán</h5>
                <div className="qr-container mx-auto my-3" style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '8px', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Mock QR code */}
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${paymentMethod === 'Momo' ? 'Momo-FuzzyShop-Payment' : 'VNPay-FuzzyShop-Payment'}`} alt="Payment QR" style={{ width: '130px', height: '130px' }} />
                </div>
                <p className="text-white-50" style={{ fontSize: '12px' }}>Quét mã QR bằng ứng dụng {paymentMethod} để thực hiện thanh toán</p>
              </div>
            )}
          </div>
        </section>

        <section className="bill-details section-b-space mt-4">
          <div className="custom-container">
            <div className="total-detail mb-3" style={{ backgroundColor: '#183044', borderRadius: '12px', padding: '15px' }}>
              <div className="sub-total d-flex justify-content-between">
                <h5 className="light-text">Giao hàng tới</h5>
                <h5 className="text-white text-end" style={{ maxWidth: '70%' }}>{selectedAddress?.addressLine}</h5>
              </div>
              <div className="sub-total mt-2 d-flex justify-content-between">
                <h5 className="light-text">Phương thức</h5>
                <h5 className="text-warning">{paymentMethod}</h5>
              </div>
              <hr style={{ borderColor: '#203342' }} />
              <div className="grand-total d-flex justify-content-between">
                <h5 className="fw-medium text-white">Tổng cộng</h5>
                <h4 className="fw-semibold amount text-warning">${grandTotal}</h4>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              className="btn theme-btn w-100"
              disabled={loading}
            >
              {loading ? 'Đang xử lý đặt hàng...' : `Đặt hàng (${paymentMethod === 'COD' ? 'Thanh toán COD' : 'Đã thanh toán'})`}
            </button>
          </div>
        </section>
      </>
    );
  }

  // Step 3: Success Screen
  return (
    <>
      <header className="section-t-space">
        <div className="custom-container">
          <div className="header-panel text-center">
            <h3>Đặt hàng thành công</h3>
          </div>
        </div>
      </header>

      <div className="custom-container text-center mt-5" style={{ paddingBottom: '80px' }}>
        <div className="empty-tab">
          <div className="success-icon-container mx-auto mb-4" style={{
            width: '100px',
            height: '100px',
            backgroundColor: '#198754',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(25, 135, 84, 0.4)'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 12.75L9.75 18L19.5 7.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h2 className="text-white fw-bold">Đặt hàng thành công!</h2>
          <h5 className="mt-3 light-text px-3">Cảm ơn bạn đã mua sắm tại Fuzzy. Đơn hàng của bạn đã được tiếp nhận và đang xử lý.</h5>

          <div className="order-details-box p-3 my-4 mx-3" style={{ backgroundColor: '#183044', borderRadius: '12px', textAlign: 'left' }}>
            <div className="d-flex justify-content-between mb-2">
              <span className="light-text">Mã đơn hàng:</span>
              <span className="text-warning fw-bold">{placedOrder?.id}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="light-text">Phương thức thanh toán:</span>
              <span className="text-white fw-medium">{placedOrder?.paymentMethod}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="light-text">Tổng tiền:</span>
              <span className="text-white fw-bold">${placedOrder?.grandTotal}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="light-text">Trạng thái:</span>
              <span className="badge bg-warning text-dark px-2 py-1">Chờ xác nhận</span>
            </div>
          </div>

          <div className="px-3">
            <a 
              href={`#/order-tracking?id=${placedOrder?.id}`} 
              className="btn btn-warning w-100 py-3 mb-3 fw-bold" 
              style={{ borderRadius: '12px' }}
            >
              Theo dõi đơn hàng (Timeline UI)
            </a>
            
            <a 
              href="#/order-history" 
              className="btn btn-outline-light w-100 py-3 mb-3" 
              style={{ borderRadius: '12px' }}
            >
              Xem lịch sử đơn hàng
            </a>

            <a 
              href="#/shop" 
              className="btn btn-link text-white-50 w-100"
            >
              Tiếp tục mua sắm
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
