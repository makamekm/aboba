import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Chat as ChatType } from '../types';
import { COLORS } from '../constants';

interface ChatProps {
  chat: ChatType;
  onPress: (chat: ChatType) => void;
}

export const Chat: React.FC<ChatProps> = ({ chat, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(chat)} activeOpacity={0.7}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{chat.name[0]}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{chat.name}</Text>
          <Text style={styles.time}>{chat.time}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>{chat.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  time: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  lastMessage: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
