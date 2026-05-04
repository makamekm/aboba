import React, { useRef, useCallback, useImperativeHandle, forwardRef, useEffect } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  useWindowDimensions,
  GestureResponderEvent,
} from 'react-native';

export interface SwipeViewRef {
  open: () => void;
  close: () => void;
}

interface SwipeViewProps {
  frontScreen: React.ReactNode;
  backScreen: React.ReactNode;
  snapThreshold?: number;
  velocityThreshold?: number;
}

export const SwipeView = forwardRef<SwipeViewRef, SwipeViewProps>(({
  frontScreen,
  backScreen,
  snapThreshold = 0.4,
  velocityThreshold = 0.5,
}, ref) => {
  const { width: screenWidth } = useWindowDimensions();

  // Use HTMLDivElement refs for direct DOM manipulation during drag
  const backRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backX = useRef(new Animated.Value(0)).current;
  const frontX = useRef(new Animated.Value(screenWidth)).current;
  const isAnimating = useRef(false);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);
  const dragStartY = useRef(0);
  const dragStartTime = useRef(0);
  const isOpenRef = useRef(false);

  useEffect(() => {
    if (isOpenRef.current) {
      backX.setValue(-screenWidth * 0.3);
      frontX.setValue(0);
    } else {
      backX.setValue(0);
      frontX.setValue(screenWidth);
    }
  }, [screenWidth]);

  const open = useCallback(() => {
    if (isAnimating.current || isOpenRef.current) return;
    isAnimating.current = true;
    isOpenRef.current = true;
    backX.setValue(0);
    frontX.setValue(screenWidth);
    Animated.parallel([
      Animated.timing(backX, { toValue: -screenWidth * 0.3, duration: 200, useNativeDriver: true }),
      Animated.timing(frontX, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => { isAnimating.current = false; });
  }, [backX, frontX, screenWidth]);

  const close = useCallback(() => {
    if (isAnimating.current || !isOpenRef.current) return;
    isAnimating.current = true;
    Animated.parallel([
      Animated.timing(backX, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(frontX, { toValue: screenWidth, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      isOpenRef.current = false;
      isAnimating.current = false;
    });
  }, [backX, frontX, screenWidth]);

  useImperativeHandle(ref, () => ({ open, close }), [open, close]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isOpenRef.current || isAnimating.current) return;
    backX.stopAnimation();
    frontX.stopAnimation();
    const touch = e.touches[0];
    dragStartX.current = touch.clientX;
    dragStartY.current = touch.clientY;
    dragStartTime.current = Date.now();
    dragCurrentX.current = touch.clientX;
    isDragging.current = true;
  }, [backX, frontX]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const touch = e.touches[0];

    const dx = touch.clientX - dragStartX.current;
    const dy = touch.clientY - dragStartY.current;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5) {
      // e.preventDefault();
    } else if (Math.abs(dy) >= Math.abs(dx)) {
      isDragging.current = false;
      // Snap back to current state with animation
      if (isOpenRef.current) {
        Animated.parallel([
          Animated.timing(backX, { toValue: -screenWidth * 0.3, duration: 200, useNativeDriver: true }),
          Animated.timing(frontX, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start();
      } else {
        Animated.parallel([
          Animated.timing(backX, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(frontX, { toValue: screenWidth, duration: 200, useNativeDriver: true }),
        ]).start();
      }
      return;
    }

    console.log(dx, touch.clientX, dragStartX.current);

    dragCurrentX.current = touch.clientX;
    const progress = Math.max(0, dx);
    const backTarget = -screenWidth * 0.3 + progress * 0.3;
    const frontTarget = progress;

    backX.stopAnimation();
    frontX.stopAnimation();
    backX.setValue(backTarget);
    frontX.setValue(frontTarget);
  }, [backX, frontX, open, close, screenWidth]);

  const onTouchEnd = useCallback((event: GestureResponderEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const dx = dragCurrentX.current - dragStartX.current;
    const dt = Date.now() - dragStartTime.current;
    const vx = dx / dt;
    const progress = dx / screenWidth;

    if (progress > snapThreshold || vx > velocityThreshold) {
      close();
    } else {
      // Snap back to open position with animation
      Animated.parallel([
        Animated.timing(backX, { toValue: -screenWidth * 0.3, duration: 200, useNativeDriver: true }),
        Animated.timing(frontX, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [close, snapThreshold, velocityThreshold, backX, frontX, screenWidth]);

  return (
    <View style={styles.container}>
      {/* @ts-ignore — web-only ref to HTMLDivElement */}
      <Animated.View
        ref={backRef}
        style={[
          styles.layer,
          styles.backLayer,
          { transform: [{ translateX: backX }] },
        ]}
      >
        {backScreen}
      </Animated.View>

      {/* @ts-ignore — web-only ref to HTMLDivElement */}
      <Animated.View
        ref={frontRef}
        style={[
          styles.layer,
          styles.frontLayer,
          { transform: [{ translateX: frontX }] },
        ]}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        {frontScreen}
      </Animated.View>
    </View>
  );
});

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
  },
  backLayer: {
    zIndex: 1,
  },
  frontLayer: {
    zIndex: 2,
  },
});
