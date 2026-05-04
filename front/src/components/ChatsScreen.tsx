import React from 'react';
import { View, Text, FlatList, StyleSheet, Platform } from 'react-native';
import { COLORS, CHATS } from '../constants';
import type { Chat } from '../types';
import { Chat as ChatItem } from './Chat';

interface ChatsScreenProps {
  onSelectChat: (chat: Chat) => void;
}

export const ChatsScreen: React.FC<ChatsScreenProps> = ({ onSelectChat }) => {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
      </View>
      <FlatList
        data={CHATS}
        keyExtractor={(item: Chat) => item.id}
        renderItem={({ item }: { item: Chat }) => (
          <ChatItem chat={item} onPress={onSelectChat} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
    position: 'relative',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '700',
  },
});
