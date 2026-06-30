import { useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient';
import type { Order, User, OrderItem } from '../services/apiClient';
import { productService } from '../services/productService';
import type { Product } from '../services/productService';
import { getAssetPath } from '../utils/assetHelper';

export default function Admin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'products' | 'customers'>('orders');

  // Product form states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState(0);
  const [formOrigPrice, setFormOrigPrice] = useState(0);
  const [formCategoryId, setFormCategoryId] = useState('cat_1');
  const [formStock, setFormStock] = useState(10);
  const [formImage, setFormImage] = useState('/assets/images/product/1.png');
  const [formColors, setFormColors] = useState<string[]>(['Beige']);
  const [formSizes, setFormSizes] = useState<string[]>(['M']);

  // Customer management states
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [userFormName, setUserFormName] = useState('');
  const [userFormEmail, setUserFormEmail] = useState('');
  const [userFormPhone, setUserFormPhone] = useState('');
  const [userFormDob, setUserFormDob] = useState('');
  const [userFormPassword, setUserFormPassword] = useState('');

  // Order Customer address edit states
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showOrderAddressForm, setShowOrderAddressForm] = useState(false);
  const [orderAddressName, setOrderAddressName] = useState('');
  const [orderAddressPhone, setOrderAddressPhone] = useState('');
  const [orderAddressLine, setOrderAddressLine] = useState('');

  // Order Items editing states
  const [editingOrderItems, setEditingOrderItems] = useState<Order | null>(null);
  const [showOrderItemsForm, setShowOrderItemsForm] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderShippingCharge, setOrderShippingCharge] = useState(0);
  const [orderDiscount, setOrderDiscount] = useState(0);

  // States for adding a new product to an existing order
  const [selectedAddProduct, setSelectedAddProduct] = useState<Product | null>(null);
  const [selectedAddColor, setSelectedAddColor] = useState('');
  const [selectedAddSize, setSelectedAddSize] = useState('');
  const [selectedAddQty, setSelectedAddQty] = useState(1);

  const loadData = () => {
    // Get all orders from apiClient
    const allOrders = apiClient.getOrders();
    setOrders(allOrders);

    // Get all products from productService to show inventory
    const allProds = productService.getProducts({ limit: 100 }).products;
    setProducts(allProds);

    // Get all users from apiClient
    const allUsers = apiClient.getUsers();
    setUsers(allUsers);
  };

  useEffect(() => {
    document.body.className = "";
    window.scrollTo(0, 0);
    loadData();
  }, []);

  useEffect(() => {
    if (typeof (window as any).init_iconsax === 'function') {
      (window as any).init_iconsax();
    }
  }, [orders, activeTab, showProductForm, showUserForm, showOrderAddressForm, showOrderItemsForm]);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    apiClient.updateOrderStatus(orderId, newStatus);
    loadData();
  };

  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-warning text-dark';
      case 'preparing': return 'bg-info text-white';
      case 'delivering': return 'bg-primary text-white';
      case 'completed': return 'bg-success text-white';
      case 'cancelled': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'preparing': return 'Đang chuẩn bị';
      case 'delivering': return 'Đang giao';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getCategoryName = (catId: string) => {
    switch (catId) {
      case 'cat_1': return 'Chairs (Ghế)';
      case 'cat_2': return 'Sofas (Sofa)';
      case 'cat_3': return 'Tables (Bàn)';
      case 'cat_4': return 'Lamps (Đèn)';
      case 'cat_5': return 'Beds (Giường)';
      default: return catId;
    }
  };

  // User CRUD Handlers
  const handleAddUserClick = () => {
    setEditingUser(null);
    setUserFormName('');
    setUserFormEmail('');
    setUserFormPhone('');
    setUserFormDob('');
    setUserFormPassword('password123'); // Default password
    setShowUserForm(true);
  };

  const handleEditUserClick = (user: User) => {
    setEditingUser(user);
    setUserFormName(user.name);
    setUserFormEmail(user.email);
    setUserFormPhone(user.phone);
    setUserFormDob(user.dob || '');
    setUserFormPassword(''); // Keep current password if empty
    setShowUserForm(true);
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      apiClient.deleteUser(id);
      loadData();
    }
  };

  const handleSaveUser = () => {
    if (!userFormName.trim() || !userFormEmail.trim()) {
      alert('Vui lòng điền đầy đủ Tên và Email!');
      return;
    }

    const userData: any = {
      name: userFormName,
      email: userFormEmail,
      phone: userFormPhone,
      dob: userFormDob,
    };

    if (userFormPassword) {
      userData.password = userFormPassword;
    }

    if (editingUser) {
      apiClient.updateUser(editingUser.id, userData);
    } else {
      apiClient.addUser(userData);
    }

    setShowUserForm(false);
    loadData();
  };

  // Order Address Handlers
  const handleEditOrderAddressClick = (order: Order) => {
    setEditingOrder(order);
    setOrderAddressName(order.address.name);
    setOrderAddressPhone(order.address.phone);
    setOrderAddressLine(order.address.addressLine);
    setShowOrderAddressForm(true);
  };

  const handleSaveOrderAddress = () => {
    if (!editingOrder) return;
    if (!orderAddressName.trim() || !orderAddressPhone.trim() || !orderAddressLine.trim()) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng!');
      return;
    }

    apiClient.updateOrderAddress(editingOrder.id, {
      name: orderAddressName,
      phone: orderAddressPhone,
      addressLine: orderAddressLine
    });

    setShowOrderAddressForm(false);
    setEditingOrder(null);
    loadData();
  };

  const handleDeleteOrder = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      apiClient.deleteOrder(id);
      loadData();
    }
  };

  // Order Items Handlers
  const handleEditOrderItemsClick = (order: Order) => {
    setEditingOrderItems(order);
    setOrderItems([...order.items]);
    setOrderShippingCharge(order.shippingCharge);
    setOrderDiscount(order.discount);
    
    // Reset product add states
    setSelectedAddProduct(null);
    setSelectedAddColor('');
    setSelectedAddSize('');
    setSelectedAddQty(1);
    
    setShowOrderItemsForm(true);
  };

  const handleUpdateOrderItemQty = (index: number, newQty: number) => {
    const updated = [...orderItems];
    updated[index].quantity = Math.max(1, newQty);
    setOrderItems(updated);
  };

  const handleRemoveOrderItem = (index: number) => {
    const updated = orderItems.filter((_, idx) => idx !== index);
    setOrderItems(updated);
  };

  const handleAddProductToOrder = () => {
    if (!selectedAddProduct) {
      alert('Vui lòng chọn sản phẩm!');
      return;
    }
    if (!selectedAddColor) {
      alert('Vui lòng chọn màu sắc!');
      return;
    }
    if (!selectedAddSize) {
      alert('Vui lòng chọn kích thước!');
      return;
    }

    // Check if item already exists in the order
    const existingIndex = orderItems.findIndex(
      item => item.productId === selectedAddProduct.id && 
              item.color === selectedAddColor && 
              item.size === selectedAddSize
    );

    if (existingIndex !== -1) {
      const updated = [...orderItems];
      updated[existingIndex].quantity += selectedAddQty;
      setOrderItems(updated);
    } else {
      const newItem: OrderItem = {
        productId: selectedAddProduct.id,
        name: selectedAddProduct.name,
        price: selectedAddProduct.price,
        image: selectedAddProduct.image,
        quantity: selectedAddQty,
        color: selectedAddColor,
        size: selectedAddSize
      };
      setOrderItems([...orderItems, newItem]);
    }

    // Reset add state
    setSelectedAddProduct(null);
    setSelectedAddColor('');
    setSelectedAddSize('');
    setSelectedAddQty(1);
  };

  const handleSaveOrderItems = () => {
    if (!editingOrderItems) return;
    if (orderItems.length === 0) {
      alert('Đơn hàng phải có ít nhất 1 sản phẩm!');
      return;
    }

    // Calculate totals
    const subTotal = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const grandTotal = Math.max(0, subTotal + orderShippingCharge - orderDiscount);

    apiClient.updateOrder(editingOrderItems.id, {
      items: orderItems,
      subTotal,
      grandTotal,
      shippingCharge: orderShippingCharge,
      discount: orderDiscount
    });

    setShowOrderItemsForm(false);
    setEditingOrderItems(null);
    loadData();
  };

  // Product CRUD Handlers
  const handleAddProductClick = () => {
    setEditingProduct(null);
    setFormName('');
    setFormDesc('');
    setFormPrice(10);
    setFormOrigPrice(15);
    setFormCategoryId('cat_1');
    setFormStock(10);
    setFormImage('/assets/images/product/1.png');
    setFormColors(['Beige']);
    setFormSizes(['M']);
    setShowProductForm(true);
  };

  const handleEditProductClick = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormDesc(prod.description);
    setFormPrice(prod.price);
    setFormOrigPrice(prod.originalPrice);
    setFormCategoryId(prod.categoryId);
    setFormStock(prod.stock);
    setFormImage(prod.image);
    setFormColors(prod.colors);
    setFormSizes(prod.sizes);
    setShowProductForm(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi cửa hàng?')) {
      productService.deleteProduct(id, true); // hard delete from LocalStorage
      loadData();
    }
  };

  const handleSaveProduct = () => {
    if (!formName.trim() || !formDesc.trim() || !formImage.trim()) {
      alert('Vui lòng điền đầy đủ Tên, Mô tả và Đường dẫn ảnh sản phẩm!');
      return;
    }

    const productData = {
      name: formName,
      description: formDesc,
      price: Number(formPrice),
      originalPrice: Number(formOrigPrice),
      categoryId: formCategoryId,
      stock: Number(formStock),
      image: formImage,
      colors: formColors,
      sizes: formSizes,
      rating: editingProduct ? editingProduct.rating : 4.5,
      status: (editingProduct ? editingProduct.status : 'active') as 'active' | 'hidden'
    };

    if (editingProduct) {
      productService.updateProduct(editingProduct.id, productData);
    } else {
      productService.addProduct(productData);
    }

    setShowProductForm(false);
    loadData();
  };

  return (
    <>
      <header className="section-t-space">
        <div className="custom-container">
          <div className="header-panel d-flex justify-content-between align-items-center">
            <a href="#/landing">
              <i className="iconsax back-btn" data-icon="arrow-left"></i>
            </a>
            <h3>Admin Dashboard</h3>
            <div style={{ width: '24px' }}></div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <section className="pt-3 pb-0">
        <div className="custom-container">
          <div className="d-flex flex-wrap gap-2" style={{ borderBottom: '1px solid #203342', paddingBottom: '10px' }}>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`btn btn-sm ${activeTab === 'orders' ? 'btn-warning text-dark fw-bold' : 'btn-outline-light text-white'}`}
              style={{ flexGrow: 1, borderRadius: '8px', padding: '8px', fontSize: '11px' }}
            >
              Đơn hàng ({orders.length})
            </button>
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`btn btn-sm ${activeTab === 'inventory' ? 'btn-warning text-dark fw-bold' : 'btn-outline-light text-white'}`}
              style={{ flexGrow: 1, borderRadius: '8px', padding: '8px', fontSize: '11px' }}
            >
              Kho hàng ({products.length})
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`btn btn-sm ${activeTab === 'products' ? 'btn-warning text-dark fw-bold' : 'btn-outline-light text-white'}`}
              style={{ flexGrow: 1, borderRadius: '8px', padding: '8px', fontSize: '11px' }}
            >
              Sản phẩm
            </button>
            <button 
              onClick={() => setActiveTab('customers')}
              className={`btn btn-sm ${activeTab === 'customers' ? 'btn-warning text-dark fw-bold' : 'btn-outline-light text-white'}`}
              style={{ flexGrow: 1, borderRadius: '8px', padding: '8px', fontSize: '11px' }}
            >
              Khách hàng ({users.length})
            </button>
          </div>
        </div>
      </section>

      {activeTab === 'orders' && (
        <section className="section-b-space" style={{ paddingBottom: '100px' }}>
          <div className="custom-container">
            <h2 className="text-white mb-3" style={{ fontSize: '16px' }}>Danh sách đơn hàng đặt</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-5">
                <p className="light-text">Chưa có đơn hàng nào được đặt.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div 
                  key={order.id} 
                  className="card p-3 mb-3" 
                  style={{ backgroundColor: '#183044', border: '1px solid #203342', borderRadius: '12px' }}
                >
                  {/* Order Header Info */}
                  <div className="d-flex justify-content-between align-items-start mb-2 pb-2" style={{ borderBottom: '1px dashed #203342' }}>
                    <div>
                      <h4 className="text-warning fw-bold" style={{ fontSize: '14px', margin: 0 }}>Đơn: {order.id}</h4>
                      <p className="light-text mb-0" style={{ fontSize: '11px' }}>
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')} {new Date(order.createdAt).toLocaleTimeString('vi-VN')}
                      </p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className={`badge ${getStatusBadgeClass(order.status)} px-2 py-1`} style={{ fontSize: '11px' }}>
                        {getStatusLabel(order.status)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(order.id)}
                        className="btn btn-sm btn-outline-danger p-0 d-flex align-items-center justify-content-center"
                        style={{ width: '24px', height: '24px', borderRadius: '6px' }}
                        title="Xóa đơn hàng"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Customer details */}
                  <div className="mb-2 p-2" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '12px' }}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <p className="text-white mb-1"><strong className="light-text">Khách hàng:</strong> {order.address.name}</p>
                        <p className="text-white-50 mb-1"><strong className="light-text">SĐT:</strong> {order.address.phone}</p>
                        <p className="text-white-50 mb-0"><strong className="light-text">Địa chỉ:</strong> {order.address.addressLine}</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleEditOrderAddressClick(order)}
                        className="btn btn-sm btn-outline-warning text-warning"
                        style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '6px' }}
                      >
                        Sửa
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="my-2 p-2" style={{ backgroundColor: '#122636', borderRadius: '8px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2 pb-1" style={{ borderBottom: '1px solid #203342' }}>
                      <span className="light-text" style={{ fontSize: '11px', fontWeight: 'bold' }}>Sản phẩm đã mua:</span>
                      <button 
                        type="button"
                        onClick={() => handleEditOrderItemsClick(order)}
                        className="btn btn-sm btn-outline-warning text-warning"
                        style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}
                      >
                        Sửa sản phẩm
                      </button>
                    </div>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: '11px', borderBottom: idx < order.items.length - 1 ? '1px solid #203342' : 'none', paddingBottom: idx < order.items.length - 1 ? '5px' : '0' }}>
                        <span className="text-white">{item.name} ({item.color}, {item.size}) <span className="light-text">x{item.quantity}</span></span>
                        <span className="text-warning">${item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Payment Info */}
                  <div className="d-flex justify-content-between align-items-center mb-3" style={{ fontSize: '12px' }}>
                    <span className="light-text">Thanh toán: <strong className="text-white">{order.paymentMethod}</strong></span>
                    <span className="text-white fw-bold">Tổng cộng: <strong className="text-warning">${order.grandTotal}</strong></span>
                  </div>

                  {/* Update Status Buttons */}
                  <div className="order-actions">
                    <label className="light-text d-block mb-1" style={{ fontSize: '11px' }}>Cập nhật trạng thái:</label>
                    <div className="d-flex flex-wrap gap-1">
                      {[
                        { status: 'pending', label: 'Xác nhận' },
                        { status: 'preparing', label: 'Chuẩn bị' },
                        { status: 'delivering', label: 'Giao hàng' },
                        { status: 'completed', label: 'Xong' },
                        { status: 'cancelled', label: 'Hủy' }
                      ].map(action => (
                        <button
                          key={action.status}
                          onClick={() => handleStatusChange(order.id, action.status as any)}
                          className={`btn btn-sm ${order.status === action.status ? 'btn-warning' : 'btn-outline-light'}`}
                          style={{
                            fontSize: '10px',
                            padding: '3px 6px',
                            borderRadius: '4px',
                            flexGrow: 1
                          }}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        </section>
      )}

      {activeTab === 'inventory' && (
        <section className="section-b-space" style={{ paddingBottom: '100px' }}>
          <div className="custom-container">
            <h2 className="text-white mb-3" style={{ fontSize: '16px' }}>Số lượng tồn kho sản phẩm</h2>
            <div className="card p-3" style={{ backgroundColor: '#183044', border: '1px solid #203342', borderRadius: '12px' }}>
              <div className="table-responsive">
                <table className="table table-dark table-hover mb-0" style={{ fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th>Ảnh</th>
                      <th>Sản phẩm</th>
                      <th className="text-center">Số lượng tồn</th>
                      <th>Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(prod => (
                      <tr key={prod.id}>
                        <td>
                          <img src={getAssetPath(prod.image)} alt={prod.name} style={{ width: '35px', height: '35px', objectFit: 'cover', borderRadius: '4px' }} />
                        </td>
                        <td>
                          <strong className="text-white d-block">{prod.name}</strong>
                          <span className="light-text" style={{ fontSize: '10px' }}>ID: {prod.id}</span>
                        </td>
                        <td className="text-center">
                          <span className={`badge ${prod.stock <= 5 ? 'bg-danger' : prod.stock <= 12 ? 'bg-warning text-dark' : 'bg-success'} px-2 py-1`}>
                            {prod.stock} cái
                          </span>
                        </td>
                        <td className="text-warning">${prod.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'products' && (
        <section className="section-b-space" style={{ paddingBottom: '100px' }}>
          <div className="custom-container">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="text-white m-0" style={{ fontSize: '16px' }}>Danh sách sản phẩm</h2>
              <button 
                type="button" 
                onClick={handleAddProductClick}
                className="btn btn-warning text-dark btn-sm fw-bold d-flex align-items-center gap-1"
                style={{ borderRadius: '8px', padding: '6px 12px', fontSize: '12px' }}
              >
                <i className="iconsax" data-icon="add" style={{ fontSize: '14px' }}></i>
                Thêm mới
              </button>
            </div>

            <div className="card p-3" style={{ backgroundColor: '#183044', border: '1px solid #203342', borderRadius: '12px' }}>
              <div className="table-responsive">
                <table className="table table-dark table-hover mb-0" style={{ fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th>Ảnh</th>
                      <th>Sản phẩm</th>
                      <th>Danh mục</th>
                      <th>Giá/Kho</th>
                      <th className="text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(prod => (
                      <tr key={prod.id}>
                        <td>
                          <img src={getAssetPath(prod.image)} alt={prod.name} style={{ width: '35px', height: '35px', objectFit: 'cover', borderRadius: '4px' }} />
                        </td>
                        <td>
                          <strong className="text-white d-block" style={{ fontSize: '12px' }}>{prod.name}</strong>
                          <span className="light-text" style={{ fontSize: '9px' }}>ID: {prod.id}</span>
                        </td>
                        <td>
                          <span className="light-text">{getCategoryName(prod.categoryId)}</span>
                        </td>
                        <td>
                          <span className="text-warning d-block">${prod.price}</span>
                          <span className="light-text" style={{ fontSize: '10px' }}>Tồn: {prod.stock}</span>
                        </td>
                        <td className="text-center">
                          <div className="d-flex gap-1 justify-content-center">
                            <button 
                              type="button" 
                              onClick={() => handleEditProductClick(prod)}
                              className="btn btn-sm btn-outline-info"
                              style={{ padding: '3px 6px', fontSize: '10px', borderRadius: '4px' }}
                            >
                              Sửa
                            </button>
                            <button 
                              type="button" 
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="btn btn-sm btn-outline-danger"
                              style={{ padding: '3px 6px', fontSize: '10px', borderRadius: '4px' }}
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PRODUCT FORM BOTTOM DRAWER */}
      {showProductForm && (
        <div 
          className="offcanvas-backdrop fade show" 
          style={{ zIndex: 1040 }} 
          onClick={() => setShowProductForm(false)}
        ></div>
      )}

      {showProductForm && (
        <div 
          className="offcanvas offcanvas-bottom show" 
          tabIndex={-1} 
          style={{ 
            visibility: 'visible', 
            transform: 'translate(-50%, 0)', 
            transition: 'transform 0.3s ease-in-out, visibility 0.3s',
            backgroundColor: '#122636',
            borderTopLeftRadius: '25px',
            borderTopRightRadius: '25px',
            height: 'auto',
            maxHeight: '90%',
            width: '100%',
            maxWidth: '600px',
            position: 'fixed',
            bottom: 0,
            left: '50%',
            zIndex: 1050,
            padding: '20px',
            boxShadow: '0 -5px 25px rgba(0,0,0,0.6)',
            transformOrigin: 'bottom center'
          }}
        >
          <div className="d-flex justify-content-between align-items-center pb-2 mb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h4 className="text-white fw-bold m-0" style={{ fontSize: '15px' }}>{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h4>
            <button type="button" className="btn-close btn-close-white" onClick={() => setShowProductForm(false)} style={{ padding: '4px' }}></button>
          </div>
          
          <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '5px' }}>
            <div className="mb-2">
              <label className="text-white-50 form-label mb-1" style={{ fontSize: '11px' }}>Tên sản phẩm</label>
              <input type="text" className="form-control bg-dark text-white border-secondary" style={{ fontSize: '12px', padding: '6px' }} value={formName} onChange={(e) => setFormName(e.target.value)} required />
            </div>
            
            <div className="mb-2">
              <label className="text-white-50 form-label mb-1" style={{ fontSize: '11px' }}>Mô tả sản phẩm</label>
              <textarea className="form-control bg-dark text-white border-secondary" style={{ fontSize: '12px', padding: '6px' }} value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={2} required />
            </div>

            <div className="row">
              <div className="col-6 mb-2">
                <label className="text-white-50 form-label mb-1" style={{ fontSize: '11px' }}>Giá bán ($)</label>
                <input type="number" className="form-control bg-dark text-white border-secondary" style={{ fontSize: '12px', padding: '6px' }} value={formPrice} onChange={(e) => setFormPrice(Number(e.target.value))} min={0} required />
              </div>
              <div className="col-6 mb-2">
                <label className="text-white-50 form-label mb-1" style={{ fontSize: '11px' }}>Giá gốc ($)</label>
                <input type="number" className="form-control bg-dark text-white border-secondary" style={{ fontSize: '12px', padding: '6px' }} value={formOrigPrice} onChange={(e) => setFormOrigPrice(Number(e.target.value))} min={0} required />
              </div>
            </div>

            <div className="row">
              <div className="col-6 mb-2">
                <label className="text-white-50 form-label mb-1" style={{ fontSize: '11px' }}>Danh mục</label>
                <select className="form-select bg-dark text-white border-secondary" style={{ fontSize: '12px', padding: '6px' }} value={formCategoryId} onChange={(e) => setFormCategoryId(e.target.value)}>
                  <option value="cat_1">Chairs (Ghế)</option>
                  <option value="cat_2">Sofas (Sofa)</option>
                  <option value="cat_3">Tables (Bàn)</option>
                  <option value="cat_4">Lamps (Đèn)</option>
                  <option value="cat_5">Beds (Giường)</option>
                </select>
              </div>
              <div className="col-6 mb-2">
                <label className="text-white-50 form-label mb-1" style={{ fontSize: '11px' }}>Tồn kho</label>
                <input type="number" className="form-control bg-dark text-white border-secondary" style={{ fontSize: '12px', padding: '6px' }} value={formStock} onChange={(e) => setFormStock(Number(e.target.value))} min={0} required />
              </div>
            </div>

            <div className="mb-2">
              <label className="text-white-50 form-label mb-1" style={{ fontSize: '11px' }}>Đường dẫn ảnh sản phẩm</label>
              <input type="text" className="form-control bg-dark text-white border-secondary" style={{ fontSize: '12px', padding: '6px' }} value={formImage} onChange={(e) => setFormImage(e.target.value)} required />
              <div className="form-text text-white-50" style={{ fontSize: '10px', marginTop: '2px' }}>Ví dụ: assets/images/product/1.png</div>
            </div>

            {/* Colors selection */}
            <div className="mb-2">
              <label className="text-white-50 form-label mb-1 d-block" style={{ fontSize: '11px' }}>Màu sắc (Colors)</label>
              <div className="d-flex flex-wrap gap-1">
                {['Beige', 'Blue', 'Grey', 'Black', 'Brown', 'White'].map(c => {
                  const isChecked = formColors.includes(c);
                  return (
                    <button 
                      key={c}
                      type="button" 
                      onClick={() => {
                        if (isChecked) {
                          setFormColors(formColors.filter(item => item !== c));
                        } else {
                          setFormColors([...formColors, c]);
                        }
                      }}
                      className={`btn btn-sm ${isChecked ? 'btn-warning text-dark' : 'btn-outline-secondary text-white'}`}
                      style={{ fontSize: '10px', padding: '3px 6px', borderRadius: '4px' }}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sizes selection */}
            <div className="mb-3">
              <label className="text-white-50 form-label mb-1 d-block" style={{ fontSize: '11px' }}>Kích thước (Sizes)</label>
              <div className="d-flex flex-wrap gap-1">
                {['S', 'M', 'L', 'XL'].map(s => {
                  const isChecked = formSizes.includes(s);
                  return (
                    <button 
                      key={s}
                      type="button" 
                      onClick={() => {
                        if (isChecked) {
                          setFormSizes(formSizes.filter(item => item !== s));
                        } else {
                          setFormSizes([...formSizes, s]);
                        }
                      }}
                      className={`btn btn-sm ${isChecked ? 'btn-warning text-dark' : 'btn-outline-secondary text-white'}`}
                      style={{ fontSize: '10px', padding: '3px 6px', borderRadius: '4px' }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-2">
            <button 
              type="button" 
              onClick={handleSaveProduct}
              className="btn btn-warning w-100 py-2 text-dark fw-bold"
              style={{ borderRadius: '8px', fontSize: '13px' }}
            >
              {editingProduct ? 'Cập nhật sản phẩm' : 'Thêm mới sản phẩm'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'customers' && (
        <section className="section-b-space" style={{ paddingBottom: '100px' }}>
          <div className="custom-container">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="text-white m-0" style={{ fontSize: '16px' }}>Danh sách khách hàng</h2>
              <button 
                type="button" 
                onClick={handleAddUserClick}
                className="btn btn-warning text-dark btn-sm fw-bold d-flex align-items-center gap-1"
                style={{ borderRadius: '8px', padding: '6px 12px', fontSize: '12px' }}
              >
                <i className="iconsax" data-icon="add" style={{ fontSize: '14px' }}></i>
                Thêm mới
              </button>
            </div>

            <div className="card p-3" style={{ backgroundColor: '#183044', border: '1px solid #203342', borderRadius: '12px' }}>
              <div className="table-responsive">
                <table className="table table-dark table-hover mb-0" style={{ fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th>Ảnh</th>
                      <th>Khách hàng</th>
                      <th>Email/SĐT</th>
                      <th>Ngày sinh</th>
                      <th className="text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>
                          <img src={getAssetPath(u.avatar || '/assets/images/icons/profile1.png')} alt={u.name} style={{ width: '35px', height: '35px', objectFit: 'cover', borderRadius: '50%' }} />
                        </td>
                        <td>
                          <strong className="text-white d-block" style={{ fontSize: '12px' }}>{u.name}</strong>
                          <span className="light-text" style={{ fontSize: '9px' }}>ID: {u.id}</span>
                        </td>
                        <td>
                          <span className="text-warning d-block" style={{ fontSize: '11px' }}>{u.email}</span>
                          <span className="light-text" style={{ fontSize: '10px' }}>SĐT: {u.phone || 'Chưa cập nhật'}</span>
                        </td>
                        <td>
                          <span className="light-text">{u.dob ? new Date(u.dob).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</span>
                        </td>
                        <td className="text-center">
                          <div className="d-flex gap-1 justify-content-center">
                            <button 
                              type="button" 
                              onClick={() => handleEditUserClick(u)}
                              className="btn btn-sm btn-outline-info"
                              style={{ padding: '3px 6px', fontSize: '10px', borderRadius: '4px' }}
                            >
                              Sửa
                            </button>
                            <button 
                              type="button" 
                              onClick={() => handleDeleteUser(u.id)}
                              className="btn btn-sm btn-outline-danger"
                              style={{ padding: '3px 6px', fontSize: '10px', borderRadius: '4px' }}
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* USER FORM BOTTOM DRAWER */}
      {showUserForm && (
        <div 
          className="offcanvas-backdrop fade show" 
          style={{ zIndex: 1040 }} 
          onClick={() => setShowUserForm(false)}
        ></div>
      )}

      {showUserForm && (
        <div 
          className="offcanvas offcanvas-bottom show" 
          tabIndex={-1} 
          style={{ 
            visibility: 'visible', 
            transform: 'translate(-50%, 0)', 
            transition: 'transform 0.3s ease-in-out, visibility 0.3s',
            backgroundColor: '#122636',
            borderTopLeftRadius: '25px',
            borderTopRightRadius: '25px',
            height: 'auto',
            maxHeight: '90%',
            width: '100%',
            maxWidth: '600px',
            position: 'fixed',
            bottom: 0,
            left: '50%',
            zIndex: 1050,
            padding: '20px',
            boxShadow: '0 -5px 25px rgba(0,0,0,0.6)',
            transformOrigin: 'bottom center'
          }}
        >
          <div className="d-flex justify-content-between align-items-center pb-2 mb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h4 className="text-white fw-bold m-0" style={{ fontSize: '15px' }}>{editingUser ? 'Sửa thông tin khách hàng' : 'Thêm khách hàng mới'}</h4>
            <button type="button" className="btn-close btn-close-white" onClick={() => setShowUserForm(false)} style={{ padding: '4px' }}></button>
          </div>
          
          <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '5px' }}>
            <div className="mb-2">
              <label className="text-white-50 form-label mb-1" style={{ fontSize: '11px' }}>Họ và tên</label>
              <input type="text" className="form-control bg-dark text-white border-secondary" style={{ fontSize: '12px', padding: '6px' }} value={userFormName} onChange={(e) => setUserFormName(e.target.value)} required />
            </div>
            
            <div className="mb-2">
              <label className="text-white-50 form-label mb-1" style={{ fontSize: '11px' }}>Email</label>
              <input type="email" className="form-control bg-dark text-white border-secondary" style={{ fontSize: '12px', padding: '6px' }} value={userFormEmail} onChange={(e) => setUserFormEmail(e.target.value)} required />
            </div>

            <div className="mb-2">
              <label className="text-white-50 form-label mb-1" style={{ fontSize: '11px' }}>Số điện thoại</label>
              <input type="text" className="form-control bg-dark text-white border-secondary" style={{ fontSize: '12px', padding: '6px' }} value={userFormPhone} onChange={(e) => setUserFormPhone(e.target.value)} />
            </div>

            <div className="mb-2">
              <label className="text-white-50 form-label mb-1" style={{ fontSize: '11px' }}>Ngày sinh</label>
              <input type="date" className="form-control bg-dark text-white border-secondary" style={{ fontSize: '12px', padding: '6px' }} value={userFormDob} onChange={(e) => setUserFormDob(e.target.value)} />
            </div>

            {(!editingUser || userFormPassword !== '') && (
              <div className="mb-3">
                <label className="text-white-50 form-label mb-1" style={{ fontSize: '11px' }}>Mật khẩu {editingUser && '(Để trống nếu không đổi)'}</label>
                <input type="password" placeholder={editingUser ? '••••••••' : ''} className="form-control bg-dark text-white border-secondary" style={{ fontSize: '12px', padding: '6px' }} value={userFormPassword} onChange={(e) => setUserFormPassword(e.target.value)} />
              </div>
            )}
          </div>

          <div className="mt-2">
            <button 
              type="button" 
              onClick={handleSaveUser}
              className="btn btn-warning w-100 py-2 text-dark fw-bold"
              style={{ borderRadius: '8px', fontSize: '13px' }}
            >
              {editingUser ? 'Cập nhật khách hàng' : 'Thêm mới khách hàng'}
            </button>
          </div>
        </div>
      )}

      {/* ORDER ADDRESS EDIT BOTTOM DRAWER */}
      {showOrderAddressForm && (
        <div 
          className="offcanvas-backdrop fade show" 
          style={{ zIndex: 1040 }} 
          onClick={() => { setShowOrderAddressForm(false); setEditingOrder(null); }}
        ></div>
      )}

      {showOrderAddressForm && (
        <div 
          className="offcanvas offcanvas-bottom show" 
          tabIndex={-1} 
          style={{ 
            visibility: 'visible', 
            transform: 'translate(-50%, 0)', 
            transition: 'transform 0.3s ease-in-out, visibility 0.3s',
            backgroundColor: '#122636',
            borderTopLeftRadius: '25px',
            borderTopRightRadius: '25px',
            height: 'auto',
            maxHeight: '90%',
            width: '100%',
            maxWidth: '600px',
            position: 'fixed',
            bottom: 0,
            left: '50%',
            zIndex: 1050,
            padding: '20px',
            boxShadow: '0 -5px 25px rgba(0,0,0,0.6)',
            transformOrigin: 'bottom center'
          }}
        >
          <div className="d-flex justify-content-between align-items-center pb-2 mb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h4 className="text-white fw-bold m-0" style={{ fontSize: '15px' }}>Sửa thông tin khách hàng trong đơn {editingOrder?.id}</h4>
            <button type="button" className="btn-close btn-close-white" onClick={() => { setShowOrderAddressForm(false); setEditingOrder(null); }} style={{ padding: '4px' }}></button>
          </div>
          
          <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '5px' }}>
            <div className="mb-2">
              <label className="text-white-50 form-label mb-1" style={{ fontSize: '11px' }}>Tên người nhận</label>
              <input type="text" className="form-control bg-dark text-white border-secondary" style={{ fontSize: '12px', padding: '6px' }} value={orderAddressName} onChange={(e) => setOrderAddressName(e.target.value)} required />
            </div>

            <div className="mb-2">
              <label className="text-white-50 form-label mb-1" style={{ fontSize: '11px' }}>Số điện thoại</label>
              <input type="text" className="form-control bg-dark text-white border-secondary" style={{ fontSize: '12px', padding: '6px' }} value={orderAddressPhone} onChange={(e) => setOrderAddressPhone(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label className="text-white-50 form-label mb-1" style={{ fontSize: '11px' }}>Địa chỉ nhận hàng</label>
              <textarea className="form-control bg-dark text-white border-secondary" style={{ fontSize: '12px', padding: '6px' }} value={orderAddressLine} onChange={(e) => setOrderAddressLine(e.target.value)} rows={2} required />
            </div>
          </div>

          <div className="mt-2">
            <button 
              type="button" 
              onClick={handleSaveOrderAddress}
              className="btn btn-warning w-100 py-2 text-dark fw-bold"
              style={{ borderRadius: '8px', fontSize: '13px' }}
            >
              Cập nhật thông tin giao hàng
            </button>
          </div>
        </div>
      )}

      {/* ORDER ITEMS EDIT BOTTOM DRAWER */}
      {showOrderItemsForm && (
        <div 
          className="offcanvas-backdrop fade show" 
          style={{ zIndex: 1040 }} 
          onClick={() => { setShowOrderItemsForm(false); setEditingOrderItems(null); }}
        ></div>
      )}

      {showOrderItemsForm && (
        <div 
          className="offcanvas offcanvas-bottom show" 
          tabIndex={-1} 
          style={{ 
            visibility: 'visible', 
            transform: 'translate(-50%, 0)', 
            transition: 'transform 0.3s ease-in-out, visibility 0.3s',
            backgroundColor: '#122636',
            borderTopLeftRadius: '25px',
            borderTopRightRadius: '25px',
            height: 'auto',
            maxHeight: '92%',
            width: '100%',
            maxWidth: '600px',
            position: 'fixed',
            bottom: 0,
            left: '50%',
            zIndex: 1050,
            padding: '20px',
            boxShadow: '0 -5px 25px rgba(0,0,0,0.6)',
            transformOrigin: 'bottom center'
          }}
        >
          <div className="d-flex justify-content-between align-items-center pb-2 mb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h4 className="text-white fw-bold m-0" style={{ fontSize: '15px' }}>Sửa sản phẩm đã mua - Đơn {editingOrderItems?.id}</h4>
            <button type="button" className="btn-close btn-close-white" onClick={() => { setShowOrderItemsForm(false); setEditingOrderItems(null); }} style={{ padding: '4px' }}></button>
          </div>
          
          <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '5px' }}>
            
            {/* List of current order items */}
            <h5 className="text-warning mb-2" style={{ fontSize: '12px', fontWeight: 'bold' }}>Sản phẩm trong đơn ({orderItems.length})</h5>
            
            {orderItems.length === 0 ? (
              <p className="light-text text-center py-2" style={{ fontSize: '12px' }}>Không có sản phẩm nào trong đơn hàng.</p>
            ) : (
              <div className="d-flex flex-column gap-2 mb-3">
                {orderItems.map((item, idx) => {
                  const storeProd = products.find(p => p.id === item.productId);
                  const availableColors = storeProd ? storeProd.colors : [item.color];
                  const availableSizes = storeProd ? storeProd.sizes : [item.size];
                  
                  return (
                    <div 
                      key={`${item.productId}_${idx}`} 
                      className="d-flex align-items-center justify-content-between p-2" 
                      style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}
                    >
                      <div className="d-flex align-items-center gap-2" style={{ flexGrow: 1 }}>
                        <img src={getAssetPath(item.image)} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                        <div style={{ minWidth: 0 }}>
                          <span className="text-white d-block text-truncate fw-medium" style={{ fontSize: '12px' }}>{item.name}</span>
                          <span className="text-warning d-block" style={{ fontSize: '11px' }}>${item.price}</span>
                          
                          {/* Attribute Selectors for purchased items */}
                          <div className="d-flex gap-2 mt-1">
                            <select 
                              className="form-select bg-dark text-white border-secondary py-0 px-1"
                              style={{ fontSize: '10px', height: '18px', width: 'auto' }}
                              value={item.color}
                              onChange={(e) => {
                                const updated = [...orderItems];
                                updated[idx].color = e.target.value;
                                setOrderItems(updated);
                              }}
                            >
                              {availableColors.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            
                            <select 
                              className="form-select bg-dark text-white border-secondary py-0 px-1"
                              style={{ fontSize: '10px', height: '18px', width: 'auto' }}
                              value={item.size}
                              onChange={(e) => {
                                const updated = [...orderItems];
                                updated[idx].size = e.target.value;
                                setOrderItems(updated);
                              }}
                            >
                              {availableSizes.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Qty and Remove Actions */}
                      <div className="d-flex align-items-center gap-2 ml-2">
                        <div className="d-flex align-items-center bg-dark rounded" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                          <button 
                            type="button" 
                            onClick={() => handleUpdateOrderItemQty(idx, item.quantity - 1)}
                            className="btn btn-sm btn-link text-white p-0 px-2"
                            style={{ textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}
                          >
                            -
                          </button>
                          <span className="text-white px-1" style={{ fontSize: '11px', minWidth: '15px', textAlign: 'center' }}>{item.quantity}</span>
                          <button 
                            type="button" 
                            onClick={() => handleUpdateOrderItemQty(idx, item.quantity + 1)}
                            className="btn btn-sm btn-link text-white p-0 px-2"
                            style={{ textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}
                          >
                            +
                          </button>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveOrderItem(idx)}
                          className="btn btn-sm btn-outline-danger p-1"
                          style={{ fontSize: '10px', borderRadius: '4px', padding: '2px 5px' }}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Form to add a new product to this order */}
            <div className="p-2 mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '10px' }}>
              <h5 className="text-white mb-2" style={{ fontSize: '11px', fontWeight: 'bold' }}>Thêm sản phẩm mới vào đơn hàng</h5>
              
              <select 
                className="form-select bg-dark text-white border-secondary mb-2"
                style={{ fontSize: '11px', padding: '5px' }}
                value={selectedAddProduct ? selectedAddProduct.id : ''}
                onChange={(e) => {
                  const prod = products.find(p => p.id === e.target.value) || null;
                  setSelectedAddProduct(prod);
                  if (prod) {
                    setSelectedAddColor(prod.colors[0] || 'Beige');
                    setSelectedAddSize(prod.sizes[0] || 'M');
                  } else {
                    setSelectedAddColor('');
                    setSelectedAddSize('');
                  }
                }}
              >
                <option value="">-- Chọn sản phẩm muốn thêm --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                ))}
              </select>

              {selectedAddProduct && (
                <>
                  <div className="row g-2 mb-2">
                    <div className="col-4">
                      <label className="text-white-50 mb-1" style={{ fontSize: '9px' }}>Màu sắc</label>
                      <select 
                        className="form-select bg-dark text-white border-secondary py-1"
                        style={{ fontSize: '10px' }}
                        value={selectedAddColor}
                        onChange={(e) => setSelectedAddColor(e.target.value)}
                      >
                        {selectedAddProduct.colors.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-4">
                      <label className="text-white-50 mb-1" style={{ fontSize: '9px' }}>Kích thước</label>
                      <select 
                        className="form-select bg-dark text-white border-secondary py-1"
                        style={{ fontSize: '10px' }}
                        value={selectedAddSize}
                        onChange={(e) => setSelectedAddSize(e.target.value)}
                      >
                        {selectedAddProduct.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="col-4">
                      <label className="text-white-50 mb-1" style={{ fontSize: '9px' }}>Số lượng</label>
                      <input 
                        type="number" 
                        className="form-control bg-dark text-white border-secondary py-1"
                        style={{ fontSize: '10px' }}
                        value={selectedAddQty}
                        onChange={(e) => setSelectedAddQty(Math.max(1, Number(e.target.value)))}
                        min={1}
                      />
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={handleAddProductToOrder}
                    className="btn btn-sm btn-warning w-100 py-1 text-dark fw-bold"
                    style={{ fontSize: '11px', borderRadius: '6px' }}
                  >
                    Thêm sản phẩm này vào đơn
                  </button>
                </>
              )}
            </div>

            {/* Adjust shipping charge and discounts */}
            <div className="row g-2 mb-2">
              <div className="col-6">
                <label className="text-white-50 mb-1" style={{ fontSize: '11px' }}>Phí giao hàng ($)</label>
                <input 
                  type="number" 
                  className="form-control bg-dark text-white border-secondary"
                  style={{ fontSize: '12px', padding: '6px' }}
                  value={orderShippingCharge}
                  onChange={(e) => setOrderShippingCharge(Math.max(0, Number(e.target.value)))}
                  min={0}
                />
              </div>
              <div className="col-6">
                <label className="text-white-50 mb-1" style={{ fontSize: '11px' }}>Khuyến mãi/Giảm giá ($)</label>
                <input 
                  type="number" 
                  className="form-control bg-dark text-white border-secondary"
                  style={{ fontSize: '12px', padding: '6px' }}
                  value={orderDiscount}
                  onChange={(e) => setOrderDiscount(Math.max(0, Number(e.target.value)))}
                  min={0}
                />
              </div>
            </div>

            {/* Calculations Preview */}
            <div className="p-2 mb-2 text-end" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
              <div className="text-white-50" style={{ fontSize: '11px' }}>
                Tạm tính: <strong className="text-white">${orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)}</strong>
              </div>
              <div className="text-white-50" style={{ fontSize: '11px' }}>
                Phí ship: <strong className="text-white">+${orderShippingCharge}</strong> | Giảm giá: <strong className="text-white">-${orderDiscount}</strong>
              </div>
              <div className="text-warning fw-bold mt-1" style={{ fontSize: '14px' }}>
                Tổng cộng: ${Math.max(0, orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) + orderShippingCharge - orderDiscount)}
              </div>
            </div>
            
          </div>

          <div className="mt-2">
            <button 
              type="button" 
              onClick={handleSaveOrderItems}
              className="btn btn-warning w-100 py-2 text-dark fw-bold"
              style={{ borderRadius: '8px', fontSize: '13px' }}
            >
              Lưu thay đổi sản phẩm & Tổng tiền
            </button>
          </div>
        </div>
      )}
    </>
  );
}
