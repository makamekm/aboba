import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

export const CoinIcon: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🪙</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  icon: {
    fontSize: 14,
  },
});
