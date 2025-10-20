
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send, Image, Smile, Paperclip, Bot } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string | null;
  image_url: string | null;
  message_type: string;
  created_at: string;
  read_at: string | null;
}

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const emojis = ["😊", "😂", "❤️", "👍", "👎", "😢", "😮", "😡", "🩸", "🏥", "🚑", "💊"];

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, [user]);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages();
    }
  }, [selectedContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchContacts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .neq('id', user.id);

      if (error) {
        console.error('Error fetching contacts:', error);
        return;
      }

      setContacts(data || []);
    } catch (error) {
      console.error('Error in fetchContacts:', error);
    }
  };

  const fetchMessages = async () => {
    if (!user || !selectedContact) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedContact.id}),and(sender_id.eq.${selectedContact.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error in fetchMessages:', error);
    }
  };

  const sendMessage = async (content: string, messageType: string = 'text', imageUrl?: string) => {
    if (!user || !selectedContact || (!content.trim() && !imageUrl)) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: user.id,
            receiver_id: selectedContact.id,
            content: content.trim() || null,
            image_url: imageUrl || null,
            message_type: messageType,
          }
        ]);

      if (error) {
        throw error;
      }

      setNewMessage("");
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsLoading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('message-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('message-images')
        .getPublicUrl(filePath);

      await sendMessage("", "image", data.publicUrl);

      toast({
        title: "Image sent",
        description: "Your image has been sent successfully.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleSendMessage = () => {
    sendMessage(newMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Please log in to access messages.</p>
      </div>
    );
  }

  const [chatbotMessages, setChatbotMessages] = useState<Array<{id: number, text: string, sender: 'user' | 'bot'}>>([]);
  const [chatbotInput, setChatbotInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const generateBotResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
      return "Hello! I'm PulseConnect's AI assistant. How can I help you today regarding blood or plasma donation?";
    } else if (lowerQuery.includes('donate blood')) {
      return "To donate blood, you typically need to be at least 18 years old, weigh over 50kg, and be in good health. You can find more details on our 'Blood Donation' section or schedule an appointment through your dashboard.";
    } else if (lowerQuery.includes('donate plasma')) {
      return "Plasma donation is similar to blood donation but takes longer. You can donate plasma more frequently, typically every 14 days. Check our 'Plasma Therapy' section for eligibility and process details.";
    } else if (lowerQuery.includes('eligibility')) {
      return "Eligibility for donation depends on several factors like age, weight, recent travel, and medical history. Our AI eligibility checker in your profile can give you a personalized assessment.";
    } else if (lowerQuery.includes('find hospital')) {
      return "You can find registered hospitals and blood banks in your area using the 'Hospitals' or 'Map' sections. They provide contact details and available blood types.";
    } else if (lowerQuery.includes('emergency')) {
      return "For emergencies, please use the 'Emergency' section to send an urgent request. Our system will notify nearby donors and hospitals immediately. You can also call our emergency hotline: 108.";
    } else if (lowerQuery.includes('blockchain')) {
      return "PulseConnect uses Polygon (Matic) blockchain to record every donation as an immutable transaction. This ensures transparency and trust. You can verify transactions via the 'Verify on Blockchain' button in your dashboard.";
    } else if (lowerQuery.includes('chat')) {
      return "Our real-time chat system allows donors and hospitals to communicate directly. You can initiate a chat from the 'Donor Search' results or the 'Messages' section.";
    } else if (lowerQuery.includes('cooldown')) {
      return "After a whole blood donation, there's a 56-day cooldown period. For plasma, it's 14 days. Your profile will show your next eligible donation date.";
    } else if (lowerQuery.includes('thank you') || lowerQuery.includes('thanks')) {
      return "You're welcome! Is there anything else I can assist you with?";
    } else if (lowerQuery.includes('how to use')) {
      return "PulseConnect allows you to register as a donor, request blood/plasma, find hospitals, chat with other users, and track your donation history. Explore the sidebar links for different features.";
    } else if (lowerQuery.includes('contact support')) {
      return "You can reach our support team via email at help@pulseconnect.org or through the 'Support' section in the footer. Our chat is also available 24/7.";
    } else {
      return "I'm sorry, I don't have enough information to answer that. Could you please rephrase your question or ask about blood/plasma donation, hospitals, or platform features?";
    }
  };

  const handleChatbotSend = () => {
    if (chatbotInput.trim() === '') return;

    const newUserMessage = { id: chatbotMessages.length + 1, text: chatbotInput, sender: 'user' as const };
    setChatbotMessages(prev => [...prev, newUserMessage]);
    setChatbotInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(chatbotInput);
      const newBotMessage = { id: chatbotMessages.length + 2, text: botResponse, sender: 'bot' as const };
      setChatbotMessages(prev => [...prev, newBotMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-gray-500">Communicate with donors, recipients, and healthcare providers</p>
      </div>

      <Tabs defaultValue="conversations" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="chatbot">AI Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="conversations" className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
        {/* Contacts List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedContact?.id === contact.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {contact.first_name?.[0]}{contact.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{contact.first_name} {contact.last_name}</p>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-2">
          {selectedContact ? (
            <>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {selectedContact.first_name?.[0]}{selectedContact.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  {selectedContact.first_name} {selectedContact.last_name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-0 flex flex-col h-[500px]">
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.sender_id === user.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isOwn
                                ? 'bg-blood text-white'
                                : 'bg-gray-200 text-gray-800'
                            }`}
                          >
                            {message.message_type === 'image' && message.image_url ? (
                              <img
                                src={message.image_url}
                                alt="Shared image"
                                className="max-w-full h-auto rounded"
                              />
                            ) : (
                              <p>{message.content}</p>
                            )}
                            <p className={`text-xs mt-1 ${isOwn ? 'text-white/80' : 'text-gray-500'}`}>
                              {new Date(message.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t p-4">
                  {showEmojiPicker && (
                    <div className="mb-2 p-2 border rounded-lg bg-white">
                      <div className="grid grid-cols-6 gap-2">
                        {emojis.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleEmojiSelect(emoji)}
                            className="text-xl hover:bg-gray-100 p-1 rounded"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="flex-1"
                      disabled={isLoading}
                    />
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      disabled={isLoading}
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isLoading}
                      className="blood-btn"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    aria-label="Upload image"
                  />
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a contact to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
        </TabsContent>

        <TabsContent value="chatbot" className="space-y-6">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-red-600" />
                <CardTitle className="text-lg">PulseConnect AI Assistant</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-4 overflow-y-auto">
              <ScrollArea className="h-full pr-2">
                <div className="space-y-4">
                  {chatbotMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          msg.sender === 'user'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-200 text-gray-800 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Ask me about blood donation, plasma therapy, or platform features..."
                  value={chatbotInput}
                  onChange={(e) => setChatbotInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChatbotSend()}
                />
                <Button onClick={handleChatbotSend} disabled={!chatbotInput.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
