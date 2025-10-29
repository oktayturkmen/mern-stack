import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../contexts/CartContext';
import { useCreateOrderMutation, useCreatePaymentIntentMutation } from '../app/api';
import { useGetMeQuery } from '../app/api';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface CheckoutFormProps {
  clientSecret: string;
  orderId: string;
}

function CheckoutForm({ clientSecret, orderId }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { clearCart, getTotalPrice } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success?orderId=${orderId}`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'Ödeme başarısız oldu.');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      clearCart();
      navigate(`/success?orderId=${orderId}&paymentIntentId=${paymentIntent.id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      <PaymentElement />
      {errorMessage && (
        <div style={{ 
          marginTop: 15, 
          padding: 12, 
          backgroundColor: '#fee', 
          color: '#c33', 
          borderRadius: 4,
          fontSize: 14
        }}>
          {errorMessage}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        style={{
          width: '100%',
          padding: 14,
          marginTop: 20,
          backgroundColor: isProcessing ? '#bdc3c7' : '#27ae60',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          fontSize: 16,
          fontWeight: 'bold',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s'
        }}
      >
        {isProcessing ? 'İşleniyor...' : `$${getTotalPrice().toFixed(2)} Ödemeyi Tamamla`}
      </button>
    </form>
  );
}

export default function Checkout() {
  const { items, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const { data: user } = useGetMeQuery();
  const [createOrder] = useCreateOrderMutation();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      navigate('/cart');
      return;
    }
  }, [user, items.length, navigate]);

  const handleInitializePayment = async () => {
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country) {
      setError('Lütfen tüm adres bilgilerini doldurun.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Create order
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingAddress,
        paymentMethod: 'stripe' as const
      };

      const orderResult = await createOrder(orderData).unwrap();
      const newOrderId = orderResult.order._id;
      setOrderId(newOrderId);

      // Create payment intent
      const paymentIntentResult = await createPaymentIntent({
        orderId: newOrderId,
        paymentMethod: 'stripe'
      }).unwrap();

      setClientSecret(paymentIntentResult.paymentIntent.clientSecret);
    } catch (err: any) {
      setError(err?.data?.message || 'Ödeme başlatılamadı. Lütfen tekrar deneyin.');
      console.error('Checkout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || items.length === 0) {
    return null;
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  };

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      <h2>Ödeme</h2>

      <div style={{ display: 'flex', gap: 30, marginTop: 20 }}>
        {/* Left: Cart Items */}
        <div style={{ flex: 1 }}>
          <div style={{
            padding: 20,
            border: '1px solid #ddd',
            borderRadius: 8,
            backgroundColor: 'white'
          }}>
            <h3 style={{ marginTop: 0 }}>Sepetteki Ürünler</h3>
            {items.map((item) => (
              <div key={item.productId} style={{
                display: 'flex',
                gap: 15,
                padding: 15,
                borderBottom: '1px solid #eee',
                marginBottom: 15
              }}>
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.title}
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: 14 }}>{item.title}</h4>
                  <p style={{ margin: '0 0 4px 0', color: '#666', fontSize: 13 }}>
                    ${item.price} x {item.quantity}
                  </p>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            <div style={{ 
              borderTop: '2px solid #ddd', 
              paddingTop: 15, 
              marginTop: 15,
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 'bold',
              fontSize: 18
            }}>
              <span>Toplam:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right: Payment Form */}
        <div style={{ flex: 1 }}>
          {!clientSecret ? (
            <div style={{
              padding: 20,
              border: '1px solid #ddd',
              borderRadius: 8,
              backgroundColor: 'white'
            }}>
              <h3 style={{ marginTop: 0 }}>Teslimat Adresi</h3>
              <div style={{ marginBottom: 15 }}>
                <input
                  type="text"
                  placeholder="Sokak Adresi"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  style={{ width: '100%', padding: 10, marginBottom: 10, border: '1px solid #ddd', borderRadius: 4 }}
                />
                <input
                  type="text"
                  placeholder="Şehir"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  style={{ width: '100%', padding: 10, marginBottom: 10, border: '1px solid #ddd', borderRadius: 4 }}
                />
                <input
                  type="text"
                  placeholder="İl/İlçe"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                  style={{ width: '100%', padding: 10, marginBottom: 10, border: '1px solid #ddd', borderRadius: 4 }}
                />
                <input
                  type="text"
                  placeholder="Posta Kodu"
                  value={shippingAddress.zipCode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                  style={{ width: '100%', padding: 10, marginBottom: 10, border: '1px solid #ddd', borderRadius: 4 }}
                />
                <input
                  type="text"
                  placeholder="Ülke"
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                  style={{ width: '100%', padding: 10, marginBottom: 15, border: '1px solid #ddd', borderRadius: 4 }}
                />
              </div>
              {error && (
                <div style={{ 
                  marginBottom: 15, 
                  padding: 12, 
                  backgroundColor: '#fee', 
                  color: '#c33', 
                  borderRadius: 4,
                  fontSize: 14
                }}>
                  {error}
                </div>
              )}
              <button
                onClick={handleInitializePayment}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: 14,
                  backgroundColor: isLoading ? '#bdc3c7' : '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  fontSize: 16,
                  fontWeight: 'bold',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? 'İşleniyor...' : 'Ödeme Formunu Göster'}
              </button>
            </div>
          ) : (
            <div style={{
              padding: 20,
              border: '1px solid #ddd',
              borderRadius: 8,
              backgroundColor: 'white'
            }}>
              <h3 style={{ marginTop: 0 }}>Ödeme Yöntemi</h3>
              <Elements stripe={stripePromise} options={options}>
                {orderId && <CheckoutForm clientSecret={clientSecret} orderId={orderId} />}
              </Elements>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

