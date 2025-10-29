import React from 'react';
import HeroSlider from '../components/HeroSlider';

export default function Home() {
  return (
    <div style={{ padding: 0, margin: 0 }}>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Features Section */}
      <div style={{ padding: '60px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 50 
        }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
            Neden MERN Store?
          </h2>
          <p style={{ fontSize: 16, color: '#666', maxWidth: 600, margin: '0 auto' }}>
            Modern teknoloji, güvenli alışveriş ve hızlı teslimat
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 30 }}>
          {/* Feature 1 */}
          <div style={{
            padding: 30,
            backgroundColor: 'white',
            borderRadius: 12,
            border: '1px solid #e8e8e8',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a', marginBottom: 12 }}>
              Hızlı Teslimat
            </h3>
            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>
              Siparişleriniz kısa sürede kapınızda
            </p>
          </div>

          {/* Feature 2 */}
          <div style={{
            padding: 30,
            backgroundColor: 'white',
            borderRadius: 12,
            border: '1px solid #e8e8e8',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a', marginBottom: 12 }}>
              Güvenli Alışveriş
            </h3>
            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>
              256-bit SSL ile güvenli ödeme
            </p>
          </div>

          {/* Feature 3 */}
          <div style={{
            padding: 30,
            backgroundColor: 'white',
            borderRadius: 12,
            border: '1px solid #e8e8e8',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⭐</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a', marginBottom: 12 }}>
              Kaliteli Ürünler
            </h3>
            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>
              Binlerce kaliteli ürün seçeneği
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
