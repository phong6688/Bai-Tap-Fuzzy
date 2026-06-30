// Client-side Product and Category service
// Stores categories and products in LocalStorage for admin CRUD simulations

export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  categoryId: string;
  sizes: string[];
  colors: string[];
  stock: number;
  status: 'active' | 'hidden';
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_1', name: 'Chairs', image: 'assets/images/product/1.png', slug: 'chairs' },
  { id: 'cat_2', name: 'Sofas', image: 'assets/images/product/14.png', slug: 'sofas' },
  { id: 'cat_3', name: 'Tables', image: 'assets/images/product/15.png', slug: 'tables' },
  { id: 'cat_4', name: 'Lamps', image: 'assets/images/product/16.png', slug: 'lamps' },
  { id: 'cat_5', name: 'Beds', image: 'assets/images/product/17.png', slug: 'beds' }
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Buddy Chair',
    description: 'A classic mobile-friendly companion chair, designed with premium materials and ergonomic backrest support for long seating comfort.',
    price: 14,
    originalPrice: 20,
    image: 'assets/images/product/1.png',
    rating: 4.5,
    categoryId: 'cat_1',
    sizes: ['S', 'M', 'L'],
    colors: ['Beige', 'Blue', 'Grey'],
    stock: 25,
    status: 'active'
  },
  {
    id: 'prod_2',
    name: 'Wingback Chair',
    description: 'Elegant retro wingback chair with solid ashwood legs, styled in velvet fabric to elevate any corner in your home or office workspace.',
    price: 15,
    originalPrice: 18,
    image: 'assets/images/product/2.png',
    rating: 4.7,
    categoryId: 'cat_1',
    sizes: ['M', 'L'],
    colors: ['Blue', 'Grey', 'Black'],
    stock: 12,
    status: 'active'
  },
  {
    id: 'prod_3',
    name: 'Winston Chair',
    description: 'Ergonomic office meeting chair with armrests, fitted with wheels and height adjusters to bring practicality to your boardrooms.',
    price: 20,
    originalPrice: 22,
    image: 'assets/images/product/14.png',
    rating: 4.3,
    categoryId: 'cat_1',
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'Grey'],
    stock: 8,
    status: 'active'
  },
  {
    id: 'prod_4',
    name: 'Beige Chair',
    description: 'Nordic minimalist dining chair, light beige cotton fabric cover with high resilience sponge filling for ultimate dining comfort.',
    price: 16,
    originalPrice: 21,
    image: 'assets/images/product/15.png',
    rating: 4.6,
    categoryId: 'cat_1',
    sizes: ['M', 'L'],
    colors: ['Beige', 'White'],
    stock: 18,
    status: 'active'
  },
  {
    id: 'prod_5',
    name: 'Dining Chair',
    description: 'Sturdy solid oak dining chair with round spindle backrests, carrying timeless mid-century aesthetic details for cozy kitchens.',
    price: 12,
    originalPrice: 15,
    image: 'assets/images/product/16.png',
    rating: 4.4,
    categoryId: 'cat_1',
    sizes: ['S', 'M'],
    colors: ['Brown', 'Black'],
    stock: 30,
    status: 'active'
  },
  {
    id: 'prod_6',
    name: 'Harbour Chair',
    description: 'Shell bucket accent chair with sleek metal Eiffel frame, blending modern industrial details and body-hugging comfort.',
    price: 17,
    originalPrice: 23,
    image: 'assets/images/product/17.png',
    rating: 4.8,
    categoryId: 'cat_1',
    sizes: ['M', 'L'],
    colors: ['White', 'Black', 'Blue'],
    stock: 15,
    status: 'active'
  },
  {
    id: 'prod_7',
    name: 'Luxury Velvet Sofa',
    description: 'Deep-seat 3-seater living room sofa upholstered in premium anti-stain velvet, including two matching throw accent pillows.',
    price: 249,
    originalPrice: 299,
    image: 'assets/images/product/2.png',
    rating: 4.9,
    categoryId: 'cat_2',
    sizes: ['Standard'],
    colors: ['Green', 'Grey', 'Blue'],
    stock: 5,
    status: 'active'
  },
  {
    id: 'prod_8',
    name: 'Solid Wood Coffee Table',
    description: 'Handcrafted solid walnut coffee table, featuring a split open-shelf layout to store magazines, remotes, and coasters.',
    price: 79,
    originalPrice: 99,
    image: 'assets/images/product/15.png',
    rating: 4.5,
    categoryId: 'cat_3',
    sizes: ['Medium', 'Large'],
    colors: ['Natural Walnut', 'Dark Charcoal'],
    stock: 10,
    status: 'active'
  }
];

