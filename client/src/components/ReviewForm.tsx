import React, { useState } from 'react';
import { useCreateReviewMutation } from '../app/api';
import { useGetMeQuery } from '../app/api';

interface ReviewFormProps {
  productId: string;
  onReviewAdded?: () => void;
}

export default function ReviewForm({ productId, onReviewAdded }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [createReview, { isLoading }] = useCreateReviewMutation();
  const { data: meData } = useGetMeQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meData?.user) return;

    try {
      await createReview({
        productId,
        rating,
        comment
      }).unwrap();
      
      setComment('');
      setRating(5);
      onReviewAdded?.();
    } catch (error) {
      console.error('Review creation failed:', error);
    }
  };

  if (!meData?.user) {
    return (
      <div style={{ 
        padding: 40, 
        textAlign: 'center', 
        backgroundColor: '#fafafa', 
        borderRadius: 12,
        border: '1px solid #e8e8e8'
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
        <p style={{ margin: 0, fontSize: 16, color: '#666' }}>
          İnceleme yazmak için giriş yapmanız gerekir
        </p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: 0, 
      marginBottom: 40,
      background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)',
      borderRadius: 16,
      border: '1px solid #e8e8e8',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '30px 40px',
        borderBottom: '2px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <div style={{
          width: 4,
          height: 24,
          backgroundColor: '#1a1a1a',
          borderRadius: 2
        }} />
        <h3 style={{ 
          margin: 0, 
          fontSize: 22, 
          fontWeight: 700, 
          color: '#1a1a1a',
          letterSpacing: '-0.5px'
        }}>
          Bir İnceleme Yazın
        </h3>
      </div>

      {/* Form */}
      <div style={{ padding: '40px' }}>
        <form onSubmit={handleSubmit}>
          {/* Rating */}
          <div style={{ marginBottom: 30 }}>
            <label style={{ 
              display: 'block', 
              fontSize: 14, 
              fontWeight: 600, 
              color: '#1a1a1a', 
              marginBottom: 12 
            }}>
              Değerlendirme
            </label>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 20,
                    padding: 2,
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <span style={{ 
                    color: star <= rating ? '#fbbf24' : '#e5e7eb' 
                  }}>
                    ★
                  </span>
                </button>
              ))}
              <span style={{ 
                marginLeft: 12, 
                fontSize: 15, 
                color: '#666',
                fontWeight: 500
              }}>
                {rating === 5 ? 'Mükemmel' : rating === 4 ? 'Çok İyi' : rating === 3 ? 'İyi' : rating === 2 ? 'Orta' : 'Yetersiz'}
              </span>
            </div>
          </div>
          
          {/* Comment */}
          <div style={{ marginBottom: 30 }}>
            <label 
              htmlFor="comment" 
              style={{ 
                display: 'block', 
                fontSize: 14, 
                fontWeight: 600, 
                color: '#1a1a1a', 
                marginBottom: 12 
              }}
            >
              Yorumunuz
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              maxLength={500}
              style={{ 
                width: '100%', 
                padding: '16px', 
                minHeight: 120,
                fontSize: 15,
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease'
              }}
              placeholder="Ürün hakkındaki görüşlerinizi paylaşın..."
              onFocus={(e) => {
                e.target.style.borderColor = '#1a1a1a';
                e.target.style.boxShadow = '0 0 0 3px rgba(26, 26, 26, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.boxShadow = 'none';
              }}
            />
            <div style={{ 
              fontSize: 13, 
              color: '#999', 
              textAlign: 'right',
              marginTop: 8
            }}>
              {comment.length}/500 karakter
            </div>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading || !comment.trim()}
            style={{
              backgroundColor: isLoading || !comment.trim() ? '#e5e7eb' : '#1a1a1a',
              color: 'white',
              padding: '14px 32px',
              border: 'none',
              borderRadius: 8,
              cursor: isLoading || !comment.trim() ? 'not-allowed' : 'pointer',
              fontSize: 15,
              fontWeight: 500,
              transition: 'all 0.2s ease',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              if (!isLoading && comment.trim()) {
                e.currentTarget.style.backgroundColor = '#333';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading && comment.trim()) {
                e.currentTarget.style.backgroundColor = '#1a1a1a';
              }
            }}
          >
            {isLoading ? 'Gönderiliyor...' : 'İncelemeyi Gönder'}
          </button>
        </form>
      </div>
    </div>
  );
}
