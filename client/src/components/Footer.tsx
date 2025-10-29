import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#1a1a1a',
      color: '#e0e0e0',
      padding: '60px 24px 30px',
      marginTop: 80
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 40,
          marginBottom: 40
        }}>
          {/* Brand */}
          <div>
            <h3 style={{
              fontSize: 20,
              fontWeight: 700,
              color: 'white',
              marginBottom: 16
            }}>
              MERN Store
            </h3>
            <p style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: '#999',
              marginBottom: 20
            }}>
              Modern alışveriş deneyimi, güvenli ödeme ve hızlı teslimat.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href="#" style={{ 
                width: 36, 
                height: 36, 
                backgroundColor: '#333',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: 'white',
                fontSize: 16,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#667eea';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#333';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                📘
              </a>
              <a href="#" style={{ 
                width: 36, 
                height: 36, 
                backgroundColor: '#333',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: 'white',
                fontSize: 16,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1DA1F2';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#333';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                🐦
              </a>
              <a href="#" style={{ 
                width: 36, 
                height: 36, 
                backgroundColor: '#333',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: 'white',
                fontSize: 16,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E4405F';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#333';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                📷
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: 16,
              fontWeight: 600,
              color: 'white',
              marginBottom: 16
            }}>
              Hızlı Linkler
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/" style={{ 
                color: '#999',
                textDecoration: 'none',
                fontSize: 14,
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
              >
                Ana Sayfa
              </Link>
              <Link to="/products" style={{ 
                color: '#999',
                textDecoration: 'none',
                fontSize: 14,
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
              >
                Ürünler
              </Link>
              <Link to="/cart" style={{ 
                color: '#999',
                textDecoration: 'none',
                fontSize: 14,
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
              >
                Sepet
              </Link>
              <Link to="/orders" style={{ 
                color: '#999',
                textDecoration: 'none',
                fontSize: 14,
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
              >
                Siparişlerim
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 style={{
              fontSize: 16,
              fontWeight: 600,
              color: 'white',
              marginBottom: 16
            }}>
              Müşteri Hizmetleri
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="#" style={{ 
                color: '#999',
                textDecoration: 'none',
                fontSize: 14,
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
              >
                İletişim
              </a>
              <a href="#" style={{ 
                color: '#999',
                textDecoration: 'none',
                fontSize: 14,
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
              >
                SSS
              </a>
              <a href="#" style={{ 
                color: '#999',
                textDecoration: 'none',
                fontSize: 14,
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
              >
                Kargo Takibi
              </a>
              <a href="#" style={{ 
                color: '#999',
                textDecoration: 'none',
                fontSize: 14,
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
              >
                İade & Değişim
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{
              fontSize: 16,
              fontWeight: 600,
              color: 'white',
              marginBottom: 16
            }}>
              Yasal
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="#" style={{ 
                color: '#999',
                textDecoration: 'none',
                fontSize: 14,
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
              >
                Gizlilik Politikası
              </a>
              <a href="#" style={{ 
                color: '#999',
                textDecoration: 'none',
                fontSize: 14,
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
              >
                Kullanım Koşulları
              </a>
              <a href="#" style={{ 
                color: '#999',
                textDecoration: 'none',
                fontSize: 14,
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
              >
                Çerez Politikası
              </a>
              <a href="#" style={{ 
                color: '#999',
                textDecoration: 'none',
                fontSize: 14,
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
              >
                KVKK
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: 30,
          borderTop: '1px solid #333',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <p style={{
            margin: 0,
            fontSize: 14,
            color: '#999'
          }}>
            © 2024 MERN Store. Tüm hakları saklıdır.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            <span style={{ fontSize: 14, color: '#999' }}>💳 Güvenli Ödeme</span>
            <span style={{ fontSize: 14, color: '#999' }}>🚚 Hızlı Kargo</span>
            <span style={{ fontSize: 14, color: '#999' }}>↩️ Kolay İade</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

