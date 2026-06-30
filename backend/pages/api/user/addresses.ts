import { NextApiRequest, NextApiResponse } from 'next';
import { getDB, saveDB } from '../../../lib/db';
import { verifyAuthToken, respondUnauthorized } from '../../../lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const decoded = verifyAuthToken(req);
  if (!decoded) {
    return respondUnauthorized(res);
  }

  const db = getDB();
  const userIndex = db.users.findIndex((u: any) => u.id === decoded.userId);

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const user = db.users[userIndex];
  const addresses = user.addresses || [];

  // GET Address book
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      addresses
    });
  }

  // POST Create Address
  if (req.method === 'POST') {
    const { name, phone, type, addressLine, isDefault } = req.body;

    if (!name || !phone || !type || !addressLine) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newAddress = {
      id: 'addr_' + Date.now(),
      name,
      phone,
      type,
      addressLine,
      isDefault: isDefault || false
    };

    if (newAddress.isDefault) {
      addresses.forEach((a: any) => a.isDefault = false);
    } else if (addresses.length === 0) {
      newAddress.isDefault = true;
    }

    addresses.push(newAddress);
    user.addresses = addresses;
    db.users[userIndex] = user;
    saveDB(db);

    return res.status(201).json({
      success: true,
      message: 'Address added successfully',
      address: newAddress
    });
  }

  // PUT Update Address (requires ID parameter in query, e.g. /api/user/addresses?id=...)
  if (req.method === 'PUT') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Address ID is required' });
    }

    const addressIndex = addresses.findIndex((a: any) => a.id === id);
    if (addressIndex === -1) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    const { name, phone, type, addressLine, isDefault } = req.body;
    const address = addresses[addressIndex];

    if (name !== undefined) address.name = name;
    if (phone !== undefined) address.phone = phone;
    if (type !== undefined) address.type = type;
    if (addressLine !== undefined) address.addressLine = addressLine;
    if (isDefault !== undefined) {
      address.isDefault = isDefault;
      if (isDefault === true) {
        addresses.forEach((a: any) => {
          if (a.id !== id) a.isDefault = false;
        });
      }
    }

    addresses[addressIndex] = address;
    user.addresses = addresses;
    db.users[userIndex] = user;
    saveDB(db);

    return res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      address
    });
  }

  // DELETE Remove Address
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Address ID is required' });
    }

    const addressIndex = addresses.findIndex((a: any) => a.id === id);
    if (addressIndex === -1) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    const toDelete = addresses[addressIndex];
    const updatedAddresses = addresses.filter((a: any) => a.id !== id);

    // If we deleted default, set another as default
    if (toDelete.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }

    user.addresses = updatedAddresses;
    db.users[userIndex] = user;
    saveDB(db);

    return res.status(200).json({
      success: true,
      message: 'Address deleted successfully'
    });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
