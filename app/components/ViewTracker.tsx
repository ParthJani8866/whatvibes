'use client';

import { useEffect } from 'react';

interface ViewTrackerProps {
  profileId: string;
}

export default function ViewTracker({ profileId }: ViewTrackerProps) {
  useEffect(() => {
    const key = `viewed_${profileId}`;
    if (sessionStorage.getItem(key)) return;

    fetch(`/api/profile/${profileId}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .catch(err => console.error('Failed to track view:', err))
      .finally(() => sessionStorage.setItem(key, 'true'));
  }, [profileId]);

  return null;
}