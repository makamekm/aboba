import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
} from 'react-native';
import { COLORS, MESSAGES } from '../constants';
import type { Message } from '../types';
import { Message as MessageItem } from './Message';

interface ChatScreenProps {
  keyboardHeight: number;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ keyboardHeight }) => {
  const [messages, setMessages] = useState<Message[]>(MESSAGES);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<FlatList>(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    const interval = setInterval(() => {
      const textarea = document.querySelector('textarea[placeholder="Message..."]');
      if (textarea) {
        const container = textarea.parentElement;
        if (container) {
          container.style.setProperty('position', 'fixed', 'important');
          container.style.setProperty('bottom', '0px', 'important');
          container.style.setProperty('left', '0px', 'important');
          container.style.setProperty('right', '0px', 'important');
          container.style.setProperty('z-index', '9999', 'important');
          clearInterval(interval);
        }
      }
    }, 100);

    const timeout = setTimeout(() => clearInterval(interval), 5000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageItem message={item} />
  );

  return (
    <View style={styles.screen}>
      <View style={styles.messagesContainer}>
        <FlatList
          ref={scrollRef}
          data={messages}
          keyExtractor={(item: Message) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Message..."
          placeholderTextColor={COLORS.textSecondary}
          multiline
          maxHeight={100}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
    position: 'relative',
  },
  messagesContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },

  inputContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    zIndex: 100,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.inputBg,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: COLORS.text,
    fontSize: 15,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    color: COLORS.text,
    fontSize: 18,
    marginLeft: 2,
  },
});
