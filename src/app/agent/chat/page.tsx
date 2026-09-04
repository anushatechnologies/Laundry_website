'use client';

import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface ChatRoom {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  agent_id?: string;
  status: string;
  subject: string;
  last_message: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  sender_type: 'CUSTOMER' | 'AGENT';
  message: string;
  message_type: string;
  created_at: string;
  is_read: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const SOCKET_URL = API_URL.replace('/api', '');

export default function AgentChatDashboard() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [agentId] = useState('agent_priya_001'); // In production, get from auth
  const [agentName] = useState('Priya M.');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all active chat rooms
  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_URL}/api/chat/rooms?status=ACTIVE`);
      const data = await response.json();
      if (data.success) {
        setRooms(data.data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  // Fetch messages for selected room
  const fetchMessages = async (roomId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/chat/messages/${roomId}`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Assign agent to room
  const assignToRoom = async (roomId: string) => {
    try {
      await fetch(`${API_URL}/api/chat/rooms/${roomId}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, agentName }),
      });
      fetchRooms();
    } catch (error) {
      console.error('Error assigning agent:', error);
    }
  };

  // Initialize WebSocket
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('[Agent] Connected to WebSocket');
      setIsConnected(true);
      
      // Authenticate as agent
      newSocket.emit('authenticate', { userId: agentId, userType: 'AGENT' });
      
      // Broadcast agent online status
      newSocket.emit('agent_status', { agentId, status: 'ONLINE' });
    });

    newSocket.on('disconnect', () => {
      console.log('[Agent] Disconnected from WebSocket');
      setIsConnected(false);
    });

    newSocket.on('authenticated', () => {
      console.log('[Agent] Authenticated');
    });

    newSocket.on('new_message', (message: ChatMessage) => {
      console.log('[Agent] New message received:', message);
      
      // Update messages if in current room
      if (selectedRoom && message.room_id === selectedRoom.id) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
      
      // Refresh rooms list to update last_message
      fetchRooms();
    });

    newSocket.on('user_typing', (data) => {
      if (selectedRoom && data.roomId === selectedRoom.id && data.userId !== agentId) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    newSocket.on('user_typing_stopped', () => {
      setIsTyping(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit('agent_status', { agentId, status: 'OFFLINE' });
      newSocket.disconnect();
    };
  }, [agentId, selectedRoom]);

  // Fetch rooms on mount
  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  // Join room when selected
  useEffect(() => {
    if (socket && selectedRoom) {
      socket.emit('join_room', { roomId: selectedRoom.id, userId: agentId });
      fetchMessages(selectedRoom.id);
      
      // Auto-assign if not assigned
      if (!selectedRoom.agent_id) {
        assignToRoom(selectedRoom.id);
      }
    }
  }, [selectedRoom, socket]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !socket || !selectedRoom) return;

    const messageData = {
      roomId: selectedRoom.id,
      senderId: agentId,
      senderType: 'AGENT',
      message: inputMessage.trim(),
      messageType: 'TEXT',
    };

    socket.emit('send_message', messageData);
    setInputMessage('');
    socket.emit('typing_stop', { roomId: selectedRoom.id, userId: agentId });
  };

  const handleTyping = () => {
    if (socket && selectedRoom) {
      socket.emit('typing_start', {
        roomId: selectedRoom.id,
        userId: agentId,
        userName: agentName,
      });
    }
  };

  const closeRoom = async (roomId: string) => {
    try {
      await fetch(`${API_URL}/api/chat/rooms/${roomId}/close`, {
        method: 'PUT',
      });
      setSelectedRoom(null);
      fetchRooms();
    } catch (error) {
      console.error('Error closing room:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Active Chats */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">💬 Live Chat Support</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {rooms.filter(r => r.status === 'ACTIVE').length} active chats
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {rooms.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No active chats</p>
            </div>
          ) : (
            rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`w-full p-4 border-b border-gray-100 text-left hover:bg-gray-50 transition ${
                  selectedRoom?.id === room.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{room.customer_name || 'Customer'}</h3>
                    <p className="text-sm text-gray-500">{room.customer_phone}</p>
                  </div>
                  {!room.agent_id && (
                    <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded">
                      New
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1 truncate">{room.last_message || room.subject}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(room.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{selectedRoom.customer_name || 'Customer'}</h2>
                <p className="text-sm text-gray-500">{selectedRoom.customer_phone}</p>
              </div>
              <button
                onClick={() => closeRoom(selectedRoom.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Close Chat
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                const isAgent = msg.sender_type === 'AGENT';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isAgent
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${isAgent ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg">
                    <p className="text-sm italic">Customer is typing...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!isConnected}
                />
                <button
                  onClick={sendMessage}
                  disabled={!isConnected || !inputMessage.trim()}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg
                className="w-24 h-24 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-lg">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
