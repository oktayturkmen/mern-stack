import React from 'react';
import { useGetMyOrdersQuery } from '../app/api';
import { Link } from 'react-router-dom';

export default function Orders() {
  const { data, isLoading, error } = useGetMyOrdersQuery();

  if (isLoading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: '#666' }}>Siparişler yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#e74c3c' }}>
        <p>Siparişler yüklenirken hata oluştu</p>
      </div>
    );
  }

  if (!data?.orders || data.orders.length === 0) {
    return (
      <div style={{ padding: 80, textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>📦</div>
        <h2 style={{ fontSize: 24, fontWeight: 600, color: '#1a1a1a', marginBottom: 12 }}>
          Henüz Siparişiniz Yok
        </h2>
        <p style={{ fontSize: 15, color: '#666', marginBottom: 32, lineHeight: 1.6 }}>
          İlk siparişinizi vermek için ürünleri keşfedin
        </p>
        <Link to="/products" style={{ 
          display: 'inline-block', 
          padding: '12px 32px', 
          backgroundColor: '#1a1a1a', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: 8,
          fontSize: 15,
          fontWeight: 500,
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#333';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#1a1a1a';
        }}
        >
          Ürünleri Keşfet
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#fbbf24';
      case 'processing': return '#3b82f6';
      case 'shipped': return '#8b5cf6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#9ca3af';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Beklemede';
      case 'processing': return 'İşleniyor';
      case 'shipped': return 'Kargoda';
      case 'delivered': return 'Teslim Edildi';
      case 'cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'stripe': return 'Kredi Kartı (Stripe)';
      case 'iyzico': return 'Kredi Kartı (Iyzico)';
      case 'cash': return 'Kapıda Ödeme';
      default: return method;
    }
  };

  return (
    <div style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>
          Siparişlerim
        </h1>
        <p style={{ fontSize: 15, color: '#666' }}>
          Tüm siparişlerinizi buradan takip edebilirsiniz
        </p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {data.orders.map((order: any) => (
          <div key={order._id} style={{
            border: '1px solid #e8e8e8',
            borderRadius: 12,
            padding: 24,
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>
                    #{order._id.slice(-8)}
                  </span>
                  <span style={{
                    backgroundColor: getStatusColor(order.status),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 500
                  }}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                <p style={{ margin: 0, color: '#666', fontSize: 14 }}>
                  {new Date(order.createdAt).toLocaleDateString('tr-TR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1a1a1a' }}>
                  ₺{order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Items */}
            <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f0f0f0' }}>
              {order.items.map((item: any, index: number) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: index < order.items.length - 1 ? 12 : 0
                }}>
                  <div>
                    <span style={{ fontWeight: 500, color: '#1a1a1a', fontSize: 15 }}>
                      {item.product?.title || 'Ürün'}
                    </span>
                    <span style={{ color: '#999', marginLeft: 10, fontSize: 14 }}>
                      x{item.quantity}
                    </span>
                  </div>
                  <span style={{ fontWeight: 600, color: '#1a1a1a', fontSize: 15 }}>
                    ₺{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 16, fontSize: 14, color: '#666' }}>
                <div>
                  <span style={{ marginRight: 8 }}>💳</span>
                  <span style={{
                    backgroundColor: order.payment.status === 'paid' ? '#10b981' : '#fbbf24',
                    color: 'white',
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 500,
                    marginRight: 8
                  }}>
                    {order.payment.status === 'paid' ? 'Ödendi' : 'Bekliyor'}
                  </span>
                  <span style={{ fontSize: 12, color: '#999' }}>
                    {getPaymentMethodText(order.payment.method)}
                  </span>
                </div>
              </div>
              <Link 
                to={`/orders/${order._id}`}
                style={{ 
                  padding: '10px 20px', 
                  backgroundColor: '#1a1a1a', 
                  color: 'white', 
                  textDecoration: 'none', 
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#333';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1a1a1a';
                }}
              >
                Detayları Gör
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
