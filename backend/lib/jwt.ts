import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fuzzy_app_jwt_secret_key_12345';

export interface DecodedToken {
  userId: string;
  email: string;
}

export const generateToken = (payload: DecodedToken): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

// Helper middleware to verify token in Next.js API Routes
export const verifyAuthToken = (req: NextApiRequest): DecodedToken | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (err) {
    return null;
  }
};

// Helper to return 401 error response
export const respondUnauthorized = (res: NextApiResponse) => {
  res.status(401).json({ success: false, message: 'Unauthorized. Token expired or invalid.' });
};
