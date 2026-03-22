import { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';

const TWIN_URL = "https://hey.speak-to.ai/min-ko";

export default function PrifinaChat() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
      {/* Seamless Chat Window */}
      {isOpen && (
        <div 
          className="mb-4 w-[95vw] sm:w-[580px] h-[450px] max-h-[85vh] transition-all duration-500 ease-in-out origin-bottom-right pointer-events-auto bg-white rounded-2xl shadow-2xl overflow-hidden border-none"
        >
          <div className="w-full h-full relative overflow-hidden">
            <iframe 
              src={TWIN_URL}
              className="w-full h-full border-none absolute inset-0"
              title="AI Interface"
              allow="microphone"
              style={{ 
                width: 'calc(100% + 20px)', 
                height: '100%',
                marginRight: '-20px',
                paddingRight: '20px',
                overflowX: 'hidden'
              }}
            />
          </div>
        </div>
      )}

      {/* Minimalist Floating Button */}
      <div className="pointer-events-auto">
        <button
          onClick={toggleChat}
          className={`w-14 h-14 rounded-full bg-cyber-black border border-white/10 flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group relative ${
            isOpen ? 'bg-cyber-green text-black border-transparent' : 'text-cyber-green'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
          
          {!isOpen && (
            <div className="absolute inset-0 rounded-full bg-cyber-green/5 animate-pulse" />
          )}
        </button>
      </div>
    </div>
  );
}
