import { useState, useCallback } from 'react';
import type { Chat, Message } from './types';
import { ChatList } from './components/ChatList';
import { ChatScreen } from './components/ChatScreen';
import { InputField } from './components/InputField';
import { SwipeDrawer } from './components/SwipeDrawer';

const INITIAL_CHATS: Chat[] = [
  { id: '1', name: 'Aboba AI', avatar: '🤖', messages: [{ id: '1', text: 'Hello! How can I help?', isUser: false }] },
  { id: '2', name: 'Code Helper', avatar: '💻', messages: [{ id: '2', text: 'Need help with code?', isUser: false }] },
  { id: '3', name: 'Translator', avatar: '🌍', messages: [{ id: '3', text: 'What to translate?', isUser: false }] },
  { id: '4', name: 'Creative', avatar: '🎨', messages: [{ id: '4', text: "Let's create something!", isUser: false }] },
];

const REPLIES = ['Interesting!', 'Tell me more.', 'I see.', 'Got it!', 'Thanks for sharing!'];

function App() {
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [currentChatId, setCurrentChatId] = useState('1');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentChat = chats.find((c) => c.id === currentChatId) || chats[0];

  const selectChat = useCallback((id: string) => {
    setCurrentChatId(id);
    setDrawerOpen(false);
  }, []);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const newChat = useCallback(() => {
    const id = Date.now().toString();
    const newChat: Chat = { id, name: 'New Chat', avatar: '💬', messages: [] };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(id);
    setDrawerOpen(false);
  }, []);

  const sendMessage = useCallback((text: string) => {
    const newMessage: Message = { id: Date.now().toString(), text, isUser: true };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    );

    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: REPLIES[Math.floor(Math.random() * REPLIES.length)],
        isUser: false,
      };
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, reply] }
            : chat
        )
      );
    }, 1000);
  }, [currentChatId]);

  return (
    <div className="app">
      <SwipeDrawer isOpen={drawerOpen} onOpen={openDrawer} onClose={closeDrawer}>
        <ChatList
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={selectChat}
          onNewChat={newChat}
        />
      </SwipeDrawer>

      <div className="chat-wrapper">
        <ChatScreen
          chatName={currentChat.name}
          messages={currentChat.messages}
          onMenuClick={openDrawer}
        />
        <InputField onSend={sendMessage} />
      </div>
    </div>
  );
}

export default App;
