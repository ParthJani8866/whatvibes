'use client';
import { useEffect } from 'react';

export default function ViewTracker({ profileId }: { profileId: string }) {
  useEffect(() => {
    const key = `viewed_${profileId}`;
    if (sessionStorage.getItem(key)) {
      console.log('View already counted in this session');
      return;
    }

    fetch(`/api/profile/${profileId}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(() => {
        console.log('View tracked successfully');
        sessionStorage.setItem(key, 'true');
      })
      .catch(err => console.error('Failed to track view:', err));
  }, [profileId]);

  return null;
}