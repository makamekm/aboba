import { useRef, useCallback, useEffect, type ReactNode } from 'react';

interface SwipeDrawerProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  children: ReactNode;
}

export const SwipeDrawer: React.FC<SwipeDrawerProps> = ({ isOpen, onOpen, onClose, children }) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const animId = useRef<number | null>(null);
  const touchStartX = useRef(0);
  const currentX = useRef(0);

  const DRAWER_WIDTH = typeof window !== 'undefined' ? window.innerWidth : 375;

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  const animate = useCallback((target: number, duration = 120) => {
    if (animId.current) cancelAnimationFrame(animId.current);

    const drawer = drawerRef.current;
    const chat = chatRef.current;
    if (!drawer || !chat) return;

    const start = drawer.getBoundingClientRect().left;
    const startTime = performance.now();
    const isOpening = target > start;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = isOpening ? easeOutCubic(progress) : progress;
      const current = start + (target - start) * eased;

      drawer.style.transform = `translateX(${current}px)`;
      chat.style.transform = `translateX(${current}px)`;

      if (progress < 1) {
        animId.current = requestAnimationFrame(step);
      } else {
        if (!isOpening) {
          drawer.style.transform = '';
          chat.style.transform = '';
        }
      }
    };

    animId.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    if (isOpen) animate(0);
    else animate(-DRAWER_WIDTH);
  }, [isOpen, animate, DRAWER_WIDTH]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      const drawer = drawerRef.current;
      if (drawer) currentX.current = drawer.getBoundingClientRect().left;
      if (animId.current) cancelAnimationFrame(animId.current);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchX = e.touches[0].clientX;
      const dx = touchX - touchStartX.current;
      const drawer = drawerRef.current;
      const chat = chatRef.current;
      if (!drawer || !chat) return;

      if (isOpen) {
        if (dx < 0) {
          const x = Math.max(-DRAWER_WIDTH, dx);
          drawer.style.transform = `translateX(${x}px)`;
          chat.style.transform = `translateX(${x}px)`;
        }
      } else {
        if (dx > 0 && touchStartX.current < 30) {
          const x = Math.min(0, -DRAWER_WIDTH + dx);
          drawer.style.transform = `translateX(${x}px)`;
          chat.style.transform = `translateX(${x}px)`;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchX = e.changedTouches[0].clientX;
      const dx = touchX - touchStartX.current;
      const dt = e.timeStamp - performance.now();
      const vx = dx / (dt || 1);

      if (isOpen) {
        if (dx < -50 || vx < -0.5) onClose();
        else onOpen();
      } else {
        if (dx > 50 || vx > 0.5) onOpen();
        else {
          const drawer = drawerRef.current;
          const chat = chatRef.current;
          if (drawer) drawer.style.transform = '';
          if (chat) chat.style.transform = '';
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, onOpen, onClose, DRAWER_WIDTH]);

  return (
    <>
      <div ref={drawerRef} className="drawer-container">
        {children}
      </div>
      <div ref={chatRef} className="chat-container" />
    </>
  );
};