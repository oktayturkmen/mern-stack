import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h2>Sepetiniz Boş</h2>
        <p>Sepetinize ürün ekleyerek başlayın.</p>
        <Link to="/products" style={{ 
          display: 'inline-block', 
          padding: '10px 20px', 
          backgroundColor: '#3498db', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: 4 
        }}>
          Alışverişe Devam Et
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
      <h2>Alışveriş Sepeti ({getTotalItems()} ürün)</h2>
      
      <div style={{ display: 'flex', gap: 30 }}>
        {/* Cart Items */}
        <div style={{ flex: 2 }}>
          {items.map((item) => (
            <div key={item.productId} style={{
              display: 'flex',
              gap: 15,
              padding: 15,
              border: '1px solid #ddd',
              borderRadius: 8,
              marginBottom: 15,
              backgroundColor: 'white'
            }}>
              {/* Product Image */}
              <div>
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.title}
                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
                  />
                ) : (
                  <div style={{ 
                    width: 80, 
                    height: 80, 
                    backgroundColor: '#f0f0f0', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    borderRadius: 4,
                    fontSize: 12,
                    color: '#999'
                  }}>
                    No Image
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: 16 }}>{item.title}</h3>
                <p style={{ margin: '0 0 8px 0', color: '#666' }}>${item.price}</p>
                
                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button 
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    style={{ padding: '4px 8px', fontSize: 14 }}
                  >
                    -
                  </button>
                  <span style={{ minWidth: 30, textAlign: 'center' }}>{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    style={{ padding: '4px 8px', fontSize: 14 }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price */}
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 'bold' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button 
                  onClick={() => removeFromCart(item.productId)}
                  style={{ 
                    marginTop: 8, 
                    padding: '4px 8px', 
                    backgroundColor: '#e74c3c', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 4,
                    fontSize: 12
                  }}
                >
                  Kaldır
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{ flex: 1 }}>
          <div style={{
            padding: 20,
            border: '1px solid #ddd',
            borderRadius: 8,
            backgroundColor: '#f8f9fa',
            position: 'sticky',
            top: 20
          }}>
            <h3 style={{ marginTop: 0 }}>Sipariş Özeti</h3>
            
            <div style={{ borderTop: '1px solid #ddd', paddingTop: 15 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span>Ara Toplam:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span>Kargo:</span>
                <span>$0.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, fontWeight: 'bold', fontSize: 18, paddingTop: 10, borderTop: '1px solid #ddd' }}>
                <span>Toplam:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>

              <button 
                onClick={handleProceedToCheckout}
                disabled={items.length === 0}
                style={{
                  width: '100%',
                  padding: 14,
                  backgroundColor: items.length === 0 ? '#bdc3c7' : '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  fontSize: 16,
                  fontWeight: 'bold',
                  cursor: items.length === 0 ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                Ödemeye Geç
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}