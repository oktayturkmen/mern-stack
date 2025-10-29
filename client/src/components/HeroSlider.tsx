import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetMeQuery } from '../app/api';

// Import images directly
import img1 from '../img/11.png';
import img2 from '../img/22.png';
import img3 from '../img/33.png';
import img4 from '../img/44.png';

const heroImages = [img1, img2, img3, img4];

export default function HeroSlider() {
  const { data: meData } = useGetMeQuery();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000); // Her 4 saniyede bir değişir

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div style={{
      position: 'relative',
      height: 500,
      overflow: 'hidden',
      marginBottom: 60
    }}>
      {/* Slides */}
      {heroImages.map((img, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: index === currentSlide ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out'
          }}
        >
          <img 
            src={img} 
            alt={`Hero ${index + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      ))}


      {/* Content */}
      <div style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', zIndex: 1 }}>
          <h1 style={{ fontSize: 48, marginBottom: 16, fontWeight: 700, color: 'white' }}>
            MERN Store
          </h1>
          <p style={{ fontSize: 20, marginBottom: 32, opacity: 0.9, lineHeight: 1.6, color: 'white' }}>
            Modern alışveriş deneyimi, binlerce ürün ve güvenli ödeme
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" style={{
              backgroundColor: 'white',
              color: '#667eea',
              padding: '14px 32px',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: 16,
              fontWeight: 600,
              transition: 'all 0.2s ease',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              Ürünleri Keşfet
            </Link>
            {!meData?.user && (
              <Link to="/register" style={{
                backgroundColor: 'transparent',
                color: 'white',
                padding: '14px 32px',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: 16,
                fontWeight: 600,
                border: '2px solid white',
                display: 'inline-block',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              >
                Hemen Üye Ol
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Dots Navigation */}
      <div style={{
        position: 'absolute',
        bottom: 30,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 12,
        zIndex: 2
      }}>
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              border: 'none',
              backgroundColor: index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (index !== currentSlide) {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)';
              }
            }}
            onMouseLeave={(e) => {
              if (index !== currentSlide) {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.5)';
              }
            }}
          />
        ))}
      </div>

      {/* Arrow Navigation */}
      <button
        onClick={() => goToSlide((currentSlide - 1 + heroImages.length) % heroImages.length)}
        style={{
          position: 'absolute',
          left: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 50,
          height: 50,
          borderRadius: '50%',
          border: 'none',
          backgroundColor: 'rgba(255,255,255,0.2)',
          color: 'white',
          fontSize: 24,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          zIndex: 2
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
        }}
      >
        ‹
      </button>

      <button
        onClick={() => goToSlide((currentSlide + 1) % heroImages.length)}
        style={{
          position: 'absolute',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 50,
          height: 50,
          borderRadius: '50%',
          border: 'none',
          backgroundColor: 'rgba(255,255,255,0.2)',
          color: 'white',
          fontSize: 24,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          zIndex: 2
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
        }}
      >
        ›
      </button>
    </div>
  );
}

