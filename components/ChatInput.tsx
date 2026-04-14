import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus the textarea when the disabled prop changes to false
  // This ensures the input is focused immediately after the assistant responds
  useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        // Ensure focus is kept immediately after submit as well, though it will be disabled shortly after by the parent
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="bg-white p-4 border-t border-slate-200">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Escribe tu mensaje..."
          rows={1}
          className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl focus:ring-brand-red focus:border-brand-red block w-full p-3 resize-none max-h-32 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed outline-none focus:ring-2 transition-all"
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="bg-brand-red text-white rounded-xl p-3 hover:opacity-90 focus:ring-4 focus:ring-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-sm"
        >
          {disabled ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
        </button>
      </form>
      <div className="text-center mt-2">
         <p className="text-xs text-slate-400">
            Salto Farma Assistente Virtual puede cometer errores. Consulta siempre a un profesional médico.
         </p>
      </div>
    </div>
  );
};