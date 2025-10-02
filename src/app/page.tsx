'use client';

import { useState } from 'react';
import Image from "next/image";
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

type CodingMode = 'lecul' | 'lespieds';

interface ModeConfig {
  name: string;
  title: string;
  subtitle: string;
  placeholder: string;
  logo: string;
  logoAlt: string;
}

const modeConfigs: Record<CodingMode, ModeConfig> = {
  lecul: {
    name: 'Le Cul',
    title: 'Que puis-je faire pour vous ?',
    subtitle: 'Posez-moi n\'importe quelle question',
    placeholder: 'Coder avec Le Cul, c\'est ici',
    logo: '/LogoLeCul.png',
    logoAlt: 'Le Cul'
  },
  lespieds: {
    name: 'Les Pieds',
    title: 'Que puis-je faire pour vous ?',
    subtitle: 'Posez-moi n\'importe quelle question',
    placeholder: 'Coder avec Les Pieds, c\'est ici aussi !',
    logo: '/LogoLesPieds.png',
    logoAlt: 'Les Pieds'
  }
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codingMode, setCodingMode] = useState<CodingMode>('lecul');
  
  const currentConfig = modeConfigs[codingMode];

  const startNewChat = () => {
    setMessages([]);
    setInputValue('');
  };

  const toggleMode = () => {
    setCodingMode(prev => prev === 'lecul' ? 'lespieds' : 'lecul');
    setMessages([]); // Clear messages when switching modes
    setInputValue('');
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/lecul', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue, mode: codingMode }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={startNewChat}
            className="flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-2 py-1 transition-colors"
          >
            <Image
              src={currentConfig.logo}
              alt={currentConfig.logoAlt}
              width={32}
              height={32}
              className="rounded"
            />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {currentConfig.name}
            </h1>
          </button>
          
          {/* Toggle Switch */}
          <div className="flex items-center space-x-4">
            <span className={`text-sm font-medium transition-colors ${
              codingMode === 'lecul' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
            }`}>
              Le Cul
            </span>
            
            <button
              onClick={toggleMode}
              className={`relative w-14 h-8 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                codingMode === 'lecul' ? 'bg-blue-500' : 'bg-gray-400'
              }`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                codingMode === 'lecul' ? 'translate-x-1' : 'translate-x-7'
              }`} />
            </button>
            
            <span className={`text-sm font-medium transition-colors ${
              codingMode === 'lespieds' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
            }`}>
              Les Pieds
            </span>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {messages.length === 0 ? (
          /* Landing Page */
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="text-center mb-12">
              <button onClick={startNewChat} className="block mx-auto mb-6 hover:scale-105 transition-transform">
                <Image
                  src={currentConfig.logo}
                  alt={currentConfig.logoAlt}
                  width={80}
                  height={80}
                  className="rounded-xl"
                />
              </button>
              <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                {currentConfig.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {currentConfig.subtitle}
              </p>
              
              {/* Mode indicator */}
              <div className="mt-6 flex items-center justify-center space-x-4">
                <span className={`text-sm font-medium transition-colors ${
                  codingMode === 'lecul' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  Le Cul
                </span>
                
                <button
                  onClick={toggleMode}
                  className={`relative w-16 h-9 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    codingMode === 'lecul' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}
                >
                  <div className={`absolute top-1 w-7 h-7 bg-white rounded-full shadow transition-transform duration-200 ${
                    codingMode === 'lecul' ? 'translate-x-1' : 'translate-x-8'
                  }`} />
                </button>
                
                <span className={`text-sm font-medium transition-colors ${
                  codingMode === 'lespieds' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  Les Pieds
                </span>
              </div>
            </div>
            
            {/* Centered Input */}
            <div className="w-full max-w-3xl">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={currentConfig.placeholder}
                  className="w-full px-6 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white shadow-lg"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Chat View */
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${message.isUser ? '' : 'flex items-start space-x-3'}`}>
                      {!message.isUser && (
                        <div className="flex-shrink-0">
                          <Image
                            src={currentConfig.logo}
                            alt={currentConfig.logoAlt}
                            width={32}
                            height={32}
                            className="rounded-lg"
                          />
                        </div>
                      )}
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.isUser
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      }`}>
                        {message.isUser ? (
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                        ) : (
                          <div className="prose prose-sm max-w-none dark:prose-invert prose-pre:bg-gray-800 prose-pre:text-green-400 prose-code:bg-gray-700 prose-code:text-yellow-300 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        )}
                        <span className="text-xs opacity-60 mt-2 block">
                          {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <Image
                          src={currentConfig.logo}
                          alt={currentConfig.logoAlt}
                          width={32}
                          height={32}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {codingMode === 'lecul' ? 'Le Cul déglutit...' : 'Les Pieds tapent maladroitement...'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fixed Bottom Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4">
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Tapez votre message..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
