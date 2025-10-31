import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetMeQuery } from '../app/api';

// Import images directly (ordered as requested)
import img1 from '../img/44.png';
import img2 from '../img/55.png';
import img3 from '../img/66.png';

const heroImages = [img1, img2, img3];

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
      height: 420,
      overflow: 'hidden',
      marginBottom: 48
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


      {/* Subtle overlay for readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.25) 100%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '56px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 820, margin: '0 auto', zIndex: 2 }}>
          <h1 style={{ fontSize: 42, marginBottom: 12, fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>
            Tarzını Keşfet
          </h1>
          <p style={{ fontSize: 18, marginBottom: 28, opacity: 0.92, lineHeight: 1.7, color: 'white' }}>
            Yeni sezon koleksiyonları, seçkin markalar ve güvenli ödeme deneyimi
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" style={{
              backgroundColor: 'white',
              color: '#111827',
              padding: '12px 24px',
              borderRadius: 999,
              textDecoration: 'none',
              fontSize: 15,
              fontWeight: 700,
              transition: 'all 0.2s ease',
              display: 'inline-block',
              cursor: 'pointer'
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
              Alışverişe Başla
            </Link>
            {!meData?.user && (
              <Link to="/register" style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                padding: '12px 20px',
                borderRadius: 999,
                textDecoration: 'none',
                fontSize: 15,
                fontWeight: 700,
                border: '1px solid rgba(255,255,255,0.35)',
                display: 'inline-block',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
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
        bottom: 20,
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

