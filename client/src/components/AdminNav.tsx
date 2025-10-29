import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGetMeQuery, useLogoutMutation } from '../app/api';
import { useCart } from '../contexts/CartContext';

export default function AdminNav() {
  const { data: meData } = useGetMeQuery();
  const [logout] = useLogoutMutation();
  const location = useLocation();
  const { getTotalItems } = useCart();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Only show admin nav if user is admin
  if (!meData?.user || meData.user.role !== 'admin') {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      window.location.href = '/';
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

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
            <h2 style={{ margin: 0, color: '#1a1a1a', fontSize: 24, fontWeight: 400 }}>
              Yönetici Paneli
            </h2>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', gap: 0 }}>
            <Link 
              to="/admin/products" 
              style={{ 
                color: isActive('/admin/products') ? '#1a1a1a' : '#666',
                textDecoration: 'none',
                padding: '10px 20px',
                borderBottom: isActive('/admin/products') ? '1px solid #1a1a1a' : 'none',
                transition: 'all 0.2s ease',
                fontSize: 14,
                fontWeight: isActive('/admin/products') ? 500 : 300
              }}
            >
              Ürünleri Yönet
            </Link>
            <Link 
              to="/admin/orders" 
              style={{ 
                color: isActive('/admin/orders') ? '#1a1a1a' : '#666',
                textDecoration: 'none',
                padding: '10px 20px',
                borderBottom: isActive('/admin/orders') ? '1px solid #1a1a1a' : 'none',
                transition: 'all 0.2s ease',
                fontSize: 14,
                fontWeight: isActive('/admin/orders') ? 500 : 300
              }}
            >
              Siparişleri Yönet
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
            <Link 
              to="/cart" 
              style={{ 
                color: isActive('/cart') ? '#1a1a1a' : '#666',
                textDecoration: 'none',
                padding: '10px 20px',
                borderBottom: isActive('/cart') ? '1px solid #1a1a1a' : 'none',
                transition: 'all 0.2s ease',
                fontSize: 14,
                fontWeight: isActive('/cart') ? 500 : 300,
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
          </nav>

          {/* Account Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
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
          </div>
        </div>
      </div>
    </div>
  );
}
