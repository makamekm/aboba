import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message as MessageType } from '../types';
import { COLORS } from '../constants';

interface MessageFactoryProps {
  message: MessageType;
  align: 'left' | 'right';
  bubbleColor: string;
  textColor: string;
  borderRadius: {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
  };
}

export const MessageFactory: React.FC<MessageFactoryProps> = ({
  message,
  align,
  bubbleColor,
  textColor,
  borderRadius,
}) => {
  return (
    <View style={[styles.container, align === 'right' ? styles.alignRight : styles.alignLeft]}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: bubbleColor,
            borderTopLeftRadius: borderRadius.topLeft,
            borderTopRightRadius: borderRadius.topRight,
            borderBottomLeftRadius: borderRadius.bottomLeft,
            borderBottomRightRadius: borderRadius.bottomRight,
          },
        ]}
      >
        <Text style={[styles.text, { color: textColor }]}>{message.text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 2,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  alignLeft: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
});
