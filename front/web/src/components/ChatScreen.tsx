import { useRef, useEffect } from 'react';
import type { Message } from '../types';

interface ChatScreenProps {
  chatName: string;
  messages: Message[];
  onMenuClick: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ chatName, messages, onMenuClick }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-screen">
      <div className="chat-header">
        <div className="menu-btn" onClick={onMenuClick}>☰</div>
        <div className="chat-header-info">
          <div className="chat-header-name">{chatName}</div>
          <div className="chat-header-status">online</div>
        </div>
      </div>
      <div className="messages">
        {messages.map((m) => (
          <div key={m.id} className={`message ${m.isUser ? 'user' : 'ai'}`}>
            <div className={`bubble ${m.isUser ? 'user' : 'ai'}`}>{m.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
