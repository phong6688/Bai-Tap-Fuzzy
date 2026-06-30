import { useEffect } from 'react';

export default function Otp() {
  useEffect(() => {
    document.body.className = "auth-body";
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="auth-img">
      <img className="img-fluid auth-bg" src="assets/images/background/auth_bg.jpg" alt="auth_bg" />
      <div className="auth-content">
        <div>
          <h2>OTP Verification</h2>
        </div>
      </div>
    </div>

    <div className="custom-container">
      <div className="otp-verification">
        <h4>We have sent a verification code to</h4>
        <h4 className="otp-number mt-2">+91 635 546 23098</h4>
      </div>
      <form className="otp-form">
        <div className="form-input dark-border-gradient">
          <input type="number" className="form-control active" placeholder="0" id="five1" onKeyUp={(event) => (window as any).onKeyUpEvent?.(1, event)} onFocus={() => (window as any).onFocusEvent?.(1)} />
        </div>
        <div className="form-input dark-border-gradient">
          <input type="number" className="form-control" placeholder="0" id="five2" onKeyUp={(event) => (window as any).onKeyUpEvent?.(2, event)} onFocus={() => (window as any).onFocusEvent?.(2)} />
        </div>
        <div className="form-input dark-border-gradient">
          <input type="number" className="form-control" placeholder="0" id="five3" onKeyUp={(event) => (window as any).onKeyUpEvent?.(3, event)} onFocus={() => (window as any).onFocusEvent?.(3)} />
        </div>
        <div className="form-input dark-border-gradient">
          <input type="number" className="form-control" placeholder="0" id="five4" onKeyUp={(event) => (window as any).onKeyUpEvent?.(4, event)} onFocus={() => (window as any).onFocusEvent?.(4)} />
        </div>
        <div className="form-input dark-border-gradient">
          <input type="number" className="form-control" placeholder="0" id="five5" onKeyUp={(event) => (window as any).onKeyUpEvent?.(5, event)} onFocus={() => (window as any).onFocusEvent?.(5)} />
        </div>
      </form>
      <a href="#/reset-password" className="btn auth-btn w-100" role="button">Verify</a>
    </div>
    </>
  );
}
