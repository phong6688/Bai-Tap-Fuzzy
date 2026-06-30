import { useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient';

export default function Login() {
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
      const res = await apiClient.login(email, password);
      if (res.success) {
        setSuccess('Logged in successfully! Redirecting...');
        setTimeout(() => {
          window.location.hash = '/landing';
        }, 1000);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
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
            <h2>Hello Again!</h2>
            <h4 className="p-0">Welcome back, You have been missed!</h4>
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
            <label htmlFor="inputusername" className="form-label">Email id</label>
            <div className="form-input mb-4">
              <input 
                type="email" 
                className="form-control" 
                id="inputusername" 
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
          
          <div className="option mt-3">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" defaultValue="" id="flexCheckDefault" />
              <label className="form-check-label" htmlFor="flexCheckDefault">Remember me</label>
            </div>
            <a className="forgot" href="#/forgot-password">Forgot password?</a>
          </div>

          <div className="submit-btn mt-4">
            <button type="submit" className="btn auth-btn w-100" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
          
          <div className="division">
            <span>OR</span>
          </div>

          <ul className="social-media">
            <li>
              <a href="https://www.facebook.com/login/" target="_blank" rel="noreferrer">
                <img className="img-fluid icons" src="assets/images/svg/facebook.svg" alt="facebook" />
              </a>
            </li>
            <li>
              <a href="https://www.google.co.in/" target="_blank" rel="noreferrer">
                <img className="img-fluid icons" src="assets/images/svg/google.svg" alt="google" />
              </a>
            </li>
            <li>
              <a href="https://www.apple.com/in/" target="_blank" rel="noreferrer">
                <img className="img-fluid icons" src="assets/images/svg/apple.svg" alt="apple" />
              </a>
            </li>
          </ul>

          <h4 className="signup">Don’t have an account ?<a href="#/create-account"> Sign up</a></h4>
        </div>
      </form>
    </>
  );
}
