import type { Chat } from '../types';

interface ChatListProps {
  chats: Chat[];
  currentChatId: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
}

export const ChatList: React.FC<ChatListProps> = ({ chats, currentChatId, onSelectChat, onNewChat }) => {
  return (
    <div className="drawer">
      <div className="drawer-header">
        <div className="drawer-title">Chats</div>
        <div className="new-chat-btn" onClick={onNewChat}>+</div>
      </div>
      <div className="chat-list">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${chat.id === currentChatId ? 'active' : ''}`}
            onClick={() => onSelectChat(chat.id)}
          >
            <div className="avatar">{chat.avatar}</div>
            <div className="chat-info">
              <div className="chat-name">{chat.name}</div>
              <div className="chat-preview">
                {chat.messages[chat.messages.length - 1]?.text || ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
