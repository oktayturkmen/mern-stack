import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../app/api';
import ProductCard from '../components/ProductCard';

interface ProductListProps {
  filters?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: string;
  };
}

const categories = [
  'Tümü',
  'Çantalar',
  'Bardak',
  'Takılar',
  'Elektronik Eşyalar',
  'Ayakkabılar',
  'Şapkalar',
  'Kapüşonlu Üstler',
  'Ceketler',
  'Çocuklar',
  'Gömlekler',
  'Pantalonlar',
  'Güneş Gözlükleri'
];

export default function ProductList({ filters: initialFilters = {} }: ProductListProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || '');
  const [searchTerm, setSearchTerm] = useState(urlSearch || initialFilters.search || '');
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || 'createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialFilters.sortOrder as 'asc' | 'desc' || 'desc');
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  // Update search term when URL changes
  useEffect(() => {
    const currentSearch = searchParams.get('search') || '';
    if (currentSearch) {
      setSearchTerm(currentSearch);
    } else {
      // URL'de search parametresi yoksa arama terimini temizle
      setSearchTerm('');
    }
  }, [searchParams]);

  const filters = {
    ...(selectedCategory && selectedCategory !== 'Tümü' && { category: selectedCategory }),
    ...(searchTerm && { search: searchTerm }),
    sortBy,
    sortOrder
  };

  const { data, isLoading, error } = useGetProductsQuery(filters);

  const handleCategoryClick = (category: string) => {
    if (category === 'Tümü') {
      setSelectedCategory('');
    } else {
      setSelectedCategory(category);
    }
    // Kategori değiştiğinde arama terimini temizle
    setSearchTerm('');
    // URL'deki search parametresini temizle
    if (searchParams.get('search')) {
      searchParams.delete('search');
      setSearchParams(searchParams, { replace: true });
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', padding: 20 }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <p>Ürünler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', padding: 20 }}>
        <div style={{ flex: 1, textAlign: 'center', color: 'red' }}>
          <p>Ürünler yüklenirken hata oluştu</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      {/* Overlay Background */}
      {isFiltersVisible && (
        <div
          onClick={() => setIsFiltersVisible(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* Sidebar - Category Filters Overlay */}
      {isFiltersVisible && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            width: 280,
            height: '100vh',
            backgroundColor: 'white',
            padding: '24px',
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
            zIndex: 1001,
            overflowY: 'auto'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ 
              fontSize: 20, 
              fontWeight: 700, 
              color: '#1a1a1a',
              margin: 0,
              paddingBottom: 12,
              borderBottom: '2px solid #1a1a1a'
            }}>
              Koleksiyonlar
            </h3>
            <button
              onClick={() => setIsFiltersVisible(false)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: 24,
                color: '#666',
                padding: '4px 8px',
                lineHeight: 1,
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
                e.currentTarget.style.color = '#1a1a1a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#666';
              }}
              title="Filtreleri Kapat"
            >
              ×
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {categories.map((category) => {
            const isSelected = selectedCategory === (category === 'Tümü' ? '' : category);
            return (
              <label
                key={category}
                onClick={() => handleCategoryClick(category)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: 8,
                  backgroundColor: isSelected ? '#f5f5f5' : 'transparent',
                  transition: 'all 0.2s ease',
                  border: isSelected ? '1px solid #1a1a1a' : '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#fafafa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleCategoryClick(category)}
                  style={{
                    width: 20,
                    height: 20,
                    cursor: 'pointer',
                    accentColor: '#1a1a1a',
                    borderRadius: 4,
                    border: '2px solid #ddd',
                    flexShrink: 0
                  }}
                />
                <span style={{
                  fontSize: 15,
                  color: isSelected ? '#1a1a1a' : '#666',
                  fontWeight: isSelected ? 600 : 400,
                  userSelect: 'none',
                  flex: 1
                }}>
                  {category}
                </span>
              </label>
            );
          })}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ width: '100%' }}>
        {/* Filter and Sort Bar */}
        <div style={{ 
          marginBottom: 30, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 15
        }}>
          {/* Filter Button - Left */}
          {!isFiltersVisible && (
            <button
              onClick={() => setIsFiltersVisible(true)}
              style={{
                padding: 0,
                backgroundColor: 'transparent',
                color: '#1a1a1a',
                border: 'none',
                fontSize: 14,
                fontWeight: 400,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              <span style={{ fontSize: 16, display: 'flex', alignItems: 'center' }}>☰</span>
              <span>Filtrele</span>
            </button>
          )}

          {/* Sort Controls - Right */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1px solid #e0e0e0',
                borderRadius: 4,
                fontSize: 14,
                cursor: 'pointer',
                backgroundColor: 'white',
                color: '#1a1a1a',
                outline: 'none'
              }}
            >
              <option value="createdAt">En Yeni</option>
              <option value="price">Fiyat: Düşükten Yükseğe</option>
              <option value="rating">Değerlendirme: Yüksekten Düşüğe</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              style={{
                padding: '12px',
                backgroundColor: '#1a1a1a',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 14,
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#333';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1a1a1a';
              }}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {data?.products && data.products.length > 0 ? (
          <>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
              gap: 25,
              marginBottom: 30
            }}>
              {data.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {data.pagination.totalPages > 1 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 10, 
                marginTop: 30,
                alignItems: 'center'
              }}>
                <button 
                  disabled={!data.pagination.hasPrev}
                  style={{ 
                    padding: '8px 16px', 
                    backgroundColor: data.pagination.hasPrev ? '#3498db' : '#bdc3c7',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: data.pagination.hasPrev ? 'pointer' : 'not-allowed'
                  }}
                >
                  ← Önceki
                </button>
                
                <span style={{ padding: '8px 16px', fontSize: 14 }}>
                  Sayfa {data.pagination.currentPage} / {data.pagination.totalPages}
                </span>
                
                <button 
                  disabled={!data.pagination.hasNext}
                  style={{ 
                    padding: '8px 16px', 
                    backgroundColor: data.pagination.hasNext ? '#3498db' : '#bdc3c7',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: data.pagination.hasNext ? 'pointer' : 'not-allowed'
                  }}
                >
                  Sonraki →
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ padding: 40, textAlign: 'center', color: '#7f8c8d' }}>
            <h3>Ürün bulunamadı</h3>
            <p>Filtrelerinizi veya arama teriminizi değiştirmeyi deneyin</p>
          </div>
        )}
      </div>
    </div>
  );
}
