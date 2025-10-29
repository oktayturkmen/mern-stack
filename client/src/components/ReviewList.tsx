import React from 'react';
import { useGetReviewsByProductQuery, useDeleteReviewMutation } from '../app/api';
import { useGetMeQuery } from '../app/api';

interface ReviewListProps {
  productId: string;
}

export default function ReviewList({ productId }: ReviewListProps) {
  const { data, isLoading, error, refetch } = useGetReviewsByProductQuery(productId);
  const [deleteReview] = useDeleteReviewMutation();
  const { data: meData } = useGetMeQuery();

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Bu incelemeyi silmek istediğinizden emin misiniz?')) return;
    
    try {
      await deleteReview(reviewId).unwrap();
      refetch();
    } catch (error) {
      console.error('Review deletion failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: '#666' }}>Yorumlar yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#e74c3c' }}>
        <p>Yorumlar yüklenirken hata oluştu</p>
      </div>
    );
  }

  if (!data?.reviews || data.reviews.length === 0) {
    return (
      <div style={{ 
        padding: 60, 
        textAlign: 'center', 
        backgroundColor: '#fafafa', 
        borderRadius: 12,
        border: '1px solid #e8e8e8'
      }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>💭</div>
        <p style={{ margin: 0, fontSize: 15, color: '#666' }}>
          Henüz yorum yok. İlk yorumu siz yazın!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 12,
        marginBottom: 24 
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
          Yorumlar ({data.reviews.length})
        </h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {data.reviews.map((review: any) => (
          <div key={review._id} style={{
            padding: 24,
            border: '1px solid #e8e8e8',
            borderRadius: 12,
            backgroundColor: 'white',
            transition: 'all 0.2s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 600,
                    flexShrink: 0
                  }}>
                    {(review.user?.name || 'A')[0].toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>
                      {review.user?.name || 'İsimsiz'}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {[...Array(5)].map((_, i) => (
                          <span key={i} style={{ fontSize: 14, color: i < review.rating ? '#fbbf24' : '#e5e7eb' }}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span style={{ fontSize: 13, color: '#999' }}>
                        {new Date(review.createdAt).toLocaleDateString('tr-TR', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {meData?.user?.id === review.user?._id && (
                <button
                  onClick={() => handleDeleteReview(review._id)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#e74c3c',
                    border: '1px solid #e8e8e8',
                    padding: '6px 14px',
                    borderRadius: 6,
                    fontSize: 13,
                    cursor: 'pointer',
                    fontWeight: 500,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fee';
                    e.currentTarget.style.borderColor = '#e74c3c';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#e8e8e8';
                  }}
                >
                  Sil
                </button>
              )}
            </div>
            
            <p style={{ margin: 0, lineHeight: 1.7, color: '#4a5568', fontSize: 15 }}>
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
