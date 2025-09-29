import React, { useState, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';

interface Conversation {
  other_user_id: string;
  other_user_name: string;
  property_title: string;
  property_id: string;
  last_message: string;
  last_message_time: string;
}

interface Message {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
  sender_name: string;
}

const BrokerMessages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (otherUserId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/messages/${otherUserId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await fetch('http://localhost:3001/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          receiverId: selectedConversation.other_user_id,
          propertyId: selectedConversation.property_id,
          message: newMessage
        })
      });

      if (response.ok) {
        setNewMessage('');
        loadMessages(selectedConversation.other_user_id);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const selectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.other_user_id);
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
          {/* Conversations List */}
          <div className="card p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Conversations</h3>
            </div>
            <div className="overflow-y-auto h-80">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No messages yet</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={`${conversation.other_user_id}-${conversation.property_id}`}
                    onClick={() => selectConversation(conversation)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedConversation?.other_user_id === conversation.other_user_id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">{conversation.other_user_name}</p>
                        <p className="text-xs text-gray-600 mb-1">{conversation.property_title}</p>
                        <p className="text-xs text-gray-500 truncate">{conversation.last_message}</p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(conversation.last_message_time).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="lg:col-span-2 card p-0 overflow-hidden">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900">{selectedConversation.other_user_name}</h3>
                  <p className="text-sm text-gray-600">{selectedConversation.property_title}</p>
                </div>
                
                <div className="h-64 overflow-y-auto p-4 space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === selectedConversation.other_user_id ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        message.sender_id === selectedConversation.other_user_id
                          ? 'bg-gray-200 text-gray-900'
                          : 'bg-primary-600 text-white'
                      }`}>
                        <p>{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender_id === selectedConversation.other_user_id ? 'text-gray-500' : 'text-primary-200'
                        }`}>
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 input-field"
                    />
                    <button
                      onClick={sendMessage}
                      className="btn-primary px-4 py-2 flex items-center space-x-2"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrokerMessages;