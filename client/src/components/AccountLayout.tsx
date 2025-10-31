import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGetMeQuery, useLogoutMutation } from '../app/api';

type AccountLayoutProps = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function AccountLayout({ title, subtitle, children }: AccountLayoutProps) {
  const { data: meData } = useGetMeQuery();
  const [logout] = useLogoutMutation();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      window.location.href = '/login';
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24 }}>
        {/* Sidebar */}
        <aside style={{
          border: '1px solid #e8e8e8',
          borderRadius: 12,
          padding: 16,
          backgroundColor: 'white',
          height: 'fit-content'
        }}>
          <div style={{ padding: '8px 12px', marginBottom: 8 }}>
            <p style={{ margin: 0, fontSize: 14, color: '#666' }}>Hesabım</p>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>
              {meData?.user?.name || 'Kullanıcı'}
            </p>
          </div>
          <nav>
            <Link to="/account/profile" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 12px', textDecoration: 'none',
              color: isActive('/account/profile') ? '#111827' : '#374151',
              backgroundColor: isActive('/account/profile') ? '#f3f4f6' : 'transparent',
              borderRadius: 8, marginBottom: 4, fontSize: 14, fontWeight: 600,
              cursor: 'pointer'
            }}>Profil Bilgilerim <span>›</span></Link>

            <Link to="/orders" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 12px', textDecoration: 'none',
              color: isActive('/orders') ? '#111827' : '#374151',
              backgroundColor: isActive('/orders') ? '#f3f4f6' : 'transparent',
              borderRadius: 8, marginBottom: 4, fontSize: 14, fontWeight: 600,
              cursor: 'pointer'
            }}>Siparişlerim <span>›</span></Link>

            <Link to="/addresses" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 12px', textDecoration: 'none',
              color: isActive('/addresses') ? '#111827' : '#374151',
              backgroundColor: isActive('/addresses') ? '#f3f4f6' : 'transparent',
              borderRadius: 8, marginBottom: 8, fontSize: 14, fontWeight: 600,
              cursor: 'pointer'
            }}>Adres Defterim <span>›</span></Link>

            <button onClick={handleLogout} style={{
              width: '100%', textAlign: 'left', padding: '12px 12px',
              border: '1px solid #fee2e2', backgroundColor: '#fef2f2',
              color: '#b91c1c', borderRadius: 8, fontSize: 14, fontWeight: 700,
              cursor: 'pointer'
            }}>Çıkış</button>
          </nav>
        </aside>

        {/* Content */}
        <main>
          {(title || subtitle) && (
            <div style={{ marginBottom: 20 }}>
              {title && (
                <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 6px', color: '#111827' }}>{title}</h1>
              )}
              {subtitle && (
                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}


