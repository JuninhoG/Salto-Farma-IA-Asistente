import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, Role } from './types';
import { initializeChat, sendMessageToGemini } from './services/geminiService';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Pill, Activity, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef<boolean>(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Chat Session on Mount
  useEffect(() => {
    const startChat = async () => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      try {
        const initialGreeting = await initializeChat();
        setMessages([
          {
            id: uuidv4(),
            role: Role.MODEL,
            text: initialGreeting,
            timestamp: new Date(),
          },
        ]);
      } catch (error) {
        console.error("Failed to start chat", error);
        setMessages([
          {
            id: uuidv4(),
            role: Role.MODEL,
            text: "⚠️ Error de conexión. Por favor, recarga la página.",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
        setIsInitializing(false);
      }
    };

    startChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async (text: string) => {
    // Optimistic UI update: Add user message immediately
    const userMsg: Message = {
      id: uuidv4(),
      role: Role.USER,
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(text);
      
      const botMsg: Message = {
        id: uuidv4(),
        role: Role.MODEL,
        text: responseText,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error", error);
      const errorMsg: Message = {
        id: uuidv4(),
        role: Role.MODEL,
        text: "Lo siento, hubo un error de conexión. ¿Podrías intentar de nuevo?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white font-sans text-black">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1">
              <img 
                src="https://i.ibb.co/KpJCsGDM/salto-farma-png.png" 
                alt="Salto Farma Logo" 
                className="h-10 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-black tracking-tight">Salto Farma</h1>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-red"></span>
                </span>
                <span className="text-xs font-medium text-brand-red">Online</span>
              </div>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-slate-500">
             <div className="flex items-center gap-1">
                <Activity size={14} />
                <span>Metabólicos</span>
             </div>
             <div className="flex items-center gap-1">
                <ShieldCheck size={14} />
                <span>Seguro</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <div className="max-w-3xl mx-auto flex flex-col min-h-full justify-end">
          
          {isInitializing && (
            <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-50">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
              <p className="text-sm text-slate-400">Conectando con Salto Farma...</p>
            </div>
          )}

          {!isInitializing && messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          
          {isLoading && !isInitializing && (
             <div className="flex justify-start w-full mb-4">
                 <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                 </div>
             </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <ChatInput onSend={handleSendMessage} disabled={isLoading || isInitializing} />
    </div>
  );
};

export default App;