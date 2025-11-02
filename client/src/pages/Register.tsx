import React, { useState } from 'react';
import { useRegisterMutation } from '../app/api';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', gender: 'other' as 'female' | 'male' | 'other', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [register, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: 'calc(100vh - 200px)',
      padding: '40px 20px'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: 450, 
        padding: '40px 20px'
      }}>
        <h2 style={{ 
          marginTop: 0, 
          marginBottom: 8, 
          fontSize: 28, 
          fontWeight: 700,
          color: '#1a1a1a',
          textAlign: 'center'
        }}>
          BİZE KATILIN
        </h2>
        <p style={{ 
          marginBottom: 32,
          color: '#666',
          fontSize: 15,
          textAlign: 'center',
          lineHeight: 1.5
        }}>
          Hesap oluşturun ve alışverişe başlayın.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="name" style={{ 
              display: 'block', 
              marginBottom: 8, 
              fontSize: 14, 
              fontWeight: 500,
              color: '#333'
            }}>
              Ad Soyad*
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Adınız Soyadınız"
              style={{ 
                width: '100%', 
                padding: '14px 16px', 
                backgroundColor: '#f5f5f5',
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                fontSize: 15,
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3498db';
                e.target.style.backgroundColor = 'white';
                e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.backgroundColor = '#f5f5f5';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label htmlFor="email" style={{ 
              display: 'block', 
              marginBottom: 8, 
              fontSize: 14, 
              fontWeight: 500,
              color: '#333'
            }}>
              E-posta*
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="ornek@email.com"
              style={{ 
                width: '100%', 
                padding: '14px 16px', 
                backgroundColor: '#f5f5f5',
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                fontSize: 15,
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3498db';
                e.target.style.backgroundColor = 'white';
                e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.backgroundColor = '#f5f5f5';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label htmlFor="phone" style={{ 
              display: 'block', 
              marginBottom: 8, 
              fontSize: 14, 
              fontWeight: 500,
              color: '#333'
            }}>
              Telefon Numarası*
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              placeholder="05xx xxx xx xx"
              style={{ 
                width: '100%', 
                padding: '14px 16px', 
                backgroundColor: '#f5f5f5',
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                fontSize: 15,
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3498db';
                e.target.style.backgroundColor = 'white';
                e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.backgroundColor = '#f5f5f5';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label htmlFor="gender" style={{ 
              display: 'block', 
              marginBottom: 8, 
              fontSize: 14, 
              fontWeight: 500,
              color: '#333'
            }}>
              Cinsiyet
            </label>
            <div style={{ 
              display: 'flex', 
              gap: 20, 
              alignItems: 'center',
              padding: '12px 16px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #e0e0e0',
              borderRadius: 8
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 15 }}>
                <input 
                  type="radio" 
                  name="gender" 
                  value="female" 
                  checked={formData.gender === 'female'} 
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'female' | 'male' | 'other' })} 
                  style={{ cursor: 'pointer' }}
                />
                Kadın
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 15 }}>
                <input 
                  type="radio" 
                  name="gender" 
                  value="male" 
                  checked={formData.gender === 'male'} 
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'female' | 'male' | 'other' })} 
                  style={{ cursor: 'pointer' }}
                />
                Erkek
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 15 }}>
                <input 
                  type="radio" 
                  name="gender" 
                  value="other" 
                  checked={formData.gender === 'other'} 
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'female' | 'male' | 'other' })} 
                  style={{ cursor: 'pointer' }}
                />
                Belirtmek istemiyorum
              </label>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label htmlFor="password" style={{ 
              display: 'block', 
              marginBottom: 8, 
              fontSize: 14, 
              fontWeight: 500,
              color: '#333'
            }}>
              Şifre* (en az 6 karakter)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                placeholder="••••••••"
                style={{ 
                  width: '100%', 
                  padding: '14px 45px 14px 16px', 
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #e0e0e0',
                  borderRadius: 8,
                  fontSize: 15,
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3498db';
                  e.target.style.backgroundColor = 'white';
                  e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.backgroundColor = '#f5f5f5';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  fontSize: 18,
                  color: '#666'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '16px', 
              backgroundColor: isLoading ? '#95a5a6' : '#27ae60', 
              color: 'white', 
              border: 'none', 
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: 24
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#229954';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#27ae60';
              }
            }}
          >
            {isLoading ? 'Kayıt oluşturuluyor...' : 'Kayıt ol'}
          </button>

          {error && (
            <div style={{ 
              color: '#e74c3c', 
              marginBottom: 16,
              padding: '12px',
              backgroundColor: '#fee',
              borderRadius: 8,
              fontSize: 14
            }}>
              Kayıt başarısız. Lütfen tekrar deneyin.
            </div>
          )}
        </form>

        <p style={{ 
          textAlign: 'center', 
          marginTop: 24,
          color: '#666',
          fontSize: 14
        }}>
          Zaten hesabınız var mı?{' '}
          <Link to="/login" style={{ 
            color: '#2c3e50',
            textDecoration: 'underline',
            fontWeight: 500
          }}>
            Giriş yapın.
          </Link>
        </p>
      </div>
    </div>
  );
}
