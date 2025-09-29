import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatModal from '../../components/Chat/ChatModal';
import { useAuth } from '../../hooks/useAuth';

interface PropertyChat {
  client_id: string;
  client_name: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

const PropertyChats: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [chats, setChats] = useState<PropertyChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<PropertyChat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPropertyAndChats();
  }, [propertyId]);

  const loadPropertyAndChats = async () => {
    try {
      // Load property details
      const propResponse = await fetch(`http://localhost:3001/api/properties/${propertyId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const propData = await propResponse.json();
      setProperty(propData);

      // Load chats for this property
      const chatsResponse = await fetch(`http://localhost:3001/api/messages/property/${propertyId}/chats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const chatsData = await chatsResponse.json();
      setChats(chatsData);
    } catch (error) {
      console.error('Failed to load property chats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Property Messages</h1>
            <p className="text-sm text-gray-600">{property?.title}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Property Info */}
          <div className="card">
            <div className="w-full h-32 bg-gray-200 rounded-lg mb-4"></div>
            <h3 className="font-medium text-gray-900 mb-2">{property?.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{property?.location.district}</p>
            <p className="text-lg font-bold text-primary-600">
              {new Intl.NumberFormat('en-UG', {
                style: 'currency',
                currency: property?.currency === 'UGX' ? 'UGX' : 'USD',
                minimumFractionDigits: 0,
              }).format(property?.price || 0)}
            </p>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Views:</span>
                <span className="font-medium">{property?.views || 0}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">Messages:</span>
                <span className="font-medium">{chats.length}</span>
              </div>
            </div>
          </div>

          {/* Chats List */}
          <div className="lg:col-span-2 card p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Client Messages ({chats.length})</h3>
            </div>
            
            {chats.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No messages for this property yet</p>
                <p className="text-sm">Messages from interested clients will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {chats.map((chat) => (
                  <div
                    key={chat.client_id}
                    onClick={() => setSelectedChat(chat)}
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900">{chat.client_name}</p>
                          {chat.unread_count > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {chat.unread_count}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 truncate">{chat.last_message}</p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(chat.last_message_time).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Modal */}
        {selectedChat && (
          <ChatModal
            isOpen={!!selectedChat}
            onClose={() => setSelectedChat(null)}
            receiverId={selectedChat.client_id}
            receiverName={selectedChat.client_name}
            propertyId={propertyId!}
            propertyTitle={property?.title || ''}
            currentUserId={user?.id || ''}
          />
        )}
      </div>
    </div>
  );
};

export default PropertyChats;