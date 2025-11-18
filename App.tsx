
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AppMode, Message, Role, ImageGen } from './types';
import { streamChatResponse, generateImage } from './services/geminiService';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import ImageView from './components/ImageView';
import PromptInput from './components/PromptInput';
import Header from './components/Header';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.CHAT);
  const [messages, setMessages] = useState<Message[]>([]);
  const [images, setImages] = useState<ImageGen[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleNewChat = () => {
    setMessages([]);
    setImages([]);
    setError(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
  };

  const handleSendMessage = useCallback(async (prompt: string) => {
    if (!prompt || isLoading) return;

    setError(null);
    setIsLoading(true);

    if (mode === AppMode.CHAT) {
      const newUserMessage: Message = { role: Role.USER, text: prompt };
      setMessages(prev => [...prev, newUserMessage]);
      
      const modelResponse: Message = { role: Role.MODEL, text: '' };
      setMessages(prev => [...prev, modelResponse]);

      try {
        const stream = streamChatResponse(prompt, messages);
        for await (const chunk of stream) {
          setMessages(prev => prev.map((msg, index) => 
            index === prev.length - 1 ? { ...msg, text: msg.text + chunk } : msg
          ));
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Error generating response: ${errorMessage}`);
        setMessages(prev => prev.slice(0, -1)); // Remove placeholder
      }

    } else { // Image mode
      try {
        const base64Image = await generateImage(prompt);
        const newImage: ImageGen = {
          src: `data:image/jpeg;base64,${base64Image}`,
          prompt: prompt,
        };
        setImages(prev => [newImage, ...prev]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Error generating image: ${errorMessage}`);
      }
    }
    
    setIsLoading(false);
  }, [mode, isLoading, messages]);

  const handleStop = () => {
    // Note: Streaming cancellation is not directly supported by the library's async iterator.
    // This is a placeholder for future implementation if the API supports it.
    // For now, we just reset the loading state.
    setIsLoading(false);
    console.log("Generation stopped by user.");
  };

  return (
    <div className="flex h-screen w-full font-sans bg-gray-900 text-white">
      <Sidebar mode={mode} setMode={setMode} onNewChat={handleNewChat} isLoading={isLoading} />
      <div className="flex flex-col flex-1 h-screen">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 relative">
          {error && (
            <div className="absolute top-4 right-4 bg-red-500/90 text-white p-3 rounded-lg shadow-lg">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}
          {mode === AppMode.CHAT ? (
            <ChatView messages={messages} />
          ) : (
            <ImageView images={images} />
          )}
        </main>
        <div className="p-4 md:p-6 bg-gray-900 border-t border-gray-700">
          {isLoading && (
            <div className="flex justify-center mb-2">
              <button onClick={handleStop} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-colors">
                Stop Generating
              </button>
            </div>
          )}
          <PromptInput mode={mode} onSubmit={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default App;
