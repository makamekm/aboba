import React, { useRef, useCallback, useState } from 'react';
import { ChatsScreen } from './src/components/ChatsScreen';
import { ChatScreen } from './src/components/ChatScreen';
import { SwipeView, type SwipeViewRef } from './src/components/SwipeView';
import { useKeyboardHeight } from './src/hooks/useKeyboardHeight';
import type { Chat } from './src/types';

export function App(): JSX.Element {
  const swipeRef = useRef<SwipeViewRef>(null);
  const keyboardHeight = useKeyboardHeight();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const openChats = useCallback(() => {
    swipeRef.current?.close();
  }, []);

  const openChat = useCallback((chat: Chat) => {
    setSelectedChatId(chat.id);
    swipeRef.current?.open();
  }, []);

  return (
    <SwipeView
      ref={swipeRef}
      backScreen={<ChatsScreen onSelectChat={openChat} />}
      frontScreen={<ChatScreen chatId={selectedChatId} keyboardHeight={keyboardHeight} onBack={openChats} />}
    />
  );
}
