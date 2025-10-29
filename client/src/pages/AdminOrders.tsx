import React, { useState } from 'react';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../app/api';

export default function AdminOrders() {
  const { data, isLoading, error, refetch } = useGetAllOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [selectedStatus, setSelectedStatus] = useState<{[key: string]: string}>({});

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      setSelectedStatus({ ...selectedStatus, [orderId]: newStatus });
      refetch();
    } catch (error) {
      console.error('Status update failed:', error);
      alert('Status update failed. Please try again.');
    }
  };

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

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  if (isLoading) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: 'red' }}>
        <p>Error loading orders</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      <h2>Admin - Order Management</h2>
      
      <div style={{ display: 'grid', gap: 20 }}>
        {data?.orders?.map((order: any) => (
          <div key={order._id} style={{
            padding: 20,
            border: '1px solid #ddd',
            borderRadius: 8,
            backgroundColor: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>Order #{order._id.slice(-8)}</h3>
                <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                  Customer: {order.user?.name || 'Unknown'} ({order.user?.email || 'No email'})
                </p>
                <p style={{ margin: 0, color: '#666' }}>
                  Placed: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ marginBottom: 10 }}>
                  <span style={{
                    backgroundColor: getStatusColor(order.status),
                    color: 'white',
                    padding: '6px 16px',
                    borderRadius: 4,
                    fontSize: 14,
                    textTransform: 'uppercase',
                    fontWeight: 'bold'
                  }}>
                    {order.status}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 'bold' }}>
                  ${order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ margin: '0 0 15px 0' }}>Order Items</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                          No Image
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{ margin: '0 0 5px 0', fontSize: 16 }}>{item.product?.title || 'Product'}</h5>
                      <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: 14 }}>
                        Category: {item.product?.category || 'N/A'}
                      </p>
                      <p style={{ margin: 0, color: '#666', fontSize: 14 }}>
                        Quantity: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: 16, fontWeight: 'bold' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ margin: '0 0 10px 0' }}>Shipping Address</h4>
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

            {/* Payment Information */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ margin: '0 0 10px 0' }}>Payment Information</h4>
              <div style={{ 
                padding: 12, 
                backgroundColor: '#f8f9fa', 
                borderRadius: 4,
                fontSize: 14
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span>Method:</span>
                  <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                    {order.payment.method}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span>Status:</span>
                  <span style={{
                    backgroundColor: order.payment.status === 'paid' ? '#27ae60' : '#f39c12',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: 3,
                    fontSize: 12,
                    textTransform: 'uppercase'
                  }}>
                    {order.payment.status}
                  </span>
                </div>
                {order.payment.transactionId && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Transaction ID:</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
                      {order.payment.transactionId}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Update */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
              <label style={{ fontWeight: 'bold' }}>Update Status:</label>
              <select
                value={selectedStatus[order._id] || order.status}
                onChange={(e) => setSelectedStatus({ ...selectedStatus, [order._id]: e.target.value })}
                style={{ padding: '8px 12px', borderRadius: 4, border: '1px solid #ddd' }}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleStatusUpdate(order._id, selectedStatus[order._id] || order.status)}
                disabled={selectedStatus[order._id] === order.status}
                style={{
                  padding: '8px 16px',
                  backgroundColor: selectedStatus[order._id] === order.status ? '#bdc3c7' : '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: selectedStatus[order._id] === order.status ? 'not-allowed' : 'pointer'
                }}
              >
                Update Status
              </button>
            </div>
          </div>
        ))}
      </div>

      {data?.orders?.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>
          <p>No orders found.</p>
        </div>
      )}
    </div>
  );
}
