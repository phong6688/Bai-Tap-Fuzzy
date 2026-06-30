import { useEffect, useState } from 'react';
import { productService, type Product } from '../services/productService';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Layout state: Grid (true) vs List (false)
  const [isGridView, setIsGridView] = useState(true);
  
  // Filter/Sort states
  const [selectedSort, setSelectedSort] = useState<'default' | 'priceAsc' | 'priceDesc' | 'rating'>('default');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  
  // Bottom Sheet Visibility
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  const fetchLimit = 4; // Fetch in small chunks to demonstrate Infinite Scroll

  const loadProducts = (resetPage = false) => {
    setLoading(true);
    const currentPage = resetPage ? 1 : page;
    if (resetPage) {
      setPage(1);
    }
    
    // Simulate slight loading latency
    setTimeout(() => {
      const res = productService.getProducts({
        categoryId: 'cat_1', // default Category: Chairs
        search,
        sizes: selectedSizes,
        colors: selectedColors,
        sortBy: selectedSort,
        page: currentPage,
        limit: fetchLimit
      });
      
      setProducts(res.products);
      setHasMore(res.hasMore);
      setLoading(false);
    }, 300);
  };

  // Re-run queries when page changes or search/filters are applied
  useEffect(() => {
    loadProducts();
  }, [page]);

  // Handle Infinite Scroll scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120) {
        if (hasMore && !loading) {
          setPage(prev => prev + 1);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  useEffect(() => {
    document.body.className = "";
    window.scrollTo(0, 0);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset page to 1 on new search
    // Fast-debounce load products
    const timer = setTimeout(() => {
      loadProducts(true);
    }, 400);
    return () => clearTimeout(timer);
  };

  const handleToggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleToggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const applyFilters = () => {
    setShowFilterSheet(false);
    loadProducts(true);
  };

  const clearFilters = () => {
    setSelectedSort('default');
    setSelectedSizes([]);
    setSelectedColors([]);
    setShowFilterSheet(false);
    setPage(1);
    
    // Trigger update immediately
    setTimeout(() => {
      const res = productService.getProducts({
        categoryId: 'cat_1',
        search,
        sizes: [],
        colors: [],
        sortBy: 'default',
        page: 1,
        limit: fetchLimit
      });
      setProducts(res.products);
      setHasMore(res.hasMore);
    }, 50);
  };

  return (
    <>
      <header className="section-t-space">
        <div className="custom-container">
          <div className="header-panel">
            <a href="#/landing">
              <i className="iconsax back-btn" data-icon="arrow-left"></i>
            </a>
            <h3>Chairs Shop</h3>
            <div className="d-flex align-items-center gap-2">
              {/* Grid/List Layout Toggle */}
              <button 
                onClick={() => setIsGridView(!isGridView)} 
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', padding: 0 }}
                title={isGridView ? "Switch to List View" : "Switch to Grid View"}
              >
                <i className="iconsax" data-icon={isGridView ? "row-vertical" : "grid-1"}></i>
              </button>
              <a href="#/notification" className="notification">
                <i className="iconsax notification-icon" data-icon="bell-2"></i>
              </a>
            </div>
          </div>
        </div>
      </header>
      
      <section>
        <div className="custom-container">
          <div className="theme-form search-head">
            <div className="form-group">
              <div className="form-input">
                <input 
                  type="text" 
                  className="form-control search" 
                  placeholder="Search here..." 
                  value={search}
                  onChange={handleSearchChange}
                />
                <i className="iconsax search-icon" data-icon="search-normal-2"></i>
              </div>
              {/* Filter Button */}
              <button 
                onClick={() => setShowFilterSheet(true)}
                className="btn filter-btn mt-0" 
                type="button"
              >
                <i className="iconsax filter-icon" data-icon="media-sliders-3"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <section className="section-b-space pt-3">
        <div className="custom-container">
          <div className="row g-3">
            {products.map((product) => (
              <div key={product.id} className={isGridView ? "col-6" : "col-12"}>
                <div className={`product-box ${!isGridView ? 'd-flex align-items-center gap-3 p-2' : ''}`} style={!isGridView ? { backgroundColor: '#183044', borderRadius: '12px' } : {}}>
                  <div className="product-box-img" style={!isGridView ? { width: '100px', height: '100px', flexShrink: 0 } : {}}>
                    <a href={`#/product-details?id=${product.id}`}> 
                      <img className="img" src={product.image} alt={product.name} style={!isGridView ? { borderRadius: '8px', objectFit: 'cover', height: '100%' } : {}} />
                    </a>

                    <div className="cart-box" style={!isGridView ? { bottom: '5px', right: '5px' } : {}}>
                      <a href={`#/product-details?id=${product.id}`} className="cart-bag">
                        <i className="iconsax bag" data-icon="basket-2"></i>
                      </a>
                    </div>
                  </div>
                  <div className="product-box-detail" style={!isGridView ? { width: '100%', padding: '0 10px 0 0' } : {}}>
                    <h4 style={!isGridView ? { fontSize: '15px', color: '#fff' } : {}}>{product.name}</h4>
                    <h5 style={!isGridView ? { fontSize: '12px', margin: '2px 0 6px' } : {}}>{product.description.slice(0, 30)}...</h5>
                    <div className="bottom-panel" style={!isGridView ? { display: 'flex', justifyContent: 'between', alignItems: 'center', width: '100%' } : {}}>
                      <div className="price">
                        <h4 style={!isGridView ? { fontSize: '16px' } : {}}>${product.price} <del className="pev-price">${product.originalPrice}</del></h4>
                      </div>
                      <div className="rating">
                        <img src="assets/images/svg/Star.svg" alt="star" />
                        <h6>{product.rating}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {loading && (
            <div className="text-center py-4">
              <span className="spinner-border spinner-border-sm text-warning" role="status"></span>
              <span style={{ color: '#fff', marginLeft: '10px', fontSize: '13px' }}>Loading products...</span>
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-5">
              <p style={{ color: '#aaa' }}>No products found matching your filters.</p>
            </div>
          )}

          {!hasMore && products.length > 0 && (
            <div className="text-center py-4">
              <span style={{ color: '#888', fontSize: '12px' }}>You have reached the end of the products.</span>
            </div>
          )}
        </div>
      </section>

      {/* FILTER BOTTOM SHEET MODAL (SLIDE UP) */}
      <div 
        className={`offcanvas offcanvas-bottom show`} 
        tabIndex={-1} 
        style={{ 
          visibility: showFilterSheet ? 'visible' : 'hidden', 
          transform: showFilterSheet ? 'none' : 'translateY(100%)',
          transition: 'transform 0.3s ease-in-out, visibility 0.3s',
          backgroundColor: '#122636',
          borderTopLeftRadius: '25px',
          borderTopRightRadius: '25px',
          height: '80%',
          maxHeight: '600px',
          maxWidth: '480px',
          left: '50%',
          right: 'auto',
          transformOrigin: 'bottom center'
        }}
      >
        <div className="offcanvas-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '15px 20px' }}>
          <h4 className="offcanvas-title" style={{ color: '#fff', fontWeight: 'bold' }}>Filters & Sorting</h4>
          <button type="button" className="btn-close btn-close-white" onClick={() => setShowFilterSheet(false)}></button>
        </div>
        <div className="offcanvas-body" style={{ padding: '20px', overflowY: 'auto' }}>
          
          {/* SORT BY */}
          <div className="mb-4">
            <h5 style={{ color: '#ffc107', marginBottom: '12px', fontWeight: '600' }}>Sort By</h5>
            <div className="d-flex flex-column gap-2">
              <label className="d-flex align-items-center gap-2" style={{ color: '#fff', cursor: 'pointer' }}>
                <input type="radio" name="sortOption" checked={selectedSort === 'default'} onChange={() => setSelectedSort('default')} />
                Default
              </label>
              <label className="d-flex align-items-center gap-2" style={{ color: '#fff', cursor: 'pointer' }}>
                <input type="radio" name="sortOption" checked={selectedSort === 'priceAsc'} onChange={() => setSelectedSort('priceAsc')} />
                Price: Low to High
              </label>
              <label className="d-flex align-items-center gap-2" style={{ color: '#fff', cursor: 'pointer' }}>
                <input type="radio" name="sortOption" checked={selectedSort === 'priceDesc'} onChange={() => setSelectedSort('priceDesc')} />
                Price: High to Low
              </label>
              <label className="d-flex align-items-center gap-2" style={{ color: '#fff', cursor: 'pointer' }}>
                <input type="radio" name="sortOption" checked={selectedSort === 'rating'} onChange={() => setSelectedSort('rating')} />
                Top Customer Rating
              </label>
            </div>
          </div>

          {/* SIZES */}
          <div className="mb-4">
            <h5 style={{ color: '#ffc107', marginBottom: '12px', fontWeight: '600' }}>Sizes</h5>
            <div className="d-flex flex-wrap gap-2">
              {['S', 'M', 'L', 'XL'].map(size => {
                const isActive = selectedSizes.includes(size);
                return (
                  <button 
                    key={size}
                    type="button"
                    onClick={() => handleToggleSize(size)}
                    className={`btn btn-sm ${isActive ? 'btn-warning text-dark' : 'btn-outline-secondary text-white'}`}
                    style={{ borderRadius: '20px', minWidth: '45px', fontWeight: '600' }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* COLORS */}
          <div className="mb-5">
            <h5 style={{ color: '#ffc107', marginBottom: '12px', fontWeight: '600' }}>Colors</h5>
            <div className="d-flex flex-wrap gap-2">
              {['Beige', 'Blue', 'Grey', 'Black', 'Brown', 'White'].map(color => {
                const isActive = selectedColors.includes(color);
                return (
                  <button 
                    key={color}
                    type="button"
                    onClick={() => handleToggleColor(color)}
                    className={`btn btn-sm ${isActive ? 'btn-warning text-dark' : 'btn-outline-secondary text-white'}`}
                    style={{ borderRadius: '20px', padding: '5px 15px', fontWeight: '500' }}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="d-flex gap-3 mt-4">
            <button type="button" onClick={clearFilters} className="btn btn-outline-light w-50 py-2" style={{ borderRadius: '30px', fontWeight: 'bold' }}>
              Clear All
            </button>
            <button type="button" onClick={applyFilters} className="btn btn-warning w-50 py-2 text-dark" style={{ borderRadius: '30px', fontWeight: 'bold' }}>
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* BACKDROP FOR SHEET */}
      {showFilterSheet && (
        <div 
          onClick={() => setShowFilterSheet(false)}
          className="offcanvas-backdrop fade show" 
          style={{ maxWidth: '480px', left: '50%', transform: 'translateX(-50%)' }}
        ></div>
      )}
    </>
  );
}
