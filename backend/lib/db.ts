import fs from 'fs';
import path from 'path';

// Simple filesystem based database helper to make API functional
const DB_FILE = path.join(process.cwd(), 'database.json');

const DEFAULT_CATEGORIES = [
  { id: 'cat_1', name: 'Chairs', image: 'assets/images/product/1.png', slug: 'chairs' },
  { id: 'cat_2', name: 'Sofas', image: 'assets/images/product/14.png', slug: 'sofas' },
  { id: 'cat_3', name: 'Tables', image: 'assets/images/product/15.png', slug: 'tables' },
  { id: 'cat_4', name: 'Lamps', image: 'assets/images/product/16.png', slug: 'lamps' },
  { id: 'cat_5', name: 'Beds', image: 'assets/images/product/17.png', slug: 'beds' }
];

const DEFAULT_PRODUCTS = [
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
  }
];

// Initialize database with default users, products, and categories
const initialData = {
  users: [
    {
      id: 'user_1',
      name: 'Marlin Watkin',
      email: 'marlinw25@gmail.com',
      phone: '+4498456215',
      passwordHash: '$2a$10$tZ2y1.ZbeKq/4z9Q0q8CKeh/D6U7f8h.83RjY71nQ.4k8G0t2mI5G', // hash of 'password123'
      dob: '1995-08-25',
      avatar: 'assets/images/icons/profile1.png',
      addresses: [
        {
          id: 'addr_1',
          name: 'Marlin Watkin (Home)',
          phone: '+4498456215',
          type: 'Home',
          addressLine: '123 Queens Road, Richmond, London, TW10 6HY',
          isDefault: true
        }
      ]
    }
  ],
  categories: DEFAULT_CATEGORIES,
  products: DEFAULT_PRODUCTS
};

export const getDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
  const content = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(content);
};

export const saveDB = (data: any) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
};
