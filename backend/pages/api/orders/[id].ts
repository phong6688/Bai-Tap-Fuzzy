import { NextApiRequest, NextApiResponse } from 'next';
import { getDB, saveDB } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Order ID is required.' });
  }

  const db = getDB();
  const orderIndex = db.orders ? db.orders.findIndex((o: any) => o.id === id) : -1;

  if (orderIndex === -1) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  const order = db.orders[orderIndex];

  // GET: Fetch order details
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      order
    });
  }

  // PUT: Update order status (Admin operation)
  if (req.method === 'PUT') {
    const { status } = req.body;
    const validStatuses = ['pending', 'preparing', 'delivering', 'completed', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    order.status = status;
    db.orders[orderIndex] = order;
    saveDB(db);

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status} successfully`,
      order
    });
  }

  // DELETE: Delete order
  if (req.method === 'DELETE') {
    if (order.status !== 'cancelled' && db.products) {
      for (const item of order.items) {
        const prodIndex = db.products.findIndex((p: any) => p.id === item.productId);
        if (prodIndex !== -1) {
          db.products[prodIndex].stock = (db.products[prodIndex].stock || 0) + Number(item.quantity);
        }
      }
    }
    db.orders.splice(orderIndex, 1);
    saveDB(db);

    return res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
