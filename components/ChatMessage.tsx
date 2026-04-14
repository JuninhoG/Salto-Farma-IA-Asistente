import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User, MessageCircle } from 'lucide-react';
import { Message, Role } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.role === Role.MODEL;

  return (
    <div className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isBot ? 'flex-row' : 'flex-row-reverse'} gap-3`}>
        {/* Avatar */}
        <div 
          className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm 
          ${isBot ? 'bg-brand-red text-white' : 'bg-slate-200 text-slate-600'}`}
        >
          {isBot ? <Bot size={20} /> : <User size={20} />}
        </div>

        {/* Bubble */}
        <div 
          className={`p-3 md:p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed overflow-hidden break-words
          ${isBot 
            ? 'bg-white text-slate-800 rounded-tl-none border border-slate-100' 
            : 'bg-brand-red text-white rounded-tr-none'
          }`}
        >
          <ReactMarkdown 
            components={{
              // Custom styling for links
              a: ({node, ...props}) => {
                const isWhatsApp = props.href?.includes('wa.me');
                
                if (isWhatsApp && isBot) {
                  return (
                    <a 
                      {...props} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2.5 rounded-lg font-bold transition-all shadow-md no-underline mt-3 mb-1 w-full sm:w-auto justify-center" 
                    >
                      <MessageCircle size={18} fill="currentColor" className="text-white" />
                      <span>{props.children}</span>
                    </a>
                  );
                }

                return (
                  <a 
                    {...props} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`underline font-bold hover:opacity-80 transition-opacity ${isBot ? 'text-brand-red' : 'text-white'}`} 
                  />
                );
              },
              // Ensure lists are properly padded
              ul: ({node, ...props}) => <ul {...props} className="list-disc pl-4 my-2" />,
              ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-4 my-2" />,
              // Add space between paragraphs
              p: ({node, ...props}) => <p {...props} className="mb-2 last:mb-0" />,
              strong: ({node, ...props}) => <strong {...props} className="font-bold" />
            }}
          >
            {message.text}
          </ReactMarkdown>
          
          <div className={`text-[10px] mt-1 opacity-70 ${isBot ? 'text-slate-400' : 'text-red-100'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};