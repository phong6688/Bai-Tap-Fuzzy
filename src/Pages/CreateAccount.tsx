import { useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient';

export default function CreateAccount() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.className = "auth-body";
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await apiClient.register(name, email, password);
      if (res.success) {
        setSuccess(res.message);
        setName('');
        setEmail('');
        setPassword('');
        setTimeout(() => {
          window.location.hash = '/login';
        }, 1500);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-img">
        <img className="img-fluid auth-bg" src="assets/images/background/auth_bg.jpg" alt="auth_bg" />
        <div className="auth-content">
          <div>
            <h2>Let’s you in</h2>
            <h4 className="p-0">Hey, You have been missed!</h4>
          </div>
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="custom-container">
          {error && (
            <div className="alert alert-danger" role="alert" style={{ fontSize: '13px', padding: '10px 15px', borderRadius: '5px', marginBottom: '15px' }}>
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success" role="alert" style={{ fontSize: '13px', padding: '10px 15px', borderRadius: '5px', marginBottom: '15px' }}>
              {success}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="inputusername" className="form-label">Full Name</label>
            <div className="form-input mb-4">
              <input 
                type="text" 
                className="form-control" 
                id="inputusername" 
                placeholder="Enter Your Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
              />
              <i className="iconsax icons" data-icon="user-1"></i>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="inputemail" className="form-label">Email id</label>
            <div className="form-input mb-4">
              <input 
                type="email" 
                className="form-control" 
                id="inputemail" 
                placeholder="Enter Your Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
              <i className="iconsax icons" data-icon="mail"></i>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="inputPassword" className="form-label">Password</label>
            <div className="form-input mb-4" style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-control" 
                id="inputPassword" 
                placeholder="Enter Your Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <i className="iconsax icons" data-icon="key"></i>
              <span 
                onClick={() => setShowPassword(!showPassword)} 
                style={{ 
                  position: 'absolute', 
                  right: '15px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  cursor: 'pointer', 
                  fontSize: '16px', 
                  zIndex: 10,
                  userSelect: 'none'
                }}
              >
                {showPassword ? '👁️' : '🙈'}
              </span>
            </div>
          </div>

          <div className="submit-btn mt-4">
            <button type="submit" className="btn auth-btn w-100" disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign UP'}
            </button>
          </div>
          <div className="division">
            <span>OR</span>
          </div>

          <h4 className="signup pt-0">Already have an account ?<a href="#/login"> Sign in</a></h4>
        </div>
      </form>
    </>
  );
}
