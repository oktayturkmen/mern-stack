import React, { useState } from 'react';
import { useLoginMutation } from '../app/api';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
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
          TEKRAR HOŞGELDİNİZ
        </h2>
        <p style={{ 
          marginBottom: 32,
          color: '#666',
          fontSize: 15,
          textAlign: 'center',
          lineHeight: 1.5
        }}>
          Gelişmiş bir alışveriş deneyimine erişmek için oturum açın.
        </p>

        <form onSubmit={handleSubmit}>
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

          <div style={{ marginBottom: 24 }}>
            <label htmlFor="password" style={{ 
              display: 'block', 
              marginBottom: 8, 
              fontSize: 14, 
              fontWeight: 500,
              color: '#333'
            }}>
              Şifre*
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
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
              backgroundColor: isLoading ? '#95a5a6' : '#2c3e50', 
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
                e.currentTarget.style.backgroundColor = '#1a252f';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#2c3e50';
              }
            }}
          >
            {isLoading ? 'Giriş yapılıyor...' : 'Giriş yap'}
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
              Giriş başarısız. Lütfen bilgilerinizi kontrol edin.
            </div>
          )}
        </form>

        <p style={{ 
          textAlign: 'center', 
          marginTop: 24,
          color: '#666',
          fontSize: 14
        }}>
          Üye değil misiniz?{' '}
          <Link to="/register" style={{ 
            color: '#2c3e50',
            textDecoration: 'underline',
            fontWeight: 500
          }}>
            Bize katılın.
          </Link>
        </p>
      </div>
    </div>
  );
}
