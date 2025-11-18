
import React, { useState, useRef, KeyboardEvent } from 'react';
import { AppMode } from '../types';
import { SendIcon, LoadingSpinnerIcon } from './icons';

interface PromptInputProps {
  mode: AppMode;
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ mode, onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleSubmit = () => {
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
      setPrompt('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  const placeholderText = mode === AppMode.CHAT
    ? "Message Gemini..."
    : "Describe an image to generate...";

  return (
    <div className="flex items-end bg-gray-800 border border-gray-600 rounded-xl p-2.5 focus-within:ring-2 focus-within:ring-blue-500 transition-shadow duration-200">
      <textarea
        ref={textareaRef}
        value={prompt}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholderText}
        rows={1}
        className="w-full bg-transparent resize-none focus:outline-none text-gray-200 placeholder-gray-500 max-h-48"
        disabled={isLoading}
      />
      <button
        onClick={handleSubmit}
        disabled={isLoading || !prompt.trim()}
        className="ml-2 flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? <LoadingSpinnerIcon className="w-5 h-5" /> : <SendIcon className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default PromptInput;
