import React, { useState } from 'react';
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
  'Gömlekler'
];

export default function ProductList({ filters: initialFilters = {} }: ProductListProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || '');
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || 'createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialFilters.sortOrder as 'asc' | 'desc' || 'desc');

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
    <div style={{ display: 'flex', padding: 20, gap: 30 }}>
      {/* Sidebar - Category Filters */}
      <div style={{ 
        width: 120,
        padding: '10px 0'
      }}>
        <h3 style={{ marginBottom: 15, fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
          Koleksiyonlar
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              style={{
                textAlign: 'left',
                padding: '6px 0',
                background: 'transparent',
                color: selectedCategory === (category === 'Tümü' ? '' : category) ? '#1a1a1a' : '#666',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: selectedCategory === (category === 'Tümü' ? '' : category) ? 600 : 400,
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== (category === 'Tümü' ? '' : category)) {
                  e.currentTarget.style.textDecoration = 'none';
                } else {
                  e.currentTarget.style.textDecoration = 'underline';
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        {/* Search and Sort Bar */}
        <div style={{ 
          marginBottom: 30, 
          display: 'flex', 
          gap: 15, 
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              flex: 1, 
              minWidth: 200,
              padding: '12px 16px',
              border: '2px solid #ddd',
              borderRadius: 8,
              fontSize: 14
            }}
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '2px solid #ddd',
              borderRadius: 8,
              fontSize: 14
            }}
          >
            <option value="createdAt">En Yeni</option>
            <option value="price">Fiyat: Düşükten Yükseğe</option>
            <option value="rating">Değerlendirme: Yüksekten Düşüğe</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            style={{
              padding: '12px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
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
