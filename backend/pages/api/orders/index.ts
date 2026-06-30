import { NextApiRequest, NextApiResponse } from 'next';
import { getDB, saveDB } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDB();

  // GET: Fetch list of all orders
  if (req.method === 'GET') {
    const { userId } = req.query;
    let list = db.orders || [];

    if (userId) {
      list = list.filter((o: any) => o.userId === userId);
    }

    // Sort by newest first
    list.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.status(200).json({
      success: true,
      orders: list
    });
  }

  // POST: Create a new order & deduct stock
  if (req.method === 'POST') {
    const { id, userId, items, address, paymentMethod, shippingCharge, discount, subTotal, grandTotal } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0 || !address) {
      return res.status(400).json({ success: false, message: 'Missing required order fields (userId, items, address).' });
    }

    // 1. Deduct stock inventory for each item in the order
    if (db.products) {
      for (const item of items) {
        const prodIndex = db.products.findIndex((p: any) => p.id === item.productId);
        if (prodIndex !== -1) {
          db.products[prodIndex].stock = Math.max(0, db.products[prodIndex].stock - Number(item.quantity));
        }
      }
    }

    // 2. Create the new order
    const newOrder = {
      id: id || 'ORD' + Math.floor(100000 + Math.random() * 900000),
      userId,
      items,
      address,
      paymentMethod: paymentMethod || 'COD',
      shippingCharge: shippingCharge ? Number(shippingCharge) : 20,
      discount: discount ? Number(discount) : 0,
      subTotal: Number(subTotal),
      grandTotal: Number(grandTotal),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    if (!db.orders) {
      db.orders = [];
    }

    // Check if order with this ID already exists (in case of double submission)
    const exists = db.orders.some((o: any) => o.id === newOrder.id);
    if (!exists) {
      db.orders.push(newOrder);
    }

    saveDB(db);

    return res.status(201).json({
      success: true,
      message: 'Order created and stock updated successfully',
      order: newOrder
    });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
