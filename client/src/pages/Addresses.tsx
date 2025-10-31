import React, { useState, useEffect } from 'react';
import { useGetMeQuery, useAddAddressMutation, useDeleteAddressMutation } from '../app/api';
import AccountLayout from '../components/AccountLayout';

export default function Addresses() {
  const { data: meData, refetch } = useGetMeQuery();
  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const [deleteAddressMutation] = useDeleteAddressMutation();
  const [addresses, setAddresses] = useState(meData?.user?.addresses || []);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Türkiye',
    isDefault: false
  });

  useEffect(() => {
    if (meData?.user?.addresses) {
      setAddresses(meData.user.addresses);
    }
  }, [meData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAddress(formData).unwrap();
      await refetch();
      setShowForm(false);
      setFormData({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Türkiye',
        isDefault: false
      });
    } catch (error) {
      console.error('Failed to add address:', error);
      alert('Adres eklenirken hata oluştu');
    }
  };

  const handleDelete = async (index: number) => {
    if (window.confirm('Bu adresi silmek istediğinize emin misiniz?')) {
      try {
        await deleteAddressMutation(index).unwrap();
        await refetch();
      } catch (error) {
        console.error('Failed to delete address:', error);
        alert('Adres silinirken hata oluştu');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <AccountLayout title="Adres Defterim" subtitle="Teslimat adreslerinizi yönetin">

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
                      <p style={{ margin: '0 0 5px', fontSize: 14, color: '#666' }}>
                        {addr.street}
                      </p>
                      <p style={{ margin: '0 0 5px', fontSize: 14, color: '#666' }}>
                        {addr.city}, {addr.state} {addr.zipCode}
                      </p>
                      <p style={{ margin: '0', fontSize: 14, color: '#666' }}>
                        {addr.country}
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
                          Varsayılan
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        onClick={() => handleDelete(index)}
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
                        Sil
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
                Henüz kayıtlı adresiniz yok
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
            + Yeni Adres Ekle
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>
              Sokak/Adres
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              required
              placeholder="Sokak, cadde, bina no"
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
                İlçe
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                placeholder="İlçe"
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
                İl
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                placeholder="İl"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>
                Posta Kodu
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                required
                placeholder="34000"
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
                Ülke
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
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

          <div style={{ marginBottom: 30, display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleInputChange}
              style={{ marginRight: 10 }}
            />
            <label style={{ fontSize: 14, color: '#1a1a1a' }}>
              Varsayılan adres olarak ayarla
            </label>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="submit"
              disabled={isAdding}
              style={{
                padding: '12px 24px',
                backgroundColor: isAdding ? '#999' : '#1a1a1a',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: isAdding ? 'not-allowed' : 'pointer',
                fontSize: 14,
                fontWeight: 300
              }}
            >
              {isAdding ? 'Kaydediliyor...' : 'Adresi Kaydet'}
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
              İptal
            </button>
          </div>
        </form>
      )}
    </AccountLayout>
  );
}

