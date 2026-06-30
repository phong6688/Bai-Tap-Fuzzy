import { useEffect, useState } from 'react';
import { apiClient, getCurrentUser } from '../services/apiClient';
import type { Order } from '../services/apiClient';

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const currentUser = getCurrentUser() || { id: 'user_1', name: 'Marlin Watkin', email: 'marlinw25@gmail.com' };

  const loadOrders = () => {
    const userOrders = apiClient.getOrders(currentUser.id);
    setOrders(userOrders);
  };

  useEffect(() => {
    document.body.className = "";
    window.scrollTo(0, 0);
    loadOrders();
  }, []);

  useEffect(() => {
    if (typeof (window as any).init_iconsax === 'function') {
      (window as any).init_iconsax();
    }
  }, [orders]);

  const filteredOrders = orders.filter(order => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    
    // Search by order code
    if (order.id.toLowerCase().includes(query)) return true;
    
    // Search by product name
    return order.items.some(item => item.name.toLowerCase().includes(query));
  });

  const getStatusClass = (status: Order['status']) => {
    switch (status) {
      case 'completed': return 'delivered'; // green status class in CSS
      case 'cancelled': return 'text-danger';
      default: return ''; // default status class is ongoing
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'preparing': return 'Đang chuẩn bị';
      case 'delivering': return 'Đang giao';
      case 'completed': return 'Đã giao hàng';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <>
      <header className="section-t-space">
        <div className="custom-container">
          <div className="header-panel">
            <a href="#/profile">
              <i className="iconsax back-btn" data-icon="arrow-left"></i>
            </a>
            <h3>Lịch sử đơn hàng</h3>
          </div>
        </div>
      </header>
      
      <section>
        <div className="custom-container">
          <div className="theme-form search-head">
            <div className="form-group">
              <div className="form-input w-100" style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-control search" 
                  placeholder="Tìm theo Mã đơn hàng hoặc Tên sản phẩm..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <i className="iconsax search-icon" data-icon="search-normal-2"></i>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="section-t-space" style={{ paddingBottom: '100px' }}>
        <div className="custom-container">
          <div className="row g-3">
            {filteredOrders.length === 0 ? (
              <div className="col-12 text-center mt-5">
                <div className="empty-tab">
                  <img className="img-fluid w-50" src="assets/images/gif/cart.gif" alt="empty" style={{ maxWidth: '120px', marginBottom: '20px' }} />
                  <h2>Không tìm thấy đơn hàng</h2>
                  <p className="light-text mt-2">Bạn chưa đặt đơn hàng nào hoặc từ khóa tìm kiếm không khớp.</p>
                  <a href="#/shop" className="btn theme-btn w-100 mt-4">Mua sắm ngay</a>
                </div>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="col-12">
                  <div className="order-product-box" style={{ backgroundColor: '#183044', borderRadius: '12px', overflow: 'hidden', padding: '15px', marginBottom: '15px' }}>
                    
                    {/* Items List inside Order */}
                    {order.items.map((item, idx) => (
                      <div key={idx} className="horizontal-product-box" style={{ borderBottom: idx < order.items.length - 1 ? '1px solid #203342' : 'none', paddingBottom: idx < order.items.length - 1 ? '10px' : '0', marginBottom: idx < order.items.length - 1 ? '10px' : '0', display: 'flex', gap: '15px' }}>
                        <div className="horizontal-product-img" style={{ width: '60px', height: '60px', flexShrink: 0 }}>
                          <img className="img-fluid img" src={item.image} alt={item.name} style={{ borderRadius: '8px', objectFit: 'cover', height: '100%', width: '100%' }} />
                        </div>
                        <div className="horizontal-product-details" style={{ flexGrow: 1 }}>
                          <div className="d-flex align-items-start justify-content-between gap-2">
                            <h4 style={{ fontSize: '14px', color: '#fff', fontWeight: '600', margin: 0 }}>{item.name}</h4>
                            <span style={{ fontSize: '12px', color: '#ffc107', fontWeight: 'bold' }}>${item.price}</span>
                          </div>
                          <ul className="product-info" style={{ display: 'flex', gap: '12px', padding: 0, margin: '4px 0 0', fontSize: '11px', color: '#9ba3aa' }}>
                            <li>SL: {item.quantity}</li>
                            <li>Màu: {item.color}</li>
                            <li>Size: {item.size}</li>
                          </ul>
                        </div>
                      </div>
                    ))}

                    <div className="order-details d-block mt-3" style={{ borderTop: '1px dashed #203342', paddingTop: '10px' }}>
                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="theme-color" style={{ fontSize: '13px', margin: 0 }}>
                          Mã: <span className="text-warning fw-bold">{order.id}</span>
                        </h5>
                        <span className={`product-status ${getStatusClass(order.status)}`} style={{ fontSize: '12px', fontWeight: 'bold' }}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      
                      <div className="d-flex align-items-center justify-content-between mt-2" style={{ fontSize: '12px' }}>
                        <span className="light-text">{new Date(order.createdAt).toLocaleDateString('vi-VN')} {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                        <a 
                          href={`#/order-tracking?id=${order.id}`} 
                          className="view-details text-warning fw-semibold"
                          style={{ textDecoration: 'none' }}
                        >
                          Chi tiết & Theo dõi →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
