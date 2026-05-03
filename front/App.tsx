import React, { useState, useRef, useCallback } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Animated,
  PanResponder,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.85;

// AMOLED Theme Colors
const COLORS = {
  bg: '#000000',
  surface: '#0a0a0a',
  surfaceLight: '#141414',
  primary: '#6366f1',
  primaryLight: '#818cf8',
  text: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.5)',
  border: 'rgba(255,255,255,0.06)',
};

interface Chat {
  id: string;
  name: string;
  avatar: string;
  messages: Message[];
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const INITIAL_CHATS: Chat[] = [
  {
    id: '1',
    name: 'Aboba AI',
    avatar: '🤖',
    messages: [{ id: '1', text: 'Hello! How can I help?', isUser: false }],
  },
  {
    id: '2',
    name: 'Code Helper',
    avatar: '💻',
    messages: [{ id: '2', text: 'Need help with code?', isUser: false }],
  },
  {
    id: '3',
    name: 'Translator',
    avatar: '🌍',
    messages: [{ id: '3', text: 'What to translate?', isUser: false }],
  },
  {
    id: '4',
    name: 'Creative',
    avatar: '🎨',
    messages: [{ id: '4', text: "Let's create something!", isUser: false }],
  },
];

const REPLIES = ['Interesting!', 'Tell me more.', 'I see.', 'Got it!', 'Thanks for sharing!'];

export default function App() {
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [currentChatId, setCurrentChatId] = useState('1');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inputText, setInputText] = useState('');

  const currentChat = chats.find((c) => c.id === currentChatId) || chats[0];
  const translateX = useRef(new Animated.Value(0)).current;

  const openDrawer = useCallback(() => {
    setDrawerOpen(true);
    Animated.timing(translateX, {
      toValue: DRAWER_WIDTH,
      duration: 120,
      useNativeDriver: true,
    }).start();
  }, [translateX]);

  const closeDrawer = useCallback(() => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => setDrawerOpen(false));
  }, [translateX]);

  const selectChat = useCallback(
    (chatId: string) => {
      setCurrentChatId(chatId);
      closeDrawer();
    },
    [closeDrawer],
  );

  const sendMessage = useCallback(() => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat,
      ),
    );
    setInputText('');

    // Simulate AI response
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
            : chat,
        ),
      );
    }, 1000);
  }, [inputText, currentChatId]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (drawerOpen) {
          // Closing drawer - swipe left
          if (gestureState.dx < 0) {
            translateX.setValue(DRAWER_WIDTH + gestureState.dx);
          }
        } else {
          // Opening drawer - swipe right
          if (gestureState.dx > 0) {
            translateX.setValue(Math.min(gestureState.dx, DRAWER_WIDTH));
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (drawerOpen) {
          if (gestureState.dx < -50 || gestureState.vx < -0.5) {
            closeDrawer();
          } else {
            openDrawer();
          }
        } else {
          if (gestureState.dx > 50 || gestureState.vx > 0.5) {
            openDrawer();
          } else {
            Animated.timing(translateX, {
              toValue: 0,
              duration: 120,
              useNativeDriver: true,
            }).start();
          }
        }
      },
    }),
  ).current;

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.message,
        item.isUser ? styles.messageUser : styles.messageAI,
      ]}>
      <View
        style={[
          styles.bubble,
          item.isUser ? styles.bubbleUser : styles.bubbleAI,
        ]}>
        <Text style={item.isUser ? styles.textWhite : styles.textWhite}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => selectChat(item.id)}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.avatar}</Text>
      </View>
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.chatPreview}>
          {item.messages[item.messages.length - 1]?.text}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

        {/* Drawer */}
        <View style={styles.drawer}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>Chats</Text>
            <TouchableOpacity style={styles.newChatBtn}>
              <Text style={styles.newChatText}>+</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={chats}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id}
          />
        </View>

        {/* Main Content */}
        <Animated.View
          style={[
            styles.mainContent,
            { transform: [{ translateX }] },
          ]}
          {...panResponder.panHandlers}>
          {/* Messages */}
          <FlatList
            data={currentChat.messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
          />

          {/* Input */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.inputArea}>
            <TextInput
              style={styles.input}
              placeholder="Message..."
              placeholderTextColor={COLORS.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
              <Text style={styles.sendText}>➤</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Animated.View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: COLORS.surface,
    zIndex: 1,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
  },
  newChatBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newChatText: {
    fontSize: 20,
    color: '#fff',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontWeight: '600',
    fontSize: 15,
    color: COLORS.text,
  },
  chatPreview: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  mainContent: {
    flex: 1,
    backgroundColor: COLORS.bg,
    zIndex: 2,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingTop: 20,
  },
  message: {
    maxWidth: '80%',
    marginBottom: 12,
  },
  messageUser: {
    alignSelf: 'flex-end',
  },
  messageAI: {
    alignSelf: 'flex-start',
  },
  bubble: {
    padding: 12,
    borderRadius: 18,
  },
  bubbleUser: {
    backgroundColor: COLORS.primary,
  },
  bubbleAI: {
    backgroundColor: COLORS.surfaceLight,
  },
  textWhite: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 20,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 16,
    color: COLORS.text,
    fontSize: 15,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: {
    fontSize: 18,
    color: '#fff',
  },
});
