import { useEffect, useState } from 'react';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { apiClient, type Address } from '../services/apiClient';

export default function ManageAddress() {
  const { currentUser, loading } = useRequireAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [message, setMessage] = useState('');

  const fetchAddresses = async () => {
    try {
      const list = await apiClient.getAddresses();
      setAddresses(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    document.body.className = "";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchAddresses();
    }
  }, [currentUser]);

  const handleSelectDefault = async (id: string) => {
    try {
      await apiClient.updateAddress(id, { isDefault: true });
      setMessage('Default address updated!');
      fetchAddresses();
      setTimeout(() => setMessage(''), 1500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await apiClient.deleteAddress(id);
        setMessage('Address deleted successfully!');
        fetchAddresses();
        setTimeout(() => setMessage(''), 1500);
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (loading || !currentUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff' }}>
        <h3>Loading profile...</h3>
      </div>
    );
  }

  return (
    <>
      <header className="section-t-space">
        <div className="custom-container">
          <div className="header-panel">
            <a href="#/profile">
              <i className="iconsax back-btn" data-icon="arrow-left"></i>
            </a>
            <h3>Saved Address</h3>
          </div>
        </div>
      </header>

      <section className="shipping-details-sec">
        <div className="custom-container">
          {message && (
            <div className="alert alert-success" role="alert" style={{ fontSize: '13px', padding: '10px 15px', borderRadius: '5px', marginBottom: '15px' }}>
              {message}
            </div>
          )}

          {loadingAddresses ? (
            <div className="text-center py-4">
              <p style={{ color: '#fff' }}>Loading addresses...</p>
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-5">
              <i className="iconsax" data-icon="location" style={{ fontSize: '48px', color: '#ffc107', marginBottom: '15px', display: 'block' }}></i>
              <p style={{ color: '#aaa' }}>No saved addresses found.</p>
            </div>
          ) : (
            <ul className="address-list">
              {addresses.map((address) => (
                <li key={address.id}>
                  <div className="shipping-address" style={{ position: 'relative' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="defaultAddressRadio" 
                          id={address.id} 
                          checked={address.isDefault}
                          onChange={() => handleSelectDefault(address.id)}
                        />
                        <label className="form-check-label" htmlFor={address.id} style={{ fontWeight: 'bold' }}>
                          {address.type} {address.isDefault && <span className="badge bg-warning text-dark ms-2" style={{ fontSize: '10px' }}>Default</span>}
                        </label>
                      </div>
                      <button 
                        onClick={(e) => handleDelete(e, address.id)} 
                        style={{ background: 'none', border: 'none', padding: '5px', cursor: 'pointer' }}
                        title="Delete Address"
                      >
                        <i className="iconsax" data-icon="trash" style={{ color: '#ff4d4f', fontSize: '18px' }}></i>
                      </button>
                    </div>
                    <div className="address-details">
                      <p>{address.addressLine}</p>
                      <h5 className="content-number" style={{ marginTop: '5px' }}>
                        Receiver: <span style={{ color: '#fff', fontWeight: '500' }}>{address.name}</span> | Phone: <span>{address.phone}</span>
                      </h5>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div style={{ marginTop: '20px' }}>
            <a href="#/new-address" className="btn btn-outline-warning w-100 py-2" style={{ borderRadius: '30px', fontWeight: 'bold', textDecoration: 'none', display: 'block', textAlign: 'center' }}>
              + Add New Address
            </a>
          </div>

          <div className="apply-btn mt-4">
            <a href="#/profile" className="btn theme-btn w-100">Back to Profile</a>
          </div>
        </div>
      </section>

      <section className="panel-space"></section>
    </>
  );
}
