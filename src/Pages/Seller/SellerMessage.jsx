import React, { useState } from 'react';
import { Search, Filter, Send, Paperclip, MoreVertical, Phone, Video, User, Clock } from 'lucide-react';

function SellerMessages() {
  const [activeChat, setActiveChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  
  const conversations = [
    {
      id: 1,
      customer: 'John Doe',
      lastMessage: 'When will my order be shipped?',
      time: '10:30 AM',
      unread: 2,
      orderId: 1001,
      status: 'active'
    },
    {
      id: 2,
      customer: 'Sarah Williams',
      lastMessage: 'Thanks for the quick delivery!',
      time: 'Yesterday',
      unread: 0,
      orderId: 1003,
      status: 'active'
    },
    {
      id: 3,
      customer: 'Robert Johnson',
      lastMessage: 'I have an issue with the product quality',
      time: '2 days ago',
      unread: 1,
      orderId: 1005,
      status: 'pending'
    },
    {
      id: 4,
      customer: 'Emma Wilson',
      lastMessage: 'Can I get a discount on bulk order?',
      time: '3 days ago',
      unread: 0,
      orderId: null,
      status: 'active'
    },
  ];
  
  const messages = {
    1: [
      { id: 1, sender: 'customer', text: 'Hello, I ordered a PlayStation 3 yesterday', time: '10:15 AM' },
      { id: 2, sender: 'customer', text: 'When will it be shipped?', time: '10:16 AM' },
      { id: 3, sender: 'seller', text: 'Hi John! Thanks for your order.', time: '10:20 AM' },
      { id: 4, sender: 'seller', text: 'Your order will be shipped within 24 hours.', time: '10:20 AM' },
      { id: 5, sender: 'customer', text: 'Great! What\'s the tracking number?', time: '10:30 AM' },
    ],
    2: [
      { id: 1, sender: 'customer', text: 'The product arrived perfectly!', time: 'Yesterday, 2:30 PM' },
      { id: 2, sender: 'seller', text: 'Glad to hear that! Enjoy your purchase.', time: 'Yesterday, 3:15 PM' },
    ],
    3: [
      { id: 1, sender: 'customer', text: 'The headphones have sound issues', time: '2 days ago, 11:45 AM' },
      { id: 2, sender: 'seller', text: 'Sorry to hear that. Can you describe the issue?', time: '2 days ago, 12:30 PM' },
    ],
  };
  
  const activeConversation = conversations.find(c => c.id === activeChat);
  const activeMessages = messages[activeChat] || [];

  const sendMessage = () => {
    if (newMessage.trim()) {
      // In real app, this would send to backend
      setNewMessage('');
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-xl shadow">
      <div className="flex h-full">
        {/* Sidebar - Conversations */}
        <div className="w-96 border-r">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Messages</h2>
              <div className="flex items-center gap-2">
                <Phone size={20} className="text-gray-500" />
                <Video size={20} className="text-gray-500" />
              </div>
            </div>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            {/* Filter */}
            <div className="flex gap-2 mb-4">
              <button className="px-3 py-1 bg-orange-600 text-white rounded-full text-sm">All</button>
              <button className="px-3 py-1 border rounded-full text-sm hover:bg-gray-50">Unread</button>
              <button className="px-3 py-1 border rounded-full text-sm hover:bg-gray-50">Order Related</button>
            </div>
          </div>
          
          {/* Conversations List */}
          <div className="overflow-y-auto h-[calc(100%-8rem)]">
            {conversations.map(chat => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition ${
                  activeChat === chat.id ? 'bg-orange-50 border-l-4 border-orange-500' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User size={24} className="text-gray-500" />
                      </div>
                      {chat.status === 'active' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-bold">{chat.customer}</h3>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={12} />
                          {chat.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                      {chat.orderId && (
                        <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          Order #{chat.orderId}
                        </span>
                      )}
                    </div>
                  </div>
                  {chat.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={20} className="text-gray-500" />
              </div>
              <div>
                <h3 className="font-bold">{activeConversation?.customer}</h3>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${activeConversation?.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-sm text-gray-500">
                    {activeConversation?.status === 'active' ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Phone size={20} />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Video size={20} />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {activeMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'seller' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xl rounded-lg p-3 ${
                    msg.sender === 'seller' 
                      ? 'bg-orange-100 text-gray-800 rounded-br-none' 
                      : 'bg-white border text-gray-800 rounded-bl-none'
                  }`}>
                    <p>{msg.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <button className="p-3 text-gray-500 hover:text-gray-700">
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={sendMessage}
                className="px-6 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
              >
                <Send size={20} />
                Send
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send. Your messages are protected by end-to-end encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerMessages;