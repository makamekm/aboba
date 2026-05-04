import React, { useRef, useCallback } from 'react';
import { ChatsScreen } from './src/components/ChatsScreen';
import { ChatScreen } from './src/components/ChatScreen';
import { SwipeView, type SwipeViewRef } from './src/components/SwipeView';
import { useKeyboardHeight } from './src/hooks/useKeyboardHeight';
import type { Chat } from './src/types';

export function App(): JSX.Element {
  const swipeRef = useRef<SwipeViewRef>(null);
  const keyboardHeight = useKeyboardHeight();

  const openChat = useCallback((chat: Chat) => {
    swipeRef.current?.open();
  }, []);

  const closeChat = useCallback(() => {
    swipeRef.current?.close();
  }, []);

  return (
    <SwipeView
      ref={swipeRef}
      backScreen={<ChatsScreen onSelectChat={openChat} />}
      frontScreen={<ChatScreen keyboardHeight={keyboardHeight} onBack={closeChat} />}
    />
  );
}
