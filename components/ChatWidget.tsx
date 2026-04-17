
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { getArrivalAdvice } from '../services/geminiService';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ text: string, sender: 'user' | 'ai' }[]>([
    { text: "Labas! Welcome to Lithuania. How can I help you plan your arrival today?", sender: 'ai' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setIsLoading(true);

    const aiResponse = await getArrivalAdvice(userMsg);
    setMessages(prev => [...prev, { text: aiResponse || "Sorry, I couldn't process that.", sender: 'ai' }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-[350px] md:w-[400px] flex flex-col overflow-hidden border border-blue-100 transition-all duration-300">
          <div className="bg-blue-800 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-900 font-bold">U</div>
              <div>
                <h3 className="font-semibold text-sm">Arrival Assistant</h3>
                <p className="text-xs text-blue-100 italic">Safe. Reliable. Student-First.</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 rounded-full p-1 transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div ref={scrollRef} className="h-96 overflow-y-auto p-4 space-y-4 bg-blue-50/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                  m.sender === 'user' 
                    ? 'bg-blue-700 text-white rounded-tr-none' 
                    : 'bg-white text-blue-900 shadow-sm border border-blue-100 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white shadow-sm border border-blue-100 rounded-2xl rounded-tl-none p-3">
                  <Loader2 className="animate-spin text-blue-600" size={16} />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-blue-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about SIMs, banks, or transport..."
              className="flex-1 bg-blue-50 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-blue-900 placeholder-blue-400"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-blue-700 hover:bg-blue-800 text-white rounded-lg p-2 disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 group"
        >
          <MessageCircle className="group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
