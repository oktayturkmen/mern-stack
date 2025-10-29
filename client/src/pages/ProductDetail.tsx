import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductBySlugQuery } from '../app/api';
import { useCart } from '../contexts/CartContext';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetProductBySlugQuery(slug!);
  const { addToCart } = useCart();
  const [showNotification, setShowNotification] = useState(false);

  const handleAddToCart = () => {
    if (data?.product) {
      addToCart(
        data.product._id,
        data.product.title,
        data.product.price,
        data.product.images?.[0]
      );
      setShowNotification(true);
    }
  };

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  if (isLoading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: '#666' }}>Ürün yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#e74c3c' }}>
        <p>Ürün bulunamadı</p>
      </div>
    );
  }

  if (!data?.product) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: '#666' }}>Ürün bulunamadı</p>
      </div>
    );
  }

  const { product } = data;

  return (
    <div style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Notification */}
      {showNotification && (
        <div style={{
          position: 'fixed',
          top: 100,
          right: 20,
          backgroundColor: 'white',
          border: '1px solid #e8e8e8',
          borderRadius: 8,
          padding: '20px 24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 9999,
          minWidth: 280,
          display: 'flex',
          alignItems: 'center',
          gap: 14
        }}>
          {/* Checkmark Icon */}
          <div style={{
            backgroundColor: '#10b981',
            color: 'white',
            width: 36,
            height: 36,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            flexShrink: 0
          }}>
            ✓
          </div>
          
          {/* Text Content */}
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontSize: 14, 
              fontWeight: 600, 
              color: '#1a1a1a', 
              marginBottom: 4 
            }}>
              Ürün sepete eklendi
            </div>
            <button
              onClick={() => navigate('/cart')}
              style={{
                fontSize: 13,
                color: '#10b981',
                textDecoration: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontWeight: 500
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              Sepete git
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 40, marginBottom: 60 }}>
        {/* Product Images */}
        <div style={{ flex: 1 }}>
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.title}
              style={{ 
                width: '100%', 
                height: 500, 
                objectFit: 'cover', 
                borderRadius: 12,
                border: '1px solid #e8e8e8'
              }}
            />
          ) : (
            <div style={{ 
              width: '100%', 
              height: 500, 
              backgroundColor: '#f8f9fa', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: 12,
              border: '1px solid #e8e8e8',
              color: '#999',
              fontSize: 14
            }}>
              📷 Resim Yok
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={{ flex: 1 }}>
          {/* Category */}
          <div style={{ marginBottom: 16 }}>
            <span style={{ 
              backgroundColor: '#f0f0f0',
              color: '#666',
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {product.category}
            </span>
          </div>

          {/* Title */}
          <h1 style={{ 
            marginBottom: 16,
            fontSize: 28,
            fontWeight: 600,
            color: '#1a1a1a',
            lineHeight: 1.3
          }}>
            {product.title}
          </h1>

          {/* Rating */}
          {product.ratingCount > 0 && (
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ fontSize: 18, color: i < Math.round(product.ratingAvg) ? '#fbbf24' : '#e5e7eb' }}>
                    ★
                  </span>
                ))}
              </div>
              <span style={{ fontSize: 14, color: '#666', fontWeight: 500 }}>
                {product.ratingAvg.toFixed(1)} ({product.ratingCount} değerlendirme)
              </span>
            </div>
          )}

          {/* Stock Status */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: product.stock > 0 ? '#10b981' : '#ef4444'
              }} />
              <span style={{ fontSize: 14, color: '#666', fontWeight: 500 }}>
                {product.stock > 0 ? `Stokta (${product.stock} adet)` : 'Tükendi'}
              </span>
            </div>
          </div>

          {/* Price */}
          <div style={{ marginBottom: 30, paddingBottom: 24, borderBottom: '1px solid #e8e8e8' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 400, color: '#666' }}>₺</span>
              <span style={{ fontSize: 36, fontWeight: 700, color: '#1a1a1a' }}>
                {product.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              backgroundColor: product.stock > 0 ? '#1a1a1a' : '#e5e7eb',
              color: 'white',
              padding: '14px 32px',
              border: 'none',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 500,
              cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              if (product.stock > 0) {
                e.currentTarget.style.backgroundColor = '#333';
              }
            }}
            onMouseLeave={(e) => {
              if (product.stock > 0) {
                e.currentTarget.style.backgroundColor = '#1a1a1a';
              }
            }}
          >
            {product.stock > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
          </button>
        </div>
      </div>

      {/* Product Description */}
      <div style={{ 
        marginBottom: 40, 
        padding: '40px 0',
        borderTop: '2px solid #f0f0f0',
        borderBottom: '2px solid #f0f0f0'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12, 
          marginBottom: 24 
        }}>
          <div style={{
            width: 4,
            height: 24,
            backgroundColor: '#1a1a1a',
            borderRadius: 2
          }} />
          <h3 style={{ 
            margin: 0, 
            fontSize: 24, 
            fontWeight: 700, 
            color: '#1a1a1a',
            letterSpacing: '-0.5px'
          }}>
            Ürün Detayları
          </h3>
        </div>
        <div style={{
          backgroundColor: '#fafafa',
          padding: '30px 40px',
          borderRadius: 12,
          border: '1px solid #e8e8e8'
        }}>
          <p style={{ 
            lineHeight: 1.9, 
            color: '#333', 
            fontSize: 16,
            margin: 0,
            whiteSpace: 'pre-wrap'
          }}>
            {product.description}
          </p>
        </div>
      </div>

      {/* Reviews Section */}
      <div>
        <ReviewForm productId={product._id} />
        <ReviewList productId={product._id} />
      </div>
    </div>
  );
}
