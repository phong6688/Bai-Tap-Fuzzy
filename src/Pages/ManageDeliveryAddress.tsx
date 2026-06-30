import { useEffect } from 'react';

export default function ManageDeliveryAddress() {
  useEffect(() => {
    document.body.className = "auth-body dark";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ padding: '80px 20px', textAlign: 'center', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ fontSize: '6rem', marginBottom: '20px', fontWeight: 'bold', color: '#ff4d4f' }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Page Not Found</h2>
      <p style={{ maxWidth: '400px', margin: '0 auto 30px', color: '#aaa', lineHeight: '1.6' }}>
        This page "ManageDeliveryAddress" was not found in the original static template.
      </p>
      <a href="#/" style={{ display: 'inline-block', padding: '12px 30px', background: '#ffc107', color: '#212529', borderRadius: '30px', textDecoration: 'none', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(255,193,7,0.3)' }}>
        Back to Onboarding
      </a>
    </div>
  );
}
