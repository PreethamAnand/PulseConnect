import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, X, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m PulseConnect Assistant. How can I help you with blood donation, plasma therapy, or any questions about our platform?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Blood donation related responses
    if (message.includes('blood') && message.includes('donate')) {
      return 'To donate blood, you need to be 18-65 years old, weigh at least 50kg, and be in good health. You can donate every 56 days. Visit our Blood Requests page to find nearby donation opportunities.';
    }
    
    if (message.includes('plasma') && message.includes('donate')) {
      return 'Plasma donation is similar to blood donation but takes 45-60 minutes. You can donate plasma every 14 days. Plasma is used for treating various medical conditions. Check our Plasma Center for more information.';
    }
    
    if (message.includes('eligibility') || message.includes('eligible')) {
      return 'Our AI system checks your eligibility based on age, weight, health status, and donation history. You can check your eligibility status in your profile page.';
    }
    
    if (message.includes('cooldown') || message.includes('wait')) {
      return 'Blood donation cooldown is 56 days (8 weeks), while plasma donation cooldown is 14 days (2 weeks). Your next eligible date is shown in your profile.';
    }
    
    if (message.includes('emergency') || message.includes('urgent')) {
      return 'For emergency blood needs, use our Emergency page or call 108. We prioritize emergency requests and notify nearby donors immediately.';
    }
    
    if (message.includes('hospital') || message.includes('find')) {
      return 'You can find registered hospitals in our Hospitals page. All hospitals are verified and have real-time blood inventory information.';
    }
    
    if (message.includes('blockchain') || message.includes('verify')) {
      return 'All donations are recorded on Polygon blockchain for transparency. You can verify your donations using the "Verify on Blockchain" button in your dashboard.';
    }
    
    if (message.includes('chat') || message.includes('message')) {
      return 'You can chat directly with hospitals and donors through our real-time messaging system. Click "Contact Donor" in search results to start a conversation.';
    }
    
    if (message.includes('profile') || message.includes('account')) {
      return 'Manage your profile, donation history, and preferences in the Profile page. You can update your information, check eligibility, and view your donation records.';
    }
    
    if (message.includes('help') || message.includes('support')) {
      return 'I\'m here to help! You can ask about blood donation, plasma therapy, finding hospitals, emergency services, blockchain verification, or any other platform features.';
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return 'Hello! Welcome to PulseConnect. I\'m here to help you with blood donation, plasma therapy, and platform-related questions. What would you like to know?';
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return 'You\'re welcome! I\'m glad I could help. Feel free to ask if you have any more questions about PulseConnect.';
    }
    
    // Default responses
    const defaultResponses = [
      'I understand you\'re asking about something. Could you be more specific about blood donation, plasma therapy, or platform features?',
      'That\'s an interesting question! I can help with blood donation, plasma therapy, hospital finding, emergency services, or blockchain verification. What would you like to know?',
      'I\'m here to help with PulseConnect features. You can ask about donating blood or plasma, finding hospitals, emergency services, or using our platform.',
      'Could you rephrase your question? I can assist with blood donation, plasma therapy, hospital services, or platform navigation.'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-red-600 hover:bg-red-700 shadow-lg"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <Heart className="h-6 w-6 text-white" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-80 h-96 shadow-2xl border-0">
          <CardHeader className="bg-red-600 text-white p-4 rounded-t-lg">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5" />
              PulseConnect Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-80">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.isUser
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ChatBot;
