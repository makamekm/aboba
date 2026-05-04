import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { COLORS, CHATS } from '../constants';
import type { Chat } from '../types';
import { Chat as ChatItem } from './Chat';
import { UserBadge } from './UserBadge';
import { BalanceBadge } from './BalanceBadge';

interface ChatsScreenProps {
  onSelectChat: (chat: Chat) => void;
}

export const ChatsScreen: React.FC<ChatsScreenProps> = ({ onSelectChat }) => {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <UserBadge nickname="User" />
        <BalanceBadge balance={1250} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(10, 10, 10, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
});
