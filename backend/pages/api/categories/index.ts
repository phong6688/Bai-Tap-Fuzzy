import { NextApiRequest, NextApiResponse } from 'next';
import { getDB, saveDB } from '../../../lib/db';
import { verifyAuthToken } from '../../../lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDB();

  // GET: Fetch list of categories
  if (req.method === 'GET') {
    const list = db.categories || [];
    return res.status(200).json({
      success: true,
      categories: list
    });
  }

  // POST: Create Category - Admin only (requires JWT)
  if (req.method === 'POST') {
    const decoded = verifyAuthToken(req);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Admin token required.' });
    }

    const { name, image, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ success: false, message: 'Name and slug are required.' });
    }

    const newCategory = {
      id: 'cat_' + Date.now(),
      name,
      image: image || 'assets/images/product/1.png',
      slug
    };

    if (!db.categories) db.categories = [];
    db.categories.push(newCategory);
    saveDB(db);

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: newCategory
    });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
