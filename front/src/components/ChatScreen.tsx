import React, { useState, useRef, useEffect, useMemo } from 'react';
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
import { SelfMessageFactory } from './SelfMessageFactory';
import { PeerMessageFactory } from './PeerMessageFactory';

interface ChatScreenProps {
  chatId: string | null;
  onBack: () => void;
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  text: 'Welcome! I am the default system bot. Say "Hello" to start chatting with me.',
  sender: 'other',
  time: '',
};

const INPUT_ROW_HEIGHT = 36;
const INPUT_LINE_HEIGHT = 20;
const MAX_ROWS = 10;
const MAX_INPUT_HEIGHT = INPUT_ROW_HEIGHT * MAX_ROWS;

export const ChatScreen: React.FC<ChatScreenProps> = ({ chatId, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState('');

  const lines = useMemo(() => inputText.split('\n').length, [inputText]);
  const currentLines = useMemo(() => Math.min(lines, MAX_ROWS), [lines]);

  const inputHeight = useMemo(() => Math.max(INPUT_LINE_HEIGHT * currentLines, INPUT_ROW_HEIGHT), [currentLines]);
  const scrollRef = useRef<FlatList>(null);

  useEffect(() => {
    if (chatId === null) {
      setMessages([WELCOME_MESSAGE]);
    } else {
      setMessages(MESSAGES);
    }
  }, [chatId]);

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

    // Reset textarea height on web
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const textarea = document.querySelector('textarea[placeholder="Message..."]') as HTMLTextAreaElement | null;
      if (textarea) textarea.style.height = INPUT_ROW_HEIGHT + 'px';
    }

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isSelf = item.sender === 'me' || item.sender === 'user';
    return isSelf ? (
      <SelfMessageFactory message={item} />
    ) : (
      <PeerMessageFactory message={item} />
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.messagesContainer}>
        <FlatList
          ref={scrollRef}
          data={messages}
          keyExtractor={(item: Message) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={[styles.messagesList, { paddingBottom: inputHeight + 32 }]}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 10,
          }}
          scrollEventThrottle={16}
          onEndReachedThreshold={0.1}
          automaticallyAdjustContentInsets={false}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={20}
        />
      </View>

      <View style={[styles.inputWrapper, { bottom: 8 }]}>
        <View style={[styles.inputContainer, { minHeight: inputHeight + 12 }]}>
          <View style={styles.inputWrapperFlex}>
            <TextInput
              style={[styles.input, { height: inputHeight, maxHeight: MAX_INPUT_HEIGHT }]}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Message..."
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={currentLines}
              scrollEnabled={inputHeight >= MAX_INPUT_HEIGHT}
            />
          </View>
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 8,
    paddingVertical: 8,
    flexGrow: 1,
  },

  inputWrapper: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 8,
    borderRadius: 28,
    overflow: 'hidden',
    zIndex: 100,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 4,
    paddingVertical: 4,
    backgroundColor: 'rgba(30, 30, 30, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  inputWrapperFlex: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: COLORS.text,
    fontSize: 15,
    marginRight: 4,
    lineHeight: 20,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 100,
    backgroundColor: COLORS.primary,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 4,
  },
  sendIcon: {
    color: '#fff',
    fontSize: 18,
  },
});
