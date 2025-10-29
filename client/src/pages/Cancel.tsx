import React from 'react';
import { Link } from 'react-router-dom';

export default function Cancel() {
  return (
    <div style={{ 
      padding: 40, 
      textAlign: 'center',
      maxWidth: 600,
      margin: '0 auto'
    }}>
      <div style={{
        fontSize: 64,
        marginBottom: 20
      }}>
        ❌
      </div>
      <h2 style={{ color: '#e74c3c', marginBottom: 15 }}>
        Ödeme İptal Edildi
      </h2>
      <p style={{ fontSize: 16, color: '#666', marginBottom: 30 }}>
        Ödeme işlemi iptal edildi. Herhangi bir ücret tahsil edilmedi.
      </p>
      <div style={{ display: 'flex', gap: 15, justifyContent: 'center' }}>
        <Link
          to="/cart"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#3498db',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 4,
            fontSize: 16,
            fontWeight: 'bold'
          }}
        >
          Sepete Dön
        </Link>
        <Link
          to="/products"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#95a5a6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 4,
            fontSize: 16,
            fontWeight: 'bold'
          }}
        >
          Alışverişe Devam Et
        </Link>
      </div>
    </div>
  );
}

