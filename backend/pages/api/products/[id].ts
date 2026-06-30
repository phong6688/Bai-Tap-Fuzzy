import { NextApiRequest, NextApiResponse } from 'next';
import { getDB, saveDB } from '../../../lib/db';
import { verifyAuthToken } from '../../../lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Product ID is required.' });
  }

  const db = getDB();
  const productIndex = db.products ? db.products.findIndex((p: any) => p.id === id) : -1;

  if (productIndex === -1) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  const product = db.products[productIndex];

  // GET: Fetch product detail
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      product
    });
  }

  // PUT: Update Product (price, stock, status) - Admin only (requires JWT)
  if (req.method === 'PUT') {
    const decoded = verifyAuthToken(req);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Admin token required.' });
    }

    const { name, description, price, originalPrice, image, categoryId, sizes, colors, stock, status } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (originalPrice !== undefined) product.originalPrice = Number(originalPrice);
    if (image !== undefined) product.image = image;
    if (categoryId !== undefined) product.categoryId = categoryId;
    if (sizes !== undefined) product.sizes = sizes;
    if (colors !== undefined) product.colors = colors;
    if (stock !== undefined) product.stock = Number(stock);
    if (status !== undefined) product.status = status;

    db.products[productIndex] = product;
    saveDB(db);

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  }

  // DELETE: Soft delete (hide) or Hard delete product - Admin only (requires JWT)
  if (req.method === 'DELETE') {
    const decoded = verifyAuthToken(req);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Admin token required.' });
    }

    const { hardDelete } = req.query;

    if (hardDelete === 'true') {
      db.products = db.products.filter((p: any) => p.id !== id);
    } else {
      product.status = 'hidden';
      db.products[productIndex] = product;
    }
    
    saveDB(db);

    return res.status(200).json({
      success: true,
      message: 'Product deleted/hidden successfully'
    });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
