import React from 'react';
import { Message as MessageType } from '../types';
import { COLORS } from '../constants';
import { MessageFactory } from './MessageFactory';

interface SelfMessageFactoryProps {
  message: MessageType;
}

export const SelfMessageFactory: React.FC<SelfMessageFactoryProps> = ({ message }) => {
  return (
    <MessageFactory
      message={message}
      align="right"
      bubbleColor={COLORS.primary}
      textColor="#fff"
      borderRadius={{
        topLeft: 20,
        topRight: 20,
        bottomLeft: 20,
        bottomRight: 4,
      }}
    />
  );
};