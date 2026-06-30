import { NextApiRequest, NextApiResponse } from 'next';
import { getDB, saveDB } from '../../../lib/db';
import { verifyAuthToken } from '../../../lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDB();

  // GET: Fetch list of products with filters, sorting and pagination
  if (req.method === 'GET') {
    const { categoryId, search, sizes, colors, sortBy, page = 1, limit = 4 } = req.query;
    
    let list = db.products || [];

    // Only active products
    list = list.filter((p: any) => p.status === 'active');

    if (categoryId) {
      list = list.filter((p: any) => p.categoryId === categoryId);
    }

    if (search) {
      const q = String(search).toLowerCase().trim();
      list = list.filter((p: any) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    if (sizes) {
      const sizeArray = String(sizes).split(',');
      list = list.filter((p: any) => p.sizes.some((s: string) => sizeArray.includes(s)));
    }

    if (colors) {
      const colorArray = String(colors).split(',');
      list = list.filter((p: any) => p.colors.some((c: string) => colorArray.includes(c)));
    }

    // Sort
    if (sortBy === 'priceAsc') {
      list.sort((a: any, b: any) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      list.sort((a: any, b: any) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a: any, b: any) => b.rating - a.rating);
    }

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const startIndex = 0;
    const endIndex = pageNum * limitNum;

    const paginatedList = list.slice(startIndex, endIndex);
    const hasMore = endIndex < list.length;

    return res.status(200).json({
      success: true,
      products: paginatedList,
      hasMore,
      total: list.length
    });
  }

  // POST: Create product (Admin only - requires valid Bearer Token)
  if (req.method === 'POST') {
    const decoded = verifyAuthToken(req);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Admin token required.' });
    }

    const { name, description, price, originalPrice, image, categoryId, sizes, colors, stock } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ success: false, message: 'Name, Price and CategoryId are required.' });
    }

    const newProduct = {
      id: 'prod_' + Date.now(),
      name,
      description: description || '',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      image: image || 'assets/images/product/1.png',
      rating: 5.0,
      categoryId,
      sizes: sizes || [],
      colors: colors || [],
      stock: stock ? Number(stock) : 10,
      status: 'active'
    };

    if (!db.products) db.products = [];
    db.products.push(newProduct);
    saveDB(db);

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
