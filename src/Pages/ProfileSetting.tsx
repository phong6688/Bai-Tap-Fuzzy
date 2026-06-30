import { useEffect, useState } from 'react';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { apiClient } from '../services/apiClient';
import { getAssetPath } from '../utils/assetHelper';

export default function ProfileSetting() {
  const { currentUser, loading } = useRequireAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    document.body.className = "";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  useEffect(() => {
    if (!loading && currentUser && typeof (window as any).init_iconsax === 'function') {
      (window as any).init_iconsax();
    }
  }, [loading, currentUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setErrorMsg('');

    try {
      const res = await apiClient.updateProfile({ name, phone });
      if (res.success) {
        setMessage('Profile updated successfully!');
        setTimeout(() => {
          window.location.hash = '/profile';
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
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
      <header className="profile-header section-t-space">
        <div className="custom-container">
          <div className="header-panel">
            <a href="#/profile">
              <i className="iconsax back-btn" data-icon="arrow-left"></i>
            </a>
            <h3>Profile Settings</h3>
          </div>
          <div className="profile-setting-pic mx-auto">
            <img className="img-fluid img" src={getAssetPath(currentUser.avatar || "/assets/images/icons/profile1.png")} alt="profile" />
          </div>
        </div>
      </header>

      <form className="theme-form profile-setting mt-5" onSubmit={handleSave}>
        <div className="custom-container">
          {message && (
            <div className="alert alert-success" role="alert" style={{ fontSize: '13px', padding: '10px 15px', borderRadius: '5px', marginBottom: '15px' }}>
              {message}
            </div>
          )}
          {errorMsg && (
            <div className="alert alert-danger" role="alert" style={{ fontSize: '13px', padding: '10px 15px', borderRadius: '5px', marginBottom: '15px' }}>
              {errorMsg}
            </div>
          )}

          <div className="form-group d-block">
            <label htmlFor="inputname" className="form-label">Name</label>
            <div className="form-input mb-4">
              <input 
                type="text" 
                className="form-control" 
                id="inputname" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                disabled={saving}
                required
              />
              <i className="iconsax icons" data-icon="user-1"></i>
            </div>
          </div>

          <div className="form-group d-block">
            <label htmlFor="inputuseremail" className="form-label">Email id (Cannot be changed)</label>
            <div className="form-input mb-4">
              <input 
                type="email" 
                className="form-control" 
                id="inputuseremail" 
                value={email} 
                disabled 
              />
              <i className="iconsax icons" data-icon="mail"></i>
            </div>
          </div>

          <div className="form-group d-block">
            <label htmlFor="inputusernumber" className="form-label">Phone Number</label>
            <div className="form-input">
              <input 
                type="text" 
                className="form-control" 
                id="inputusernumber" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                disabled={saving}
              />
              <i className="iconsax icons" data-icon="phone"></i>
            </div>
          </div>
          
          <div className="footer-modal d-flex gap-3">
            <a href="#/profile" className="btn gray-btn btn-inline mt-0 w-50" style={{ textDecoration: 'none', lineHeight: '2.5' }}>Cancel</a>
            <button type="submit" className="theme-btn btn btn-inline mt-0 w-50" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </form>

      <section className="panel-space"></section>
    </>
  );
}
