'use client';
import React, { useState } from 'react';
import {
    Search, Send, Paperclip, Smile, MoreVertical,
    Phone, Video, Info, Users, Clock, CheckCheck,
    ChevronLeft, Menu, X
} from 'lucide-react';
import { mockConversations, mockMessages } from '../../data/MockData';

const TeacherMessagesPage: React.FC = () => {
    const [selectedConversation, setSelectedConversation] = useState(1);
    const [newMessage, setNewMessage] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

    const currentConversation = mockConversations.find(c => c.id === selectedConversation);
    const currentMessages = mockMessages;

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            console.log('Message envoyé:', newMessage);
            setNewMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Liste des conversations - visible sur mobile avec un bouton de menu */}
            <div className={`lg:static absolute inset-0 z-40 lg:z-auto transform transition-transform duration-300 lg:translate-x-0 ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            } lg:w-80 w-full`}>
                <div className="h-full border-r border-gray-200 flex flex-col">
                    {/* En-tête de la liste */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Messages</h2>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="mt-3 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Liste des conversations */}
                    <div className="flex-1 overflow-y-auto">
                        {mockConversations.map(conversation => (
                            <button
                                key={conversation.id}
                                onClick={() => {
                                    setSelectedConversation(conversation.id);
                                    setIsMobileMenuOpen(false);
                                    setIsMobileChatOpen(true);
                                }}
                                className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                                    selectedConversation === conversation.id ? 'bg-blue-50' : ''
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="relative">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                            conversation.isGroup ? 'bg-purple-100' : 'bg-blue-100'
                                        }`}>
                                            {conversation.isGroup ? (
                                                <Users className={conversation.isGroup ? 'text-purple-600' : 'text-blue-600'} size={20} />
                                            ) : (
                                                <span className="text-blue-800 font-medium">
                          {conversation.nom.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                                            )}
                                        </div>
                                        {conversation.isGroup && (
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="font-medium text-sm truncate">{conversation.nom}</div>
                                            <div className="text-xs text-gray-500">{conversation.date}</div>
                                        </div>
                                        <div className="text-sm text-gray-600 truncate">{conversation.dernier}</div>
                                    </div>
                                    {conversation.nonLu > 0 && (
                                        <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                      {conversation.nonLu}
                    </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Zone de chat principale */}
            <div className={`flex-1 flex flex-col ${
                isMobileChatOpen ? 'block' : 'hidden lg:flex'
            }`}>
                {/* En-tête du chat */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileChatOpen(false)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <Menu size={20} />
                        </button>
                        {currentConversation && (
                            <>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    currentConversation.isGroup ? 'bg-purple-100' : 'bg-blue-100'
                                }`}>
                                    {currentConversation.isGroup ? (
                                        <Users className={currentConversation.isGroup ? 'text-purple-600' : 'text-blue-600'} size={20} />
                                    ) : (
                                        <span className="text-blue-800 font-medium">
                      {currentConversation.nom.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{currentConversation.nom}</h3>
                                    <div className="text-sm text-gray-500 flex items-center gap-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        En ligne
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Phone size={20} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Video size={20} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Info size={20} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    <div className="max-w-3xl mx-auto space-y-4">
                        {currentMessages.map(message => (
                            <div
                                key={message.id}
                                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-lg ${message.isOwn ? 'ml-auto' : 'mr-auto'}`}>
                                    <div className={`rounded-2xl px-4 py-3 ${
                                        message.isOwn
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-white text-gray-900 rounded-tl-none shadow-sm'
                                    }`}>
                                        <p className="text-sm">{message.content}</p>
                                    </div>
                                    <div className={`flex items-center gap-2 mt-1 text-xs ${
                                        message.isOwn ? 'justify-end' : 'justify-start'
                                    }`}>
                    <span className={`${message.isOwn ? 'text-gray-500' : 'text-gray-400'}`}>
                      {message.time}
                    </span>
                                        {message.isOwn && (
                                            <CheckCheck size={12} className="text-gray-400" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Zone de saisie */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-end gap-3">
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                            <Paperclip size={20} />
                        </button>
                        <div className="flex-1 relative">
              <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Écrire un message..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
              />
                            <button className="absolute right-3 bottom-3 p-1 hover:bg-gray-100 rounded text-gray-600">
                                <Smile size={20} />
                            </button>
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            className={`p-3 rounded-lg transition ${
                                newMessage.trim()
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherMessagesPage;