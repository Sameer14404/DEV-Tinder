import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Code, Users, MapPin, Briefcase, Calendar, Clock, Copy, CheckCircle } from 'lucide-react';

const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm Harmaini, your AI assistant for DevTinder. I can help you find developers, answer technical questions, debug code, or just have a tech conversation. What can I help you with today?",
      timestamp: new Date(),
      intent: 'GENERAL'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate API call - replace with your actual endpoint
      const response = await fetch('http://localhost:5001/harmaini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory: messages.slice(-10) // Last 10 messages for context
        }),
      });

      const result = await response.json();

      if (result.success) {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: result.response.message || result.response.response,
          timestamp: new Date(),
          intent: result.response.intent,
          codeExample: result.response.codeExample,
          suggestions: result.response.suggestions || [],
          results: result.response.results || [],
          resultCount: result.response.resultCount || 0,
          confidence: result.response.confidence
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
        intent: 'GENERAL'
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getIntentColor = (intent) => {
    switch (intent) {
      case 'DATABASE_QUERY': return 'bg-blue-500/20 text-blue-300';
      case 'TECHNICAL_HELP': return 'bg-green-500/20 text-green-300';
      default: return 'bg-purple-500/20 text-purple-300';
    }
  };

  const getIntentIcon = (intent) => {
    switch (intent) {
      case 'DATABASE_QUERY': return <Users size={14} />;
      case 'TECHNICAL_HELP': return <Code size={14} />;
      default: return <Bot size={14} />;
    }
  };

  const DeveloperCard = ({ developer }) => (
    <div className="bg-[#1f2937] rounded-2xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition duration-300 mb-3">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-purple-500/30">
          {developer.photoUrl ? (
            <img
              src={developer.photoUrl}
              alt={developer.firstName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold text-lg mb-1">
            {developer.firstName} {developer.lastName}
          </h4>
          
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {developer.experienceLevel && (
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                {developer.experienceLevel}
              </span>
            )}
            {developer.availability && (
              <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                {developer.availability}
              </span>
            )}
          </div>

          {developer.skills && developer.skills.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {developer.skills.slice(0, 6).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded border border-purple-500/30"
                  >
                    {skill}
                  </span>
                ))}
                {developer.skills.length > 6 && (
                  <span className="px-2 py-1 text-purple-400 text-xs">
                    +{developer.skills.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-purple-200">
            {developer.location && (
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {developer.location}
              </span>
            )}
            {developer.profession && (
              <span className="flex items-center gap-1">
                <Briefcase size={12} />
                {developer.profession}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#0f172b] text-white">
      {/* Header */}
      <div className="bg-[#1f2937] border-b border-purple-500/20 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              Harmaini AI Assistant
            </h1>
            <p className="text-purple-200 text-sm">Your DevTinder AI Helper</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.type === 'user' 
                ? 'bg-gradient-to-r from-pink-500 to-purple-500' 
                : 'bg-gradient-to-r from-purple-500 to-blue-500'
            }`}>
              {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            {/* Message Content */}
            <div className={`flex flex-col max-w-[80%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`rounded-2xl px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                  : 'bg-[#1f2937] text-purple-100 border border-purple-500/20'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>

           

              {/* Timestamp */}
              <span className="text-purple-400 text-xs mt-1">
                {formatTimestamp(message.timestamp)}
              </span>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-[#1f2937] rounded-2xl px-4 py-3 border border-purple-500/20">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-[#1f2937] border-t border-purple-500/20 px-6 py-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about developers, coding questions, or anything tech-related..."
              className="w-full px-4 py-3 bg-[#0f172b] border border-purple-500/20 rounded-2xl text-white placeholder-purple-400/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition resize-none"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl hover:from-pink-600 hover:to-purple-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;