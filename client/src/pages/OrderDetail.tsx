import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetOrderByIdQuery } from '../app/api';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetOrderByIdQuery(id!);

  if (isLoading) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <p>Sipariş yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: 'red' }}>
        <p>Sipariş bulunamadı</p>
      </div>
    );
  }

  if (!data?.order) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <p>Sipariş bulunamadı</p>
      </div>
    );
  }

  const { order } = data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'processing': return '#3498db';
      case 'shipped': return '#9b59b6';
      case 'delivered': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
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
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2>Sipariş Detayı</h2>
      
      <div style={{
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 20,
        backgroundColor: 'white',
        marginBottom: 20
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 20 }}>Sipariş #{order._id.slice(-8)}</h3>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>
              {new Date(order.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })} - {new Date(order.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{
              backgroundColor: getStatusColor(order.status),
              color: 'white',
              padding: '6px 16px',
              borderRadius: 4,
              fontSize: 14,
              textTransform: 'uppercase',
              fontWeight: 'bold'
            }}>
              {getStatusText(order.status)}
            </span>
            <p style={{ margin: '10px 0 0 0', fontSize: 18, fontWeight: 'bold' }}>
              ₺{order.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Sipariş Kalemleri */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ margin: '0 0 15px 0' }}>Sipariş Kalemleri</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {order.items.map((item: any, index: number) => (
              <div key={index} style={{ 
                display: 'flex', 
                gap: 15, 
                padding: 12, 
                border: '1px solid #eee', 
                borderRadius: 4 
              }}>
                <div>
                  {item.product?.images?.[0] ? (
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.title}
                      style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                    />
                  ) : (
                    <div style={{ 
                      width: 60, 
                      height: 60, 
                      backgroundColor: '#f0f0f0', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      borderRadius: 4,
                      fontSize: 12,
                      color: '#999'
                    }}>
                      Resim Yok
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <h5 style={{ margin: '0 0 5px 0', fontSize: 16 }}>{item.product?.title || 'Ürün'}</h5>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: 14 }}>
                    Kategori: {item.product?.category || '—'}
                  </p>
                  <p style={{ margin: 0, color: '#666', fontSize: 14 }}>
                    Adet: {item.quantity} × ₺{item.price.toFixed(2)}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 'bold' }}>
                    ₺{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kargo Adresi */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Kargo Adresi</h4>
          <div style={{ 
            padding: 12, 
            backgroundColor: '#f8f9fa', 
            borderRadius: 4,
            fontSize: 14
          }}>
            <p style={{ margin: '0 0 5px 0' }}>{order.shippingAddress.street}</p>
            <p style={{ margin: '0 0 5px 0' }}>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </p>
            <p style={{ margin: 0 }}>{order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Ödeme Bilgileri */}
        <div>
          <h4 style={{ margin: '0 0 10px 0' }}>Ödeme Bilgileri</h4>
          <div style={{ 
            padding: 12, 
            backgroundColor: '#f8f9fa', 
            borderRadius: 4,
            fontSize: 14
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span>Yöntem:</span>
              <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                {getPaymentMethodText(order.payment.method)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span>Durum:</span>
              <span style={{
                backgroundColor: order.payment.status === 'paid' ? '#27ae60' : '#f39c12',
                color: 'white',
                padding: '2px 8px',
                borderRadius: 3,
                fontSize: 12,
                textTransform: 'uppercase'
              }}>
                {order.payment.status === 'paid' ? 'Ödendi' : 'Beklemede'}
              </span>
            </div>
            {order.payment.transactionId && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>İşlem No:</span>
                <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
                  {order.payment.transactionId}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
