import React, { useState } from 'react';
import { useGetMeQuery } from '../app/api';

export default function Addresses() {
  const { data: meData } = useGetMeQuery();
  const [addresses, setAddresses] = useState(meData?.user?.addresses || []);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    isDefault: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement address addition/update
    console.log('Address submitted:', formData);
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 40 }}>
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ fontSize: 28, fontWeight: 400, margin: '0 0 10px', color: '#1a1a1a' }}>
          Addresses
        </h1>
        <p style={{ color: '#666', fontSize: 14 }}>
          Manage your shipping addresses
        </p>
      </div>

      {!showForm ? (
        <>
          {addresses.length > 0 ? (
            <div style={{ marginBottom: 30 }}>
              {addresses.map((addr, index) => (
                <div 
                  key={index}
                  style={{
                    padding: 20,
                    border: '1px solid #e8e8e8',
                    borderRadius: 8,
                    marginBottom: 15
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <p style={{ margin: '0 0 5px', fontSize: 16, fontWeight: 500, color: '#1a1a1a' }}>
                        {addr.name}
                      </p>
                      <p style={{ margin: '0 0 5px', fontSize: 14, color: '#666' }}>
                        {addr.phone}
                      </p>
                      <p style={{ margin: '0 0 5px', fontSize: 14, color: '#666' }}>
                        {addr.address}
                      </p>
                      <p style={{ margin: '0', fontSize: 14, color: '#666' }}>
                        {addr.city}, {addr.state} {addr.zip}
                      </p>
                      {addr.isDefault && (
                        <span style={{
                          display: 'inline-block',
                          marginTop: 10,
                          padding: '4px 12px',
                          backgroundColor: '#1a1a1a',
                          color: 'white',
                          borderRadius: 4,
                          fontSize: 12
                        }}>
                          Default
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        style={{
                          padding: '8px 16px',
                          backgroundColor: 'transparent',
                          color: '#1a1a1a',
                          border: '1px solid #e8e8e8',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 14
                        }}
                      >
                        Edit
                      </button>
                      <button
                        style={{
                          padding: '8px 16px',
                          backgroundColor: 'transparent',
                          color: '#e74c3c',
                          border: '1px solid #e8e8e8',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 14
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              padding: 40, 
              textAlign: 'center', 
              border: '1px solid #e8e8e8',
              borderRadius: 8
            }}>
              <p style={{ color: '#666', fontSize: 14 }}>
                No addresses saved yet
              </p>
            </div>
          )}

          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#1a1a1a',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 300
            }}
          >
            + Add New Address
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #e8e8e8',
                borderRadius: 4,
                fontSize: 14
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #e8e8e8',
                borderRadius: 4,
                fontSize: 14
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #e8e8e8',
                borderRadius: 4,
                fontSize: 14
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e8e8e8',
                  borderRadius: 4,
                  fontSize: 14
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e8e8e8',
                  borderRadius: 4,
                  fontSize: 14
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>
              ZIP Code
            </label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #e8e8e8',
                borderRadius: 4,
                fontSize: 14
              }}
            />
          </div>

          <div style={{ marginBottom: 30, display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleInputChange}
              style={{ marginRight: 10 }}
            />
            <label style={{ fontSize: 14, color: '#1a1a1a' }}>
              Set as default address
            </label>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                backgroundColor: '#1a1a1a',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 300
              }}
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                padding: '12px 24px',
                backgroundColor: 'transparent',
                color: '#1a1a1a',
                border: '1px solid #e8e8e8',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 300
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

