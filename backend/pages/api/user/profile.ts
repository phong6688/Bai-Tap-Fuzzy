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

  // GET User Profile details
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        avatar: user.avatar
      }
    });
  }

  // PUT Update User Profile details
  if (req.method === 'PUT') {
    const { name, phone, dob, avatar } = req.body;

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (dob !== undefined) user.dob = dob;
    if (avatar !== undefined) user.avatar = avatar;

    db.users[userIndex] = user;
    saveDB(db);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        avatar: user.avatar
      }
    });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
