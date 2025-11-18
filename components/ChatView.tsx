
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import ChatMessage from './ChatMessage';
import { BotIcon } from './icons';

interface ChatViewProps {
  messages: Message[];
}

const ChatView: React.FC<ChatViewProps> = ({ messages }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <BotIcon className="w-16 h-16 mb-4 text-blue-500" />
          <h2 className="text-2xl font-bold mb-2 text-gray-300">Welcome to Gemini AI Studio</h2>
          <p>Start a conversation or generate an image.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          <div ref={endOfMessagesRef} />
        </div>
      )}
    </div>
  );
};

export default ChatView;
