import React, { useRef, useCallback, useImperativeHandle, forwardRef, useEffect, useMemo } from 'react';
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

  const finalOffsetX = useMemo(() => -screenWidth * 0.3, [screenWidth]);

  const isOpenRef = useRef(true);

  // Use HTMLDivElement refs for direct DOM manipulation during drag
  const backRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backX = useRef(new Animated.Value(isOpenRef.current ? finalOffsetX : 0)).current;
  const frontX = useRef(new Animated.Value(isOpenRef.current ? 0 : screenWidth)).current;
  const isAnimating = useRef(false);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);
  const dragStartY = useRef(0);
  const dragStartTime = useRef(0);

  useEffect(() => {
    if (isAnimating.current) return;
    if (isDragging.current) return;
    if (isOpenRef.current) {
      backX.setValue(finalOffsetX);
      frontX.setValue(0);
    } else {
      backX.setValue(0);
      frontX.setValue(screenWidth);
    }
  }, [screenWidth, finalOffsetX]);

  const open = useCallback(() => {
    if (isAnimating.current || isOpenRef.current) return;
    isAnimating.current = true;
    isOpenRef.current = true;
    Animated.parallel([
      Animated.timing(backX, { toValue: finalOffsetX, duration: 200, useNativeDriver: false }),
      Animated.timing(frontX, { toValue: 0, duration: 200, useNativeDriver: false }),
    ]).start(() => {
      isOpenRef.current = true;
      isAnimating.current = false;
    });
  }, [backX, frontX, screenWidth, finalOffsetX]);

  const close = useCallback(() => {
    if (isAnimating.current || !isOpenRef.current) return;
    isOpenRef.current = false;
    isAnimating.current = true;
    Animated.parallel([
      Animated.timing(backX, { toValue: 0, duration: 200, useNativeDriver: false }),
      Animated.timing(frontX, { toValue: screenWidth, duration: 200, useNativeDriver: false }),
    ]).start(() => {
      isOpenRef.current = false;
      isAnimating.current = false;
    });
  }, [backX, frontX, screenWidth, finalOffsetX]);

  useImperativeHandle(ref, () => ({ open, close }), [open, close]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (isAnimating.current) return;
    backX.stopAnimation();
    frontX.stopAnimation();
    const touch = e.changedTouches[0];
    dragStartX.current = touch.clientX;
    dragStartY.current = touch.clientY;
    dragStartTime.current = Date.now();
    dragCurrentX.current = touch.clientX;
    isDragging.current = true;
    // console.log('START', touch.clientX, touch.clientY);
  }, [backX, frontX]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const touch = e.changedTouches[0];
    const clientX = touch.clientX;
    const clientY = touch.clientY;

    // Skip jumpy touches (>50px in one frame = glitch)
    const deltaFromLast = Math.abs(clientX - dragCurrentX.current);
    if (dragCurrentX.current !== 0 && deltaFromLast > 50) {
      // console.log('SKIP', clientX, dragCurrentX.current, deltaFromLast);
      return;
    }

    const dx = clientX - dragStartX.current;
    const dy = clientY - dragStartY.current;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5) {
      // e.preventDefault() doesn't work in passive listener
    } else if (Math.abs(dy) >= Math.abs(dx)) {
      isDragging.current = false;
      // Snap back to current state with animation
      if (isOpenRef.current) {
        Animated.parallel([
          Animated.timing(backX, { toValue: finalOffsetX, duration: 200, useNativeDriver: false }),
          Animated.timing(frontX, { toValue: 0, duration: 200, useNativeDriver: false }),
        ]).start();
      } else {
        Animated.parallel([
          Animated.timing(backX, { toValue: 0, duration: 200, useNativeDriver: false }),
          Animated.timing(frontX, { toValue: screenWidth, duration: 200, useNativeDriver: false }),
        ]).start();
      }
      return;
    }

    // console.log(dx, clientX, dragStartX.current);

    dragCurrentX.current = clientX;

    if (isOpenRef.current) {
      // Chat open, dragging right → open chats
      const progress = Math.min(screenWidth, Math.max(0, dx));
      const backTarget = finalOffsetX + progress * 0.3;
      const frontTarget = progress;
      backX.setValue(backTarget);
      frontX.setValue(frontTarget);
    } else {
      // Chats open, dragging left → close chats
      const progress = Math.min(screenWidth, Math.max(0, -dx));
      const backTarget = -progress * 0.3;
      const frontTarget = screenWidth - progress;
      backX.setValue(backTarget);
      frontX.setValue(frontTarget);
    }
  }, [backX, frontX, open, close, screenWidth, finalOffsetX]);

  const onTouchEnd = useCallback((event: GestureResponderEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    // console.log('END');

    const dx = dragCurrentX.current - dragStartX.current;
    const dt = Date.now() - dragStartTime.current;
    const vx = dx / dt;

    if (isOpenRef.current) {
      // Chat open, check if we should open chats
      const progress = dx / screenWidth;
      if (progress > snapThreshold || vx > velocityThreshold) {
        close();
      } else {
        // Snap back to chat open - start from current drag position
        Animated.parallel([
          Animated.timing(backX, { toValue: finalOffsetX, duration: 200, useNativeDriver: false }),
          Animated.timing(frontX, { toValue: 0, duration: 200, useNativeDriver: false }),
        ]).start();
      }
    } else {
      // Chats open, check if we should close
      const progress = -dx / screenWidth;
      if (progress > snapThreshold || -vx > velocityThreshold) {
        open();
      } else {
        // Snap back to chats open - start from current drag position
        Animated.parallel([
          Animated.timing(backX, { toValue: 0, duration: 200, useNativeDriver: false }),
          Animated.timing(frontX, { toValue: screenWidth, duration: 200, useNativeDriver: false }),
        ]).start();
      }
    }
  }, [open, close, snapThreshold, velocityThreshold, backX, frontX, screenWidth, finalOffsetX]);

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
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
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
    touchAction: 'none',
  },
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    touchAction: 'none',
  },
  backLayer: {
    zIndex: 1,
  },
  frontLayer: {
    zIndex: 2,
  },
});
