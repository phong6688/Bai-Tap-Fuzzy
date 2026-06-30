import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { apiClient, getCurrentUser } from '../services/apiClient';
import type { Order } from '../services/apiClient';

export default function OrderTracking() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get('id');

  const [order, setOrder] = useState<Order | null>(null);
  const currentUser = getCurrentUser() || { id: 'user_1', name: 'Marlin Watkin', email: 'marlinw25@gmail.com' };

  useEffect(() => {
    document.body.className = "";
    window.scrollTo(0, 0);

    const orders = apiClient.getOrders(currentUser.id);
    const foundOrder = orderId ? orders.find(o => o.id === orderId) : orders[0];
    if (foundOrder) {
      setOrder(foundOrder);
    }
  }, [orderId]);

  useEffect(() => {
    if (typeof (window as any).init_iconsax === 'function') {
      (window as any).init_iconsax();
    }
  }, [order]);

  if (!order) {
    return (
      <>
        <header className="section-t-space">
          <div className="custom-container">
            <div className="header-panel">
              <a href="#/order-history">
                <i className="iconsax back-btn" data-icon="arrow-left"></i>
              </a>
              <h3>Order Tracker</h3>
            </div>
          </div>
        </header>
        
        <div className="custom-container text-center mt-5">
          <div className="empty-tab">
            <img className="img-fluid w-50" src="assets/images/gif/cart.gif" alt="empty" style={{ maxWidth: '120px', marginBottom: '20px' }} />
            <h2>Không tìm thấy đơn hàng</h2>
            <p className="light-text mt-2">Vui lòng quay lại Lịch sử đơn hàng để theo dõi.</p>
            <a href="#/order-history" className="btn theme-btn w-100 mt-4">Xem lịch sử đơn hàng</a>
          </div>
        </div>
      </>
    );
  }

  // Format creation date
  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' });
  const formattedTime = orderDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  // Calculate status steps
  const isPending = order.status === 'pending';
  const isPreparing = order.status === 'preparing';
  const isDelivering = order.status === 'delivering';
  const isCompleted = order.status === 'completed';
  const isCancelled = order.status === 'cancelled';

  return (
    <>
      <header className="section-t-space">
        <div className="custom-container">
          <div className="header-panel">
            <a href="#/order-history">
              <i className="iconsax back-btn" data-icon="arrow-left"></i>
            </a>
            <h3>Chi tiết đơn hàng</h3>
          </div>
        </div>
      </header>
      
      <section style={{ paddingBottom: '20px' }}>
        <div className="custom-container">
          <h4 className="light-text fw-normal">{formattedDate} lúc {formattedTime}</h4>
          <div className="order-id d-flex justify-content-between gap-2 mt-2" style={{ borderBottom: '1px dashed #203342', paddingBottom: '15px' }}>
            <h4 className="theme-color fw-medium" style={{ fontSize: '15px' }}>Mã đơn: <span className="text-warning fw-bold">{order.id}</span></h4>
            <h4 className="theme-color fw-semibold" style={{ fontSize: '15px' }}><span className="light-text fw-normal">Tổng:</span> ${order.grandTotal}</h4>
          </div>

          {/* Timeline UI */}
          <div className="order-tracking mt-4">
            <h2 className="mb-3 text-white">Hành trình đơn hàng</h2>
            
            {isCancelled ? (
              <div className="alert alert-danger p-3 d-flex align-items-center gap-3" style={{ borderRadius: '12px', backgroundColor: 'rgba(220, 53, 69, 0.1)' }}>
                <i className="iconsax" data-icon="close-circle" style={{ fontSize: '30px', color: '#dc3545' }}></i>
                <div>
                  <h4 className="text-danger fw-bold" style={{ margin: 0, fontSize: '15px' }}>Đơn hàng đã bị hủy</h4>
                  <p className="light-text mt-1" style={{ fontSize: '12px', margin: 0 }}>Đơn hàng này không còn được xử lý trong hệ thống.</p>
                </div>
              </div>
            ) : (
              <ul style={{ paddingLeft: '10px' }}>
                {/* Step 1: Info Received */}
                <li className={`order-process completed`}>
                  <div className="d-flex gap-3 w-100">
                    <span>
                      <img className="process-icon" src="assets/images/svg/chack.svg" alt="check" />
                    </span>
                    <div className="process-details">
                      <h4>Đã nhận thông tin đơn hàng</h4>
                      <h5>{formattedTime} | {formattedDate}</h5>
                    </div>
                  </div>
                </li>

                {/* Step 2: Preparing */}
                <li className={`order-process ${isPending ? 'ongoing' : 'completed'}`}>
                  <div className="d-flex gap-3 w-100">
                    {isPending ? (
                      <div className="ongoing-border">
                        <span>
                          <i className="iconsax process-icon" data-icon="box-time"></i>
                        </span>
                      </div>
                    ) : (
                      <span>
                        <img className="process-icon" src="assets/images/svg/chack.svg" alt="check" />
                      </span>
                    )}
                    <div className="process-details">
                      <h4>Đang chuẩn bị sản phẩm</h4>
                      <h5>{isPending ? 'Đang thực hiện...' : 'Hoàn thành'}</h5>
                    </div>
                  </div>
                </li>

                {/* Step 3: Delivering */}
                <li className={`order-process ${isPending ? '' : isPreparing ? 'ongoing' : 'completed'}`}>
                  <div className="d-flex gap-3 w-100">
                    {isPending ? (
                      <span>
                        <i className="iconsax pending-icon" data-icon="truck-fast"></i>
                      </span>
                    ) : isPreparing ? (
                      <div className="ongoing-border">
                        <span>
                          <i className="iconsax process-icon" data-icon="truck-fast"></i>
                        </span>
                      </div>
                    ) : (
                      <span>
                        <img className="process-icon" src="assets/images/svg/chack.svg" alt="check" />
                      </span>
                    )}
                    <div className="process-details">
                      <h4>Đang giao hàng</h4>
                      <h5>{isPending ? 'Chưa bắt đầu' : isPreparing ? 'Đang chuẩn bị vận chuyển...' : 'Shipper đang giao hàng'}</h5>
                    </div>
                  </div>
                </li>

                {/* Step 4: Completed */}
                <li className={`order-process ${isDelivering ? 'ongoing' : isCompleted ? 'completed' : ''}`}>
                  <div className="d-flex gap-3 w-100">
                    {isCompleted ? (
                      <span>
                        <img className="process-icon" src="assets/images/svg/chack.svg" alt="check" />
                      </span>
                    ) : isDelivering ? (
                      <div className="ongoing-border">
                        <span>
                          <i className="iconsax process-icon" data-icon="gift"></i>
                        </span>
                      </div>
                    ) : (
                      <span>
                        <i className="iconsax pending-icon" data-icon="gift"></i>
                      </span>
                    )}
                    <div className="process-details">
                      <h4>Đã nhận hàng thành công</h4>
                      <h5>{isCompleted ? 'Đã hoàn thành giao dịch' : 'Chưa hoàn thành'}</h5>
                    </div>
                  </div>
                </li>
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Ordered Products summary */}
      <section className="pt-0">
        <div className="custom-container">
          <h4 className="text-white mb-2 fw-semibold">Sản phẩm đã đặt</h4>
          <div className="row g-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="col-12">
                <div className="d-flex align-items-center gap-3 p-2" style={{ backgroundColor: '#183044', borderRadius: '10px' }}>
                  <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div style={{ flexGrow: 1 }}>
                    <h5 className="text-white fw-medium mb-0" style={{ fontSize: '13px' }}>{item.name}</h5>
                    <span className="light-text" style={{ fontSize: '11px' }}>Size: {item.size} | Màu: {item.color}</span>
                  </div>
                  <div className="text-end">
                    <span className="text-warning fw-medium" style={{ fontSize: '13px', display: 'block' }}>${item.price}</span>
                    <span className="light-text" style={{ fontSize: '11px' }}>x{item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Info & Summary */}
      <section className="pt-0">
        <div className="custom-container">
          <h4 className="text-white mb-2 fw-semibold">Địa chỉ giao hàng</h4>
          <div className="p-3" style={{ backgroundColor: '#183044', borderRadius: '12px' }}>
            <h5 className="text-white fw-bold mb-1" style={{ fontSize: '14px' }}>{order.address.name}</h5>
            <p className="light-text mb-1" style={{ fontSize: '13px' }}>SĐT: {order.address.phone}</p>
            <p className="light-text mb-0" style={{ fontSize: '13px' }}>{order.address.addressLine}</p>
          </div>
        </div>
      </section>
      
      <section className="bill-details section-b-space pt-0">
        <div className="custom-container">
          <div className="total-detail" style={{ backgroundColor: '#183044', borderRadius: '12px', padding: '15px' }}>
            <div className="sub-total d-flex justify-content-between">
              <h5 className="light-text">Tiền hàng</h5>
              <h4 className="fw-medium text-white">${order.subTotal}</h4>
            </div>
            <div className="sub-total mt-2 d-flex justify-content-between">
              <h5 className="light-text">Phí vận chuyển</h5>
              <h4 className="fw-medium text-white">${order.shippingCharge}</h4>
            </div>
            {order.discount > 0 && (
              <div className="sub-total mt-2 d-flex justify-content-between">
                <h5 className="light-text text-success">Giảm giá</h5>
                <h4 className="fw-medium text-success">-${order.discount}</h4>
              </div>
            )}
            <hr style={{ borderColor: '#203342' }} />
            <div className="grand-total d-flex justify-content-between">
              <h5 className="fw-medium text-white">Tổng thanh toán</h5>
              <h4 className="fw-semibold amount text-warning">${order.grandTotal}</h4>
            </div>
          </div>

          <a href="#/shop" className="btn theme-btn w-100 mt-4">Tiếp tục mua sắm</a>
        </div>
      </section>
    </>
  );
}
