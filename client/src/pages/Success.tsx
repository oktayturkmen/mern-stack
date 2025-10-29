import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useConfirmPaymentMutation } from '../app/api';

export default function Success() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const paymentIntentId = searchParams.get('paymentIntentId');
  const [confirmPayment] = useConfirmPaymentMutation();
  const [confirmed, setConfirmed] = useState(false);

  // Fallback: Webhook yoksa ödemeyi sunucuda işaretle
  useEffect(() => {
    const run = async () => {
      if (!paymentIntentId || confirmed) return;
      try {
        await confirmPayment({ paymentMethod: 'stripe', paymentIntentId }).unwrap();
        setConfirmed(true);
      } catch (err) {
        // Sessiz geç; Orders sayfası gerçek durumu gösterecek
        // console.error('Confirm payment fallback failed', err);
      }
    };
    run();
  }, [paymentIntentId, confirmPayment, confirmed]);

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
        ✅
      </div>
      <h2 style={{ color: '#27ae60', marginBottom: 15 }}>
        Ödeme Başarılı!
      </h2>
      <p style={{ fontSize: 16, color: '#666', marginBottom: 30 }}>
        Siparişiniz başarıyla alındı. En kısa sürede kargoya verilecektir.
      </p>
      {orderId && (
        <div style={{
          padding: 15,
          backgroundColor: '#f8f9fa',
          borderRadius: 4,
          marginBottom: 20,
          fontSize: 14
        }}>
          <strong>Sipariş No:</strong> {orderId}
          {paymentIntentId && (
            <>
              <br />
              <strong>Ödeme ID:</strong> {paymentIntentId}
            </>
          )}
        </div>
      )}
      <div style={{ display: 'flex', gap: 15, justifyContent: 'center' }}>
        <Link
          to="/orders"
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
          Siparişlerim
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

