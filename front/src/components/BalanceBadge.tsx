import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';
import { CoinIcon } from './CoinIcon';

interface BalanceBadgeProps {
  balance: number;
}

export const BalanceBadge: React.FC<BalanceBadgeProps> = ({ balance }) => {
  return (
    <View style={styles.container}>
      <CoinIcon />
      <Text style={styles.balance} numberOfLines={1}>
        {balance.toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  balance: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
  },
});
