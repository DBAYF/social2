import { useState, useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const setIsMobile = useUIStore((state) => state.setIsMobile);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    // Update mobile state if this is the mobile query
    if (query === '(max-width: 768px)') {
      setIsMobile(media.matches);
    }
    
    const listener = () => {
      setMatches(media.matches);
      if (query === '(max-width: 768px)') {
        setIsMobile(media.matches);
      }
    };
    
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query, setIsMobile]);

  return matches;
}
