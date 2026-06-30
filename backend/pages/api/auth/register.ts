import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { getDB, saveDB } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, password } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Name is required' });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  // Strong password check: at least 8 chars, 1 letter, 1 number
  if (!password || !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long, containing both letters and numbers'
    });
  }

  try {
    const db = getDB();
    const exists = db.users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    // Hash the password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: 'user_' + Date.now(),
      name,
      email,
      phone: '',
      passwordHash,
      dob: '',
      avatar: 'assets/images/icons/profile1.png',
      addresses: []
    };

    db.users.push(newUser);
    saveDB(db);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! You can now log in.'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
