import React from 'react';
import { Link } from 'react-router-dom';

interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  images: string[];
  price: number;
  stock: number;
  category: string;
  ratingAvg: number;
  ratingCount: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    }}
    >
      <Link to={`/products/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}>
        {/* Product Image */}
        <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.title}
              style={{ 
                width: '100%', 
                height: 220, 
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
            />
          ) : (
            <div style={{ 
              width: '100%', 
              height: 220, 
              backgroundColor: '#f0f0f0', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#999',
              fontSize: 14
            }}>
              📷 Resim Yok
            </div>
          )}
          
          {/* Badge - Stock Status */}
          <div style={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: product.stock > 0 ? '#27ae60' : '#e74c3c',
            color: 'white',
            padding: '4px 10px',
            borderRadius: 16,
            fontSize: 11,
            fontWeight: 600,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            {product.stock > 0 ? '✓ Stokta' : '✗ Tükendi'}
          </div>
        </div>

        {/* Product Info */}
        <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Category Badge */}
          <div style={{ marginBottom: 10 }}>
            <span style={{ 
              backgroundColor: '#3498db',
              color: 'white',
              padding: '4px 10px',
              borderRadius: 12,
              fontSize: 11,
              fontWeight: 500
            }}>
              {product.category}
            </span>
          </div>

          {/* Title */}
          <h3 style={{ 
            margin: '0 0 12px 0', 
            fontSize: 16, 
            fontWeight: 600,
            color: '#2c3e50',
            lineHeight: 1.4,
            minHeight: '2.8em',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {product.title}
          </h3>

          {/* Rating */}
          {product.ratingCount > 0 && (
            <div style={{ 
              marginBottom: 12, 
              display: 'flex', 
              alignItems: 'center',
              gap: 6
            }}>
              <span style={{ fontSize: 14, color: '#f39c12' }}>
                {'⭐'.repeat(Math.floor(product.ratingAvg))}
              </span>
              <span style={{ fontSize: 13, color: '#7f8c8d', fontWeight: 500 }}>
                ({product.ratingAvg.toFixed(1)}) - {product.ratingCount} değerlendirme
              </span>
            </div>
          )}

          {/* Price - Bottom */}
          <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #e8e8e8' }}>
            <div style={{ 
              fontSize: 24, 
              fontWeight: 700, 
              color: '#e74c3c',
              display: 'flex',
              alignItems: 'baseline',
              gap: 4
            }}>
              <span style={{ fontSize: 14, fontWeight: 400, color: '#7f8c8d' }}>$</span>
              {product.price.toFixed(2)}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
