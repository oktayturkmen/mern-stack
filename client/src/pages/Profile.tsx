import React, { useState, useEffect } from 'react';
import { useGetMeQuery, useUpdateProfileMutation } from '../app/api';
import AccountLayout from '../components/AccountLayout';

export default function Profile() {
  const { data: meData, refetch } = useGetMeQuery();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [form, setForm] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    birthDate: '',
    gender: 'other' as 'female' | 'male' | 'other'
  });

  // Update form when meData loads
  useEffect(() => {
    if (meData?.user) {
      setForm({
        name: meData.user.name || '',
        surname: meData.user.surname || '',
        phone: meData.user.phone || '',
        email: meData.user.email || '',
        birthDate: meData.user.birthDate || '',
        gender: (meData.user.gender as 'female' | 'male' | 'other') || 'other'
      });
    }
  }, [meData]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: form.name,
        email: form.email,
        phone: form.phone,
        gender: form.gender
      }).unwrap();
      await refetch();
      alert('Profil bilgileri güncellendi!');
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      alert('Profil güncellenirken bir hata oluştu.');
    }
  };

  return (
    <AccountLayout title="Profil Bilgilerim" subtitle="Bilgilerini güncel tut">
      <form onSubmit={handleSubmit} style={{
        border: '1px solid #e5e7eb', borderRadius: 12, backgroundColor: 'white',
        padding: 24, maxWidth: 720
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: '#6b7280', marginBottom: 8 }}>Ad</label>
            <input name="name" value={form.name} onChange={onChange} placeholder="Ad" style={{
              width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, boxSizing: 'border-box'
            }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: '#6b7280', marginBottom: 8 }}>Soyad</label>
            <input name="surname" value={form.surname} onChange={onChange} placeholder="Soyad" style={{
              width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, boxSizing: 'border-box'
            }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, color: '#6b7280', marginBottom: 8 }}>Telefon numarası</label>
            <input name="phone" value={form.phone} onChange={onChange} placeholder="05xx..." style={{
              width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, boxSizing: 'border-box'
            }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: '#6b7280', marginBottom: 8 }}>Email adresi</label>
            <input name="email" value={form.email} onChange={onChange} placeholder="mail@example.com" style={{
              width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, boxSizing: 'border-box'
            }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, color: '#6b7280', marginBottom: 8 }}>Doğum tarihi</label>
            <input type="date" name="birthDate" value={form.birthDate} onChange={onChange} style={{
              width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, boxSizing: 'border-box'
            }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, color: '#6b7280', marginBottom: 8 }}>Cinsiyet</label>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', paddingTop: 4 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="radio" name="gender" value="female" checked={form.gender === 'female'} onChange={onChange} /> Kadın
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="radio" name="gender" value="male" checked={form.gender === 'male'} onChange={onChange} /> Erkek
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="radio" name="gender" value="other" checked={form.gender === 'other'} onChange={onChange} /> Belirtmek istemiyorum
              </label>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              padding: '12px 22px', 
              backgroundColor: isLoading ? '#9ca3af' : '#111827', 
              color: 'white', 
              border: 'none',
              borderRadius: 10, 
              fontSize: 14, 
              fontWeight: 600, 
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </AccountLayout>
  );
}


