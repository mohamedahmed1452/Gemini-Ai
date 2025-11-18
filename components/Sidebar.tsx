
import React from 'react';
import { AppMode } from '../types';
import { ChatIcon, ImageIcon, PlusIcon } from './icons';

interface SidebarProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  onNewChat: () => void;
  isLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ mode, setMode, onNewChat, isLoading }) => {
  const commonButtonClasses = "flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ease-in-out";
  const activeButtonClasses = "bg-blue-600 text-white";
  const inactiveButtonClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-800 p-4 border-r border-gray-700">
      <button
        onClick={onNewChat}
        disabled={isLoading}
        className="flex items-center justify-center w-full px-4 py-2 mb-6 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        New Chat
      </button>

      <nav className="flex flex-col space-y-2">
        <button
          onClick={() => setMode(AppMode.CHAT)}
          className={`${commonButtonClasses} ${mode === AppMode.CHAT ? activeButtonClasses : inactiveButtonClasses}`}
        >
          <ChatIcon className="w-5 h-5 mr-3" />
          Chat
        </button>
        <button
          onClick={() => setMode(AppMode.IMAGE)}
          className={`${commonButtonClasses} ${mode === AppMode.IMAGE ? activeButtonClasses : inactiveButtonClasses}`}
        >
          <ImageIcon className="w-5 h-5 mr-3" />
          Image Generation
        </button>
      </nav>
      
      <div className="mt-auto text-xs text-gray-500 text-center">
        <p>Powered by Google Gemini</p>
      </div>
    </aside>
  );
};

export default Sidebar;
