import { useEffect, useState } from 'react';
import { getCurrentUser, type User } from '../services/apiClient';

export function useRequireAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      // If token is missing or expired, redirect to Login
      window.location.hash = '/login';
    } else {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  return { currentUser, loading };
}
