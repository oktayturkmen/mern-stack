import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGetMeQuery, useLogoutMutation } from '../app/api';
import { useCart } from '../contexts/CartContext';

export default function MainNav() {
  const { data: meData } = useGetMeQuery();
  const [logout] = useLogoutMutation();
  const { getTotalItems } = useCart();
  const location = useLocation();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      window.location.href = '/';
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
    };

    if (showAccountMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAccountMenu]);

  // Don't show nav for admin users (they have AdminNav)
  if (meData?.user?.role === 'admin') {
    return null;
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '20px',
      marginBottom: 30,
      borderBottom: '1px solid #e8e8e8'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo / Title */}
          <div>
            <Link to="/" style={{ textDecoration: 'none', color: '#1a1a1a' }}>
              <h2 style={{ margin: 0, color: '#1a1a1a', fontSize: 24, fontWeight: 400 }}>
                MERN Store
              </h2>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', gap: 0 }}>
            <Link 
              to="/" 
              style={{ 
                color: isActive('/') ? '#1a1a1a' : '#666',
                textDecoration: 'none',
                padding: '10px 20px',
                borderBottom: isActive('/') ? '1px solid #1a1a1a' : 'none',
                transition: 'all 0.2s ease',
                fontSize: 14,
                fontWeight: isActive('/') ? 500 : 300
              }}
            >
              Ana Sayfa
            </Link>
            <Link 
              to="/products" 
              style={{ 
                color: isActive('/products') ? '#1a1a1a' : '#666',
                textDecoration: 'none',
                padding: '10px 20px',
                borderBottom: isActive('/products') ? '1px solid #1a1a1a' : 'none',
                transition: 'all 0.2s ease',
                fontSize: 14,
                fontWeight: isActive('/products') ? 500 : 300
              }}
            >
              Ürünler
            </Link>
            {meData?.user && (
              <Link 
                to="/orders" 
                style={{ 
                  color: isActive('/orders') ? '#1a1a1a' : '#666',
                  textDecoration: 'none',
                  padding: '10px 20px',
                  borderBottom: isActive('/orders') ? '1px solid #1a1a1a' : 'none',
                  transition: 'all 0.2s ease',
                  fontSize: 14,
                  fontWeight: isActive('/orders') ? 500 : 300
                }}
              >
                Siparişlerim
              </Link>
            )}
          </nav>

          {/* Cart & Auth Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            {/* Cart Button */}
            <Link 
              to="/cart" 
              style={{ 
                color: isActive('/cart') ? '#1a1a1a' : '#666',
                textDecoration: 'none',
                padding: '8px 16px',
                border: isActive('/cart') ? '1px solid #1a1a1a' : '1px solid #e8e8e8',
                borderRadius: 4,
                transition: 'all 0.2s ease',
                fontSize: 14,
                fontWeight: 300,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
              >
                <span>Sepet</span>
              {getTotalItems() > 0 && (
                <span style={{
                  backgroundColor: '#1a1a1a',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 500
                }}>
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* Auth Section */}
            {meData?.user ? (
              <div ref={menuRef} style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    color: '#1a1a1a',
                    border: '1px solid #e8e8e8',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 300,
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#1a1a1a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e8e8e8';
                  }}
                >
                  Hesabım
                  <span style={{ fontSize: 10 }}>▼</span>
                </button>

                {showAccountMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 8,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e8e8e8',
                    borderRadius: 4,
                    minWidth: 180,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 1000
                  }}>
                    <Link 
                      to="/"
                      onClick={() => setShowAccountMenu(false)}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#1a1a1a',
                        textDecoration: 'none',
                        fontSize: 14,
                        borderBottom: '1px solid #f0f0f0'
                      }}
                    >
                      Genel Bakış
                    </Link>
                    <Link 
                      to="/"
                      onClick={() => setShowAccountMenu(false)}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#1a1a1a',
                        textDecoration: 'none',
                        fontSize: 14,
                        borderBottom: '1px solid #f0f0f0'
                      }}
                    >
                      Profil
                    </Link>
                    <Link 
                      to="/addresses"
                      onClick={() => setShowAccountMenu(false)}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#1a1a1a',
                        textDecoration: 'none',
                        fontSize: 14,
                        borderBottom: '1px solid #f0f0f0'
                      }}
                    >
                      Adresler
                    </Link>
                    <Link 
                      to="/orders"
                      onClick={() => setShowAccountMenu(false)}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#1a1a1a',
                        textDecoration: 'none',
                        fontSize: 14,
                        borderBottom: '1px solid #f0f0f0'
                      }}
                    >
                      Siparişlerim
                    </Link>
                    <button 
                      onClick={handleLogout}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '12px 16px',
                        backgroundColor: 'transparent',
                        color: '#e74c3c',
                        border: 'none',
                        borderTop: '1px solid #f0f0f0',
                        cursor: 'pointer',
                        fontSize: 14
                      }}
                    >
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login"
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  color: '#1a1a1a',
                  textDecoration: 'none',
                  borderRadius: 4,
                  fontSize: 14,
                  fontWeight: 300,
                  transition: 'all 0.2s ease',
                  border: '1px solid #e8e8e8',
                  display: 'flex',
                  flexDirection: 'column',
                  lineHeight: 1.3
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#1a1a1a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e8e8e8';
                }}
                >
                  <span>Giriş Yap</span>
                  <span style={{ fontSize: 11, color: '#999' }}>veya Üye ol</span>
                </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
