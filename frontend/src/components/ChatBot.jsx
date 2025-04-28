import { useState, useRef, useEffect } from 'react';
import { X, Send, ShoppingBag } from 'lucide-react';
import FrippieLogo from '../assets/Frippie.png';
import { generateGeminiResponse } from '../services/geminiService';


export default function Frippie() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: "Hello there! 👋 Welcome to FRIPPY.", 
      sender: "bot",
      timestamp: new Date()
    },
    {
      text: "I'm Frippie, your personal style assistant. How can I help you discover elegance today?",
      sender: "bot",
      timestamp: new Date(Date.now() + 100)
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  

  const handleSendMessage = async (e, quickReplyValue = null) => {
    if (e) e.preventDefault();
    
    let userInput = quickReplyValue || inputValue;
    if (!userInput.trim()) return;
    
    const userMessage = {
      text: userInput,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      // Get response from Gemini
      const responseText = await generateGeminiResponse(userInput);
      
      const botMessage = {
        text: responseText,
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage = {
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div 
          className="bg-white rounded-2xl shadow-xl mb-4 w-80 h-[550px] flex flex-col overflow-hidden transition-all duration-500 ease-out border border-gray-100 animate-fadeIn"
        >
          {/* Header */}
          <div className="bg-black text-white px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center mr-2 overflow-hidden">
                <img src={FrippieLogo} alt="Frippie" className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium tracking-wide">FRIPPIE</div>
                <div className="text-xs text-green-400">Online</div>
              </div>
            </div>
            <button 
              onClick={toggleChat}
              className="text-white hover:bg-gray-800 rounded-full p-1 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'bot' && (
                    // Added animate-pulse to make the logo more prominent.
                    <div className="h-8 w-8 bg-white border border-gray-200 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0 animate-pulse overflow-hidden">
                      <img src={FrippieLogo} alt="Frippie" className="w-5 h-5" />
                    </div>
                  )}
                  <div 
                    className={`max-w-3/4 p-3 rounded-2xl ${
                      message.sender === 'user' 
                        ? 'bg-black text-white rounded-br-none' 
                        : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-200'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  {/* Animate the logo for typing indicator */}
                  <div className="h-8 w-8 bg-black border border-gray-200 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0 animate-pulse overflow-hidden">
                    <img src={FrippieLogo} alt="Frippie" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="border-t p-3 flex bg-white items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 p-2 focus:outline-none text-gray-700 bg-gray-50 rounded-l-full"
            />
            <button 
              type="submit"
              className="bg-black text-white p-2 rounded-r-full flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          </form>
          
          {/* Footer */}
          <div className="bg-white px-4 py-1 text-center border-t">
            <span className="text-xs text-gray-400">Powered by <span className='text-xs font-bold'>FRIPPY</span></span>
          </div>
        </div>
      )}
      
      {/* Toggle Button - Chat Button with Logo */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-white border-2 border-black text-white p-4 rounded-full shadow-lg transition-colors flex items-center justify-center overflow-hidden"
          aria-label="Chat with Frippie"
        >
          <div className="w-6 h-6 justify-center items-center">
            <img src={FrippieLogo} alt="Frippie" className="w-6 h-6" />
          </div>
        </button>
      )}
    </div>
  );
}