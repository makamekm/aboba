import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

export function useKeyboardHeight(): number {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const vv = window.visualViewport;
    if (!vv) return;

    const updateHeight = () => {
      const h = window.innerHeight - vv.height;
      setKeyboardHeight(h > 0 ? h : 0);
    };

    vv.addEventListener('resize', updateHeight);
    vv.addEventListener('scroll', updateHeight);
    updateHeight();

    return () => {
      vv.removeEventListener('resize', updateHeight);
      vv.removeEventListener('scroll', updateHeight);
    };
  }, []);

  return keyboardHeight;
}
