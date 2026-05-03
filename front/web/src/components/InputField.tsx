import { useState } from 'react';

interface InputFieldProps {
  onSend: (text: string) => void;
}

export const InputField: React.FC<InputFieldProps> = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <div className="input-area">
      <input
        type="text"
        className="input"
        placeholder="Message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
      <button className="send-btn" onClick={handleSend}>➤</button>
    </div>
  );
};