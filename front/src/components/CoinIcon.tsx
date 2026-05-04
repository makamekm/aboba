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
    width: 22,
    height: 22,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 2,
  },
  icon: {
    fontSize: 18,
  },
});
