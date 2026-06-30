import { NextApiRequest, NextApiResponse } from 'next';
import { getDB, saveDB } from '../../../lib/db';
import { generateToken } from '../../../lib/jwt';

// Mock implementation showing Google/Facebook OAuth2 authentication handler
// Typically, the client receives a token from Google/Facebook SDK, sends it here,
// and the backend verifies it with Google/Facebook APIs before generating a local JWT.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { provider, accessToken, email, name, avatar } = req.body;

  if (!provider || !['google', 'facebook'].includes(provider)) {
    return res.status(400).json({ success: false, message: 'Invalid OAuth provider. Must be google or facebook.' });
  }

  if (!accessToken || !email) {
    return res.status(400).json({ success: false, message: 'Provider access token and email are required.' });
  }

  try {
    // In production, you would perform verification like:
    // if (provider === 'google') {
    //   const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${accessToken}`);
    //   const googleUser = await googleRes.json();
    //   if (googleUser.email !== email) throw new Error('OAuth Token verification failed');
    // }

    const db = getDB();
    let user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Create new user if they do not exist (OAuth registration)
      user = {
        id: 'user_oauth_' + Date.now(),
        name: name || 'OAuth User',
        email: email,
        phone: '',
        passwordHash: '', // No password hash needed for OAuth users
        dob: '',
        avatar: avatar || 'assets/images/icons/profile1.png',
        addresses: []
      };
      db.users.push(user);
      saveDB(db);
    }

    // Generate local JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    return res.status(200).json({
      success: true,
      message: `Successfully authenticated via ${provider}`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        avatar: user.avatar
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'OAuth authentication failed' });
  }
}
