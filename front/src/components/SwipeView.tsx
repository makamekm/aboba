import React, { useRef, useCallback, useEffect } from 'react';
import {
  View,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');

interface SwipeViewProps {
  frontScreen: React.ReactNode;
  backScreen: React.ReactNode;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  snapThreshold?: number;
  velocityThreshold?: number;
}

export const SwipeView: React.FC<SwipeViewProps> = ({
  frontScreen,
  backScreen,
  isOpen,
  onOpen,
  onClose,
  snapThreshold = 0.4,
  velocityThreshold = 0.5,
}) => {
  const backX = useRef(new Animated.Value(0)).current;
  const frontX = useRef(new Animated.Value(SCREEN_W)).current;
  const isAnimating = useRef(false);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);
  const dragStartY = useRef(0);
  const dragStartTime = useRef(0);
  const rafId = useRef<number | null>(null);
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isAnimating.current) return;

    if (isOpen) {
      // Opening: only animate from closed position if front is off-screen
      // Don't reset if already open — prevents jump during drag
      const needsOpen = frontX.__getValue() >= SCREEN_W * 0.5;
      if (needsOpen) {
        isAnimating.current = true;
        onOpen();
        backX.setValue(0);
        frontX.setValue(SCREEN_W);
        Animated.parallel([
          Animated.timing(backX, { toValue: -SCREEN_W * 0.3, duration: 200, useNativeDriver: true }),
          Animated.timing(frontX, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start(() => { isAnimating.current = false; });
      }
    } else {
      // Closing: only animate if front is on-screen
      const needsClose = frontX.__getValue() < SCREEN_W * 0.5;
      if (needsClose) {
        isAnimating.current = true;
        Animated.parallel([
          Animated.timing(backX, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(frontX, { toValue: SCREEN_W, duration: 200, useNativeDriver: true }),
        ]).start(() => {
          onClose();
          isAnimating.current = false;
        });
      } else {
        onClose();
      }
    }
  }, [isOpen, onOpen, onClose]);

  const close = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    Animated.parallel([
      Animated.timing(backX, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(frontX, { toValue: SCREEN_W, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      onClose();
      isAnimating.current = false;
    });
  }, [onClose]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isOpenRef.current || isAnimating.current) return;
    const touch = e.touches[0];
    dragStartX.current = touch.clientX;
    dragStartY.current = touch.clientY;
    dragStartTime.current = Date.now();
    dragCurrentX.current = touch.clientX;
    isDragging.current = true;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartX.current;
    const dy = touch.clientY - dragStartY.current;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5) {
      e.preventDefault();
    } else if (Math.abs(dy) >= Math.abs(dx)) {
      isDragging.current = false;
      return;
    }

    dragCurrentX.current = touch.clientX;
    const progress = Math.max(0, dx);
    const backTarget = -SCREEN_W * 0.3 + progress * 0.3;
    const frontTarget = progress;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      backX.setValue(backTarget);
      frontX.setValue(frontTarget);
    });
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (rafId.current) cancelAnimationFrame(rafId.current);

    const dx = dragCurrentX.current - dragStartX.current;
    const dt = Date.now() - dragStartTime.current;
    const vx = dx / dt;
    const progress = dx / SCREEN_W;

    if (progress > snapThreshold || vx > velocityThreshold) {
      close();
    } else {
      Animated.parallel([
        Animated.timing(backX, { toValue: -SCREEN_W * 0.3, duration: 200, useNativeDriver: true }),
        Animated.timing(frontX, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [close, snapThreshold, velocityThreshold]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.layer,
          {
            transform: [{ translateX: backX }],
            opacity: isOpen ? 0.7 : 1,
            zIndex: 1,
          },
        ]}
      >
        {backScreen}
      </Animated.View>

      {isOpen && (
        <Animated.View
          style={[
            styles.layer,
            {
              transform: [{ translateX: frontX }],
              zIndex: 2,
            },
          ]}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {frontScreen}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    touchAction: 'pan-y',
  },
});
