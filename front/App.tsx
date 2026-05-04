import React, { useState, useCallback } from 'react';
import { ChatsScreen } from './src/components/ChatsScreen';
import { ChatScreen } from './src/components/ChatScreen';
import { SwipeView } from './src/components/SwipeView';
import { useKeyboardHeight } from './src/hooks/useKeyboardHeight';
import type { Chat } from './src/types';

export function App(): JSX.Element {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const keyboardHeight = useKeyboardHeight();

  const openChat = useCallback((chat: Chat) => {
    setCurrentChat(chat);
    setIsChatOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
    setCurrentChat(null);
  }, []);

  return (
    <SwipeView
      backScreen={<ChatsScreen onSelectChat={openChat} />}
      frontScreen={<ChatScreen keyboardHeight={keyboardHeight} />}
      isOpen={isChatOpen}
      onOpen={() => setIsChatOpen(true)}
      onClose={closeChat}
    />
  );
}
