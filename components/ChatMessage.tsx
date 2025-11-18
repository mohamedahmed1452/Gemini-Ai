
import React from 'react';
import { Message, Role } from '../types';
import { UserIcon, BotIcon } from './icons';

interface ChatMessageProps {
  message: Message;
}

const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\`\`\`[\s\S]*?\`\`\`)/g);
  
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const code = part.slice(3, -3).trim();
          return (
            <pre key={index} className="bg-gray-900/70 p-3 my-2 rounded-lg overflow-x-auto">
              <code className="text-sm font-mono text-cyan-300">{code}</code>
            </pre>
          );
        }
        return part.split('\n').map((line, i) => <p key={`${index}-${i}`} className="break-words">{line}</p>);
      })}
    </>
  );
};


const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  const wrapperClasses = isUser ? "flex justify-end" : "flex justify-start";
  const bubbleClasses = isUser
    ? "bg-blue-600 text-white"
    : "bg-gray-700 text-gray-200";
  const icon = isUser ? <UserIcon className="w-6 h-6 text-white" /> : <BotIcon className="w-6 h-6 text-blue-400" />;
  const iconWrapperClasses = isUser ? "bg-blue-600" : "bg-gray-600";
  const messageContentClasses = `prose prose-invert max-w-none text-white ${isUser ? '' : ''}`;
  
  // Add a blinking cursor for the model's in-progress message
  const isTyping = message.role === Role.MODEL && message.text.length === 0 || (message.text && !/(\s|[.?!])$/.test(message.text));


  return (
    <div className={`${wrapperClasses} items-start space-x-3`}>
      {!isUser && (
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconWrapperClasses}`}>
          {icon}
        </div>
      )}

      <div className={`max-w-2xl px-4 py-3 rounded-2xl ${bubbleClasses} ${isUser ? 'order-1' : ''}`}>
        <div className={messageContentClasses}>
            <SimpleMarkdown text={message.text} />
            {isTyping && message.role === Role.MODEL && <span className="inline-block w-2.5 h-5 bg-white animate-pulse ml-1"></span>}
        </div>
      </div>

      {isUser && (
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconWrapperClasses}`}>
          {icon}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
