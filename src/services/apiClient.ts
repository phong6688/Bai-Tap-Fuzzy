// Client-side authentication and API client simulation
// Stores users, active session, and address book in LocalStorage

// Basic encryption helper for secure local storage
const encrypt = (txt: string): string => {
  try {
    return btoa(unescape(encodeURIComponent(txt)));
  } catch (e) {
    return txt;
  }
};

const decrypt = (txt: string): string => {
  try {
    return decodeURIComponent(escape(atob(txt)));
  } catch (e) {
    return txt;
  }
};

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob?: string;
  avatar?: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  type: 'Home' | 'Office' | 'Other';
  addressLine: string;
  isDefault: boolean;
}

// Simulated delay helper
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Retrieve data from secure LocalStorage
const getLocalStorageItem = (key: string): any => {
  const data = localStorage.getItem(key);
  if (!data) return null;
  try {
    return JSON.parse(decrypt(data));
  } catch (e) {
    return null;
  }
};

// Save data securely to LocalStorage
const setLocalStorageItem = (key: string, value: any): void => {
  localStorage.setItem(key, encrypt(JSON.stringify(value)));
};

// Initialize default users if empty
if (!getLocalStorageItem('fuzzy_users')) {
  setLocalStorageItem('fuzzy_users', [
    {
      id: 'user_1',
      name: 'Marlin Watkin',
      email: 'marlinw25@gmail.com',
      phone: '+4498456215',
      password: 'password123', // plain text just for mock db simulation
      dob: '1995-08-25',
      avatar: '/assets/images/icons/profile1.png',
      addresses: [
        {
          id: 'addr_1',
          name: 'Marlin Watkin (Home)',
          phone: '+4498456215',
          type: 'Home',
          addressLine: '123 Queens Road, Richmond, London, TW10 6HY',
          isDefault: true
        },
        {
          id: 'addr_2',
          name: 'Marlin Watkin (Office)',
          phone: '+4498456215',
          type: 'Office',
          addressLine: 'Unit 4, Capital Business Park, London, E4 7DP',
          isDefault: false
        }
      ]
    }
  ]);
}

export const getAuthToken = (): string | null => {
  const session = getLocalStorageItem('fuzzy_session');
  if (!session) return null;
  // Check token expiration (1 hour)
  if (Date.now() > session.expiresAt) {
    logoutUser();
    return null;
  }
  return session.token;
};

export const getCurrentUser = (): User | null => {
  const token = getAuthToken();
  if (!token) return null;
  const session = getLocalStorageItem('fuzzy_session');
  return session ? session.user : null;
};

export const logoutUser = (): void => {
  localStorage.removeItem('fuzzy_session');
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 letter, and 1 number
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
};

const adjustProductStock = (items: OrderItem[], action: 'deduct' | 'restore') => {
  const productsData = localStorage.getItem('fuzzy_products');
  if (!productsData) return;
  try {
    const products = JSON.parse(productsData);
    items.forEach(item => {
      const prod = products.find((p: any) => p.id === item.productId);
      if (prod) {
        if (action === 'deduct') {
          prod.stock = Math.max(0, prod.stock - item.quantity);
        } else {
          prod.stock = prod.stock + item.quantity;
        }
      }
    });
    localStorage.setItem('fuzzy_products', JSON.stringify(products));
  } catch (e) {
    console.error('Error adjusting stock', e);
  }
};

const adjustProductStockDiff = (oldItems: OrderItem[], newItems: OrderItem[]) => {
  const productsData = localStorage.getItem('fuzzy_products');
  if (!productsData) return;
  try {
    const products = JSON.parse(productsData);
    
    // Map of product ID -> quantity difference (newQty - oldQty)
    const diffMap: { [productId: string]: number } = {};
    
    // Process old items (subtract from diff, meaning if we remove them, newQty is 0, so diff is negative)
    oldItems.forEach(item => {
      diffMap[item.productId] = (diffMap[item.productId] || 0) - item.quantity;
    });
    
    // Process new items (add to diff)
    newItems.forEach(item => {
      diffMap[item.productId] = (diffMap[item.productId] || 0) + item.quantity;
    });
    
    // Apply differences to product stock
    Object.keys(diffMap).forEach(productId => {
      const diff = diffMap[productId];
      if (diff !== 0) {
        const prod = products.find((p: any) => p.id === productId);
        if (prod) {
          // If diff is positive (e.g. quantity increased from 1 to 3, diff is +2), we deduct 2 from stock
          // If diff is negative (e.g. quantity decreased from 3 to 1, diff is -2), we add 2 to stock
          prod.stock = Math.max(0, prod.stock - diff);
        }
      }
    });
    
    localStorage.setItem('fuzzy_products', JSON.stringify(products));
  } catch (e) {
    console.error('Error adjusting stock difference', e);
  }
};