// Initialize local storage database
const initDatabase = () => {
  if (!localStorage.getItem('fuzzy_categories')) {
    localStorage.setItem('fuzzy_categories', JSON.stringify(DEFAULT_CATEGORIES));
  }
  if (!localStorage.getItem('fuzzy_products')) {
    localStorage.setItem('fuzzy_products', JSON.stringify(DEFAULT_PRODUCTS));
  }
};

initDatabase();

export const productService = {
  // Get all categories
  getCategories(): Category[] {
    const data = localStorage.getItem('fuzzy_categories');
    return data ? JSON.parse(data) : [];
  },

  // Get active products with sorting & filtering
  getProducts(options: {
    categoryId?: string;
    search?: string;
    sizes?: string[];
    colors?: string[];
    sortBy?: 'priceAsc' | 'priceDesc' | 'rating' | 'default';
    page?: number;
    limit?: number;
  } = {}): { products: Product[]; hasMore: boolean } {
    const data = localStorage.getItem('fuzzy_products');
    let list: Product[] = data ? JSON.parse(data) : [];

    // Filter active products
    list = list.filter(p => p.status === 'active');

    // Filter by Category
    if (options.categoryId) {
      list = list.filter(p => p.categoryId === options.categoryId);
    }

    // Filter by Search Query
    if (options.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    // Filter by Sizes
    if (options.sizes && options.sizes.length > 0) {
      list = list.filter(p => p.sizes.some(s => options.sizes!.includes(s)));
    }

    // Filter by Colors
    if (options.colors && options.colors.length > 0) {
      list = list.filter(p => p.colors.some(c => options.colors!.includes(c)));
    }

    // Sort
    if (options.sortBy === 'priceAsc') {
      list.sort((a, b) => a.price - b.price);
    } else if (options.sortBy === 'priceDesc') {
      list.sort((a, b) => b.price - a.price);
    } else if (options.sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    // Pagination/Infinite Scroll Slice
    const page = options.page || 1;
    const limit = options.limit || 4; // Mock smaller chunks to test infinite scroll
    const startIndex = 0;
    const endIndex = page * limit;
    
    const paginatedList = list.slice(startIndex, endIndex);
    const hasMore = endIndex < list.length;

    return {
      products: paginatedList,
      hasMore
    };
  },

  // Get single product detail
  getProductById(id: string): Product | null {
    const data = localStorage.getItem('fuzzy_products');
    const list: Product[] = data ? JSON.parse(data) : [];
    return list.find(p => p.id === id) || null;
  },

  // Admin: CRUD Create Product
  addProduct(product: Omit<Product, 'id'>): Product {
    const data = localStorage.getItem('fuzzy_products');
    const list: Product[] = data ? JSON.parse(data) : [];
    const newProduct: Product = {
      ...product,
      id: 'prod_' + Date.now()
    };
    list.push(newProduct);
    localStorage.setItem('fuzzy_products', JSON.stringify(list));
    return newProduct;
  },

  // Admin: CRUD Update Product
  updateProduct(id: string, updatedFields: Partial<Product>): Product | null {
    const data = localStorage.getItem('fuzzy_products');
    const list: Product[] = data ? JSON.parse(data) : [];
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) return null;

    const updated = {
      ...list[idx],
      ...updatedFields
    };
    list[idx] = updated;
    localStorage.setItem('fuzzy_products', JSON.stringify(list));
    return updated;
  },

  // Admin: CRUD Delete (or Hide) Product
  deleteProduct(id: string, hardDelete: boolean = false): boolean {
    const data = localStorage.getItem('fuzzy_products');
    let list: Product[] = data ? JSON.parse(data) : [];
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) return false;

    if (hardDelete) {
      list = list.filter(p => p.id !== id);
    } else {
      list[idx].status = 'hidden';
    }
    
    localStorage.setItem('fuzzy_products', JSON.stringify(list));
    return true;
  }
};
