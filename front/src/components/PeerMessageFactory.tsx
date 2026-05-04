import React from 'react';
import { Message as MessageType } from '../types';
import { COLORS } from '../constants';
import { MessageFactory } from './MessageFactory';

interface PeerMessageFactoryProps {
  message: MessageType;
}

export const PeerMessageFactory: React.FC<PeerMessageFactoryProps> = ({ message }) => {
  return (
    <MessageFactory
      message={message}
      align="left"
      bubbleColor={COLORS.surface}
      textColor={COLORS.text}
      borderRadius={{
        topLeft: 20,
        topRight: 20,
        bottomLeft: 4,
        bottomRight: 20,
      }}
    />
  );
};