import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGetMeQuery, useLogoutMutation } from '../app/api';
import { useCart } from '../contexts/CartContext';

export default function MainNav() {
  const { data: meData } = useGetMeQuery();
  const [logout] = useLogoutMutation();
  const { getTotalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Focus search input when overlay opens
  useEffect(() => {
    if (showSearchOverlay && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchOverlay]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowSearchOverlay(false);
      setSearchTerm('');
    }
  };

  // Don't show nav for admin users (they have AdminNav)
  if (meData?.user?.role === 'admin') {
    return null;
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '20px',
      marginBottom: 30,
      borderBottom: '1px solid #e8e8e8',
      position: 'relative'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo / Title */}
          <div>
            <Link 
              to="/"
              onClick={(e) => {
                // Ana sayfaya giderken search parametresini temizle
                navigate('/', { replace: true });
              }}
              style={{ textDecoration: 'none', color: '#1a1a1a', cursor: 'pointer' }}
            >
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
                fontWeight: isActive('/') ? 500 : 300,
                cursor: 'pointer'
              }}
            >
              Ana Sayfa
            </Link>
            <Link 
              to="/products"
              onClick={(e) => {
                // Ürünler sayfasına giderken search parametresini temizle
                navigate('/products', { replace: true });
              }}
              style={{ 
                color: isActive('/products') ? '#1a1a1a' : '#666',
                textDecoration: 'none',
                padding: '10px 20px',
                borderBottom: isActive('/products') ? '1px solid #1a1a1a' : 'none',
                transition: 'all 0.2s ease',
                fontSize: 14,
                fontWeight: isActive('/products') ? 500 : 300,
                cursor: 'pointer'
              }}
            >
              Ürünler
            </Link>
          </nav>

          {/* Cart & Auth Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            {/* Search Button */}
            <button
              onClick={() => setShowSearchOverlay(true)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Ara"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>

            {/* Cart Button */}
            <Link 
              to="/cart" 
              style={{ 
                color: '#1a1a1a',
                textDecoration: 'none',
                padding: '8px',
                background: 'transparent',
                border: 'none',
                borderRadius: 4,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              {getTotalItems() > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  lineHeight: 1
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
                      to="/account/profile"
                      onClick={() => setShowAccountMenu(false)}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#1a1a1a',
                        textDecoration: 'none',
                        fontSize: 14,
                        borderBottom: '1px solid #f0f0f0',
                        cursor: 'pointer'
                      }}
                    >
                      Profil Bilgilerim
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
                        borderBottom: '1px solid #f0f0f0',
                        cursor: 'pointer'
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
                        borderBottom: '1px solid #f0f0f0',
                        cursor: 'pointer'
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
                  lineHeight: 1.3,
                  cursor: 'pointer'
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

      {/* Search Overlay - Below Navbar */}
      {showSearchOverlay && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowSearchOverlay(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              zIndex: 999
            }}
          />
          
          {/* Search Panel */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              padding: '24px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              zIndex: 1000,
              maxWidth: 1200,
              margin: '0 auto'
            }}
          >
            <form onSubmit={handleSearchSubmit}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Kategori, Ürün, Marka veya Sayfa Ara"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '1px solid #e0e0e0',
                    borderRadius: 4,
                    fontSize: 14,
                    outline: 'none'
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setShowSearchOverlay(false);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowSearchOverlay(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 14,
                    color: '#1a1a1a',
                    padding: '4px 8px',
                    textDecoration: 'underline'
                  }}
                >
                  Kapat
                </button>
              </div>
            </form>

            {/* Popüler Aramalar */}
            <div>
              <h4 style={{ 
                fontSize: 14, 
                fontWeight: 600, 
                color: '#1a1a1a',
                margin: '0 0 16px 0'
              }}>
                Popüler Aramalar
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button
                    onClick={() => {
                      setSearchTerm('UGG');
                      navigate(`/products?search=UGG`);
                      setShowSearchOverlay(false);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 14,
                      color: '#666',
                      textAlign: 'left',
                      padding: 0
                    }}
                  >
                    UGG
                  </button>
                  <button
                    onClick={() => {
                      setSearchTerm('adidas Samba');
                      navigate(`/products?search=adidas Samba`);
                      setShowSearchOverlay(false);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 14,
                      color: '#666',
                      textAlign: 'left',
                      padding: 0
                    }}
                  >
                    adidas Samba
                  </button>
                  <button
                    onClick={() => {
                      setSearchTerm('Sneaker');
                      navigate(`/products?search=Sneaker`);
                      setShowSearchOverlay(false);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 14,
                      color: '#666',
                      textAlign: 'left',
                      padding: 0
                    }}
                  >
                    Sneaker
                  </button>
                  <button
                    onClick={() => {
                      setSearchTerm('Igor');
                      navigate(`/products?search=Igor`);
                      setShowSearchOverlay(false);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 14,
                      color: '#666',
                      textAlign: 'left',
                      padding: 0
                    }}
                  >
                    Igor
                  </button>
                  <button
                    onClick={() => {
                      setSearchTerm('Eşofman');
                      navigate(`/products?search=Eşofman`);
                      setShowSearchOverlay(false);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 14,
                      color: '#666',
                      textAlign: 'left',
                      padding: 0
                    }}
                  >
                    Eşofman
                  </button>
                  <button
                    onClick={() => {
                      setSearchTerm('Chuck Taylor');
                      navigate(`/products?search=Chuck Taylor`);
                      setShowSearchOverlay(false);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 14,
                      color: '#666',
                      textAlign: 'left',
                      padding: 0
                    }}
                  >
                    Chuck Taylor
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontSize: 14, color: '#999' }}>Marka</span>
                  <span style={{ fontSize: 14, color: '#999' }}>Koleksiyon</span>
                  <span style={{ fontSize: 14, color: '#999' }}>Kategori</span>
                  <span style={{ fontSize: 14, color: '#999' }}>Marka</span>
                  <span style={{ fontSize: 14, color: '#999' }}>Kategori</span>
                  <span style={{ fontSize: 14, color: '#999' }}>Koleksiyon</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
