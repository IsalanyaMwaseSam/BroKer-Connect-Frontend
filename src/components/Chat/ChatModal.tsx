import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
  sender_name: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiverId: string;
  receiverName: string;
  propertyId: string;
  propertyTitle: string;
  currentUserId: string;
}

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  receiverId,
  receiverName,
  propertyId,
  propertyTitle,
  currentUserId
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadMessages();
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, receiverId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/messages/${receiverId}?propertyId=${propertyId}`, {
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
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          receiverId,
          propertyId,
          message: newMessage
        })
      });

      if (response.ok) {
        setNewMessage('');
        loadMessages();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md h-96 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div>
            <h3 className="font-medium text-gray-900">{receiverName}</h3>
            <p className="text-sm text-gray-600">{propertyTitle}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs px-3 py-2 rounded-lg ${
                  message.sender_id === currentUserId
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}>
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender_id === currentUserId ? 'text-primary-200' : 'text-gray-500'
                  }`}>
                    {new Date(message.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
              placeholder="Type your message..."
              className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={2}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !newMessage.trim()}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white p-2 rounded-lg"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;