import { useEffect, useState } from 'react';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { apiClient } from '../services/apiClient';

export default function NewAddress() {
  const { currentUser, loading } = useRequireAuth();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [addressType, setAddressType] = useState<'Home' | 'Office' | 'Other'>('Home');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    document.body.className = "";
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    if (!name.trim()) {
      setErrorMsg('Recipient name is required');
      setSubmitting(false);
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Phone number is required');
      setSubmitting(false);
      return;
    }
    if (!streetAddress.trim()) {
      setErrorMsg('Street address is required');
      setSubmitting(false);
      return;
    }
    if (!city.trim()) {
      setErrorMsg('City is required');
      setSubmitting(false);
      return;
    }
    if (!pinCode.trim()) {
      setErrorMsg('Pin code is required');
      setSubmitting(false);
      return;
    }

    const fullAddress = `${streetAddress}${landmark ? ', ' + landmark : ''}, ${city} - ${pinCode}`;

    try {
      const res = await apiClient.addAddress({
        name,
        phone,
        type: addressType,
        addressLine: fullAddress,
        isDefault: false
      });

      if (res.success) {
        setSuccessMsg('Address added successfully!');
        setTimeout(() => {
          window.location.hash = '/manage-address';
        }, 1000);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to add address');
    } finally {
      setSubmitting(false);
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
            <a href="#/manage-address">
              <i className="iconsax back-btn" data-icon="arrow-left"></i>
            </a>
            <h3>Add New Address</h3>
          </div>
        </div>
      </header>

      <section className="section-b-space">
        <div className="custom-container">
          <form className="address-form" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="alert alert-danger" role="alert" style={{ fontSize: '13px', padding: '10px 15px', borderRadius: '5px', marginBottom: '15px' }}>
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="alert alert-success" role="alert" style={{ fontSize: '13px', padding: '10px 15px', borderRadius: '5px', marginBottom: '15px' }}>
                {successMsg}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Recipient Name</label>
              <div className="form-input mb-3">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter recipient's name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="form-input mb-3">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter phone number" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Street Address</label>
              <div className="form-input mb-3">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter house no, street, area" 
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Landmark (Optional)</label>
              <div className="form-input mb-3">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter near landmark" 
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <div className="form-input mb-3">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Enter city" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={submitting}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label className="form-label">Pin Code</label>
                  <div className="form-input mb-3">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Enter zip/pin" 
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      disabled={submitting}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address Type</label>
                <ul className="address-type">
                  <li>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="addressTypeRadio" 
                        id="flexRadioDefault1" 
                        checked={addressType === 'Home'}
                        onChange={() => setAddressType('Home')}
                        disabled={submitting}
                      />
                      <label className="form-check-label" htmlFor="flexRadioDefault1">Home</label>
                    </div>
                  </li>
                  <li>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="addressTypeRadio" 
                        id="flexRadioDefault2" 
                        checked={addressType === 'Office'}
                        onChange={() => setAddressType('Office')}
                        disabled={submitting}
                      />
                      <label className="form-check-label" htmlFor="flexRadioDefault2">Office</label>
                    </div>
                  </li>
                  <li>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="addressTypeRadio" 
                        id="flexRadioDefault3" 
                        checked={addressType === 'Other'}
                        onChange={() => setAddressType('Other')}
                        disabled={submitting}
                      />
                      <label className="form-check-label" htmlFor="flexRadioDefault3">Other</label>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <section className="panel-space"></section>
            
            <div className="footer-modal d-flex gap-3">
              <a href="#/manage-address" className="btn gray-btn btn-inline mt-0 w-50" style={{ textDecoration: 'none', lineHeight: '2.5' }}>Cancel</a>
              <button type="submit" className="theme-btn btn btn-inline mt-0 w-50" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