export const apiClient = {
  // Simulate Auth: Register
  async register(name: string, email: string, password: string): Promise<{ success: boolean; message: string }> {
    await delay(600);
    
    if (!name.trim()) {
      return { success: false, message: 'Full name is required' };
    }
    if (!validateEmail(email)) {
      return { success: false, message: 'Invalid email format' };
    }
    if (!validatePassword(password)) {
      return { success: false, message: 'Password must be at least 8 characters, containing both letters and numbers' };
    }

    const users = getLocalStorageItem('fuzzy_users') || [];
    const exists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, message: 'Email address already exists' };
    }

    const newUser = {
      id: 'user_' + Date.now(),
      name,
      email,
      phone: '',
      password,
      dob: '',
      avatar: '/assets/images/icons/profile1.png',
      addresses: []
    };

    users.push(newUser);
    setLocalStorageItem('fuzzy_users', users);

    return { success: true, message: 'Registration successful! You can now log in.' };
  },

  // Simulate Auth: Login
  async login(email: string, password: string): Promise<{ success: boolean; message: string; token?: string; user?: User }> {
    await delay(600);

    if (!validateEmail(email)) {
      return { success: false, message: 'Invalid email format' };
    }

    const users = getLocalStorageItem('fuzzy_users') || [];
    const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (!user) {
      return { success: false, message: 'Incorrect email or password' };
    }

    // Generate simulated JWT token
    const token = 'mock_jwt_header.' + btoa(JSON.stringify({ userId: user.id, email: user.email })) + '.mock_signature';
    const session = {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        avatar: user.avatar
      },
      expiresAt: Date.now() + 60 * 60 * 1000 // 1 hour token expiration
    };

    setLocalStorageItem('fuzzy_session', session);

    return {
      success: true,
      message: 'Logged in successfully',
      token,
      user: session.user
    };
  },

  // Simulate GET Profile
  async getProfile(): Promise<User> {
    await delay(300);
    const user = getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    
    const users = getLocalStorageItem('fuzzy_users') || [];
    const found = users.find((u: any) => u.id === user.id);
    if (!found) throw new Error('User not found');

    return {
      id: found.id,
      name: found.name,
      email: found.email,
      phone: found.phone,
      dob: found.dob,
      avatar: found.avatar
    };
  },

  // Simulate PUT Profile
  async updateProfile(updatedData: Partial<User>): Promise<{ success: boolean; user: User }> {
    await delay(500);
    const user = getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const users = getLocalStorageItem('fuzzy_users') || [];
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex === -1) throw new Error('User not found');

    const matchedUser = users[userIndex];
    const updated = {
      ...matchedUser,
      ...updatedData
    };

    users[userIndex] = updated;
    setLocalStorageItem('fuzzy_users', users);

    // Update active session user as well
    const session = getLocalStorageItem('fuzzy_session');
    if (session) {
      session.user = {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        dob: updated.dob,
        avatar: updated.avatar
      };
      setLocalStorageItem('fuzzy_session', session);
    }

    return {
      success: true,
      user: session.user
    };
  },

  // Simulate GET Addresses
  async getAddresses(): Promise<Address[]> {
    await delay(300);
    const user = getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const users = getLocalStorageItem('fuzzy_users') || [];
    const found = users.find((u: any) => u.id === user.id);
    if (!found) throw new Error('User not found');

    return found.addresses || [];
  },

  // Simulate POST Address
  async addAddress(address: Omit<Address, 'id'>): Promise<{ success: boolean; address: Address }> {
    await delay(400);
    const user = getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const users = getLocalStorageItem('fuzzy_users') || [];
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex === -1) throw new Error('User not found');

    const matchedUser = users[userIndex];
    const addresses = matchedUser.addresses || [];

    const newAddress: Address = {
      ...address,
      id: 'addr_' + Date.now()
    };

    if (newAddress.isDefault) {
      addresses.forEach((a: any) => a.isDefault = false);
    } else if (addresses.length === 0) {
      newAddress.isDefault = true;
    }

    addresses.push(newAddress);
    matchedUser.addresses = addresses;
    users[userIndex] = matchedUser;
    setLocalStorageItem('fuzzy_users', users);

    return { success: true, address: newAddress };
  },

  // Simulate PUT Address
  async updateAddress(id: string, addressData: Partial<Address>): Promise<{ success: boolean; address: Address }> {
    await delay(400);
    const user = getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const users = getLocalStorageItem('fuzzy_users') || [];
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex === -1) throw new Error('User not found');

    const matchedUser = users[userIndex];
    const addresses = matchedUser.addresses || [];
    const addressIndex = addresses.findIndex((a: any) => a.id === id);
    if (addressIndex === -1) throw new Error('Address not found');

    const updatedAddress = {
      ...addresses[addressIndex],
      ...addressData
    };

    if (updatedAddress.isDefault) {
      addresses.forEach((a: any) => a.isDefault = false);
    }

    addresses[addressIndex] = updatedAddress;
    matchedUser.addresses = addresses;
    users[userIndex] = matchedUser;
    setLocalStorageItem('fuzzy_users', users);

    return { success: true, address: updatedAddress };
  },

  // Simulate DELETE Address
  async deleteAddress(id: string): Promise<{ success: boolean }> {
    await delay(300);
    const user = getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const users = getLocalStorageItem('fuzzy_users') || [];
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex === -1) throw new Error('User not found');

    const matchedUser = users[userIndex];
    let addresses = matchedUser.addresses || [];
    const toDelete = addresses.find((a: any) => a.id === id);
    if (!toDelete) throw new Error('Address not found');

    addresses = addresses.filter((a: any) => a.id !== id);

    // If we deleted default, set the first remaining as default
    if (toDelete.isDefault && addresses.length > 0) {
      addresses[0].isDefault = true;
    }

    matchedUser.addresses = addresses;
    users[userIndex] = matchedUser;
    setLocalStorageItem('fuzzy_users', users);

    return { success: true };
  },

  // Cart management
  getCart(): CartItem[] {
    const data = localStorage.getItem('fuzzy_cart');
    return data ? JSON.parse(data) : [];
  },
  saveCart(cart: CartItem[]): void {
    localStorage.setItem('fuzzy_cart', JSON.stringify(cart));
  },
  addToCart(item: Omit<CartItem, 'id'>): void {
    const cart = this.getCart();
    const id = `${item.productId}_${item.color.replace(/\s+/g, '')}_${item.size}`;
    const existing = cart.find(i => i.id === id);
    if (existing) {
      existing.quantity = Math.min(10, existing.quantity + item.quantity);
    } else {
      cart.push({ ...item, id });
    }
    this.saveCart(cart);
  },
  updateCartQty(id: string, quantity: number): void {
    const cart = this.getCart();
    const existing = cart.find(i => i.id === id);
    if (existing) {
      existing.quantity = Math.max(1, Math.min(10, quantity));
      this.saveCart(cart);
    }
  },
  removeFromCart(id: string): void {
    const cart = this.getCart();
    const updated = cart.filter(i => i.id !== id);
    this.saveCart(updated);
  },
  clearCart(): void {
    localStorage.removeItem('fuzzy_cart');
  },

  // Order management
  getOrders(userId?: string): Order[] {
    const data = localStorage.getItem('fuzzy_orders');
    let orders: Order[] = data ? JSON.parse(data) : [];
    if (userId) {
      orders = orders.filter(o => o.userId === userId);
    }
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; order: Order }> {
    await delay(600);
    const orders = this.getOrders();
    const newOrder: Order = {
      ...orderData,
      id: 'ORD' + Math.floor(100000 + Math.random() * 900000), // Random Order Code
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    localStorage.setItem('fuzzy_orders', JSON.stringify(orders));

    // Deduct stock in local storage products
    const productsData = localStorage.getItem('fuzzy_products');
    if (productsData) {
      const products = JSON.parse(productsData);
      newOrder.items.forEach(item => {
        const prod = products.find((p: any) => p.id === item.productId);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
        }
      });
      localStorage.setItem('fuzzy_products', JSON.stringify(products));
    }

    // Try posting to Next.js API in background if backend is running (fully decoupled)
    try {
      fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      }).catch(() => {});
    } catch(e) {}

    // Clear cart after placing order
    this.clearCart();

    return { success: true, order: newOrder };
  },
  updateOrderStatus(id: string, status: Order['status']): void {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      const oldStatus = orders[idx].status;
      orders[idx].status = status;
      localStorage.setItem('fuzzy_orders', JSON.stringify(orders));
      
      // Deduct or restore stock based on status transition
      if (status === 'cancelled' && oldStatus !== 'cancelled') {
        adjustProductStock(orders[idx].items, 'restore');
      } else if (status !== 'cancelled' && oldStatus === 'cancelled') {
        adjustProductStock(orders[idx].items, 'deduct');
      }

      // Update Next.js backend API if running
      try {
        fetch(`http://localhost:3001/api/orders/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        }).catch(() => {});
      } catch(e) {}
    }
  },
  deleteOrder(id: string): void {
    let orders = this.getOrders();
    const orderToDelete = orders.find(o => o.id === id);
    if (orderToDelete && orderToDelete.status !== 'cancelled') {
      adjustProductStock(orderToDelete.items, 'restore');
    }
    orders = orders.filter(o => o.id !== id);
    localStorage.setItem('fuzzy_orders', JSON.stringify(orders));
    
    // Call backend DELETE endpoint if running
    try {
      fetch(`http://localhost:3001/api/orders/${id}`, {
        method: 'DELETE'
      }).catch(() => {});
    } catch(e) {}
  },
  getUsers(): User[] {
    return getLocalStorageItem('fuzzy_users') || [];
  },
  addUser(userData: Omit<User, 'id'> & { password?: string }): { success: boolean; user: User } {
    const users = getLocalStorageItem('fuzzy_users') || [];
    const id = 'user_' + Date.now();
    const newUser = {
      ...userData,
      id,
      password: userData.password || 'password123',
      avatar: userData.avatar || '/assets/images/icons/profile1.png',
      addresses: []
    };
    users.push(newUser);
    setLocalStorageItem('fuzzy_users', users);
    return { success: true, user: newUser };
  },
  updateUser(userId: string, userData: Partial<User>): { success: boolean; user: User } {
    const users = getLocalStorageItem('fuzzy_users') || [];
    const index = users.findIndex((u: any) => u.id === userId);
    if (index === -1) throw new Error('User not found');
    const updated = {
      ...users[index],
      ...userData
    };
    users[index] = updated;
    setLocalStorageItem('fuzzy_users', users);
    
    // Also update session if this is the logged-in user
    const session = getLocalStorageItem('fuzzy_session');
    if (session && session.user.id === userId) {
      session.user = {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        dob: updated.dob,
        avatar: updated.avatar
      };
      setLocalStorageItem('fuzzy_session', session);
    }
    return { success: true, user: updated };
  },
  deleteUser(userId: string): { success: boolean } {
    let users = getLocalStorageItem('fuzzy_users') || [];
    users = users.filter((u: any) => u.id !== userId);
    setLocalStorageItem('fuzzy_users', users);
    return { success: true };
  },
  updateOrderAddress(orderId: string, addressData: Partial<Address>): void {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].address = {
        ...orders[idx].address,
        ...addressData
      };
      localStorage.setItem('fuzzy_orders', JSON.stringify(orders));
      
      // Update Next.js backend API if running
      try {
        fetch(`http://localhost:3001/api/orders/${orderId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orders[idx])
        }).catch(() => {});
      } catch(e) {}
    }
  },
  updateOrder(orderId: string, orderData: Partial<Order>): void {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      const oldOrder = orders[idx];

      // If items are modified, we need to adjust stock
      if (orderData.items && oldOrder.status !== 'cancelled') {
        adjustProductStockDiff(oldOrder.items, orderData.items);
      }

      orders[idx] = {
        ...orders[idx],
        ...orderData
      };
      localStorage.setItem('fuzzy_orders', JSON.stringify(orders));
      
      // Update Next.js backend API if running
      try {
        fetch(`http://localhost:3001/api/orders/${orderId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orders[idx])
        }).catch(() => {});
      } catch(e) {}
    }
  }
};

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  color: string;
  size: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color: string;
  size: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  address: Address;
  paymentMethod: 'COD' | 'Bank Transfer' | 'Momo' | 'VNPay';
  shippingCharge: number;
  discount: number;
  subTotal: number;
  grandTotal: number;
  status: 'pending' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
  createdAt: string;
}

