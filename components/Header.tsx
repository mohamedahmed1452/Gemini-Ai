
import React from 'react';
import { SparklesIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="flex items-center p-4 bg-gray-900/50 border-b border-gray-700 backdrop-blur-sm">
        <SparklesIcon className="w-6 h-6 text-blue-400 mr-2" />
        <h1 className="text-xl font-bold text-gray-200">Gemini AI Studio</h1>
    </header>
  );
};

export default Header;
