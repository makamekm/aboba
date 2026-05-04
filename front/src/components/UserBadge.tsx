import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

interface UserBadgeProps {
  avatar?: string;
  nickname: string;
}

export const UserBadge: React.FC<UserBadgeProps> = ({ avatar, nickname }) => {
  const initial = nickname.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        {avatar ? (
          <Text style={styles.avatarText}>?</Text>
        ) : (
          <Text style={styles.avatarText}>{initial}</Text>
        )}
      </View>
      <Text style={styles.nickname} numberOfLines={1}>
        {nickname}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  nickname: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
