import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../../services/chatService';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  // Cargar mensajes guardados al iniciar
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const savedMessages = await chatService.getMessages();
        if (savedMessages.length > 0) {
          setMessages(savedMessages);
        }
      } catch (err) {
        console.error('Error cargando mensajes:', err);
      }
    };
    loadMessages();
  }, []);

  // Escuchar eventos del historial
  useEffect(() => {
    const handleLoadConversation = (event) => {
      const { messages: loadedMessages } = event.detail;
      if (loadedMessages && loadedMessages.length > 0) {
        setMessages(loadedMessages);
      }
    };

    window.addEventListener('loadConversation', handleLoadConversation);
    return () => {
      window.removeEventListener('loadConversation', handleLoadConversation);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Guardar conversación cuando se termina (al hacer click en "+ Nuevo" o al cerrar)
  const saveCurrentConversation = async () => {
    if (messages.length > 0) {
      const conversation = {
        id: Date.now(),
        messages: [...messages],
        timestamp: new Date().toISOString(),
        title: messages[0]?.content?.substring(0, 30) + (messages[0]?.content?.length > 30 ? '...' : '') || 'Nueva conversación'
      };
      await chatService.saveConversation(conversation);
      return true;
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    setError(null);

    const updatedMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error('El servidor no respondió con JSON válido');
      }

      const data = await response.json();

      if (data.success) {
        const newMessages = [...updatedMessages, { role: 'assistant', content: data.response }];
        setMessages(newMessages);

        // Guardar mensajes individuales en LowDB (para el chat actual)
        await chatService.saveMessage(Date.now().toString(), 'user', userMessage);
        await chatService.saveMessage((Date.now() + 1).toString(), 'assistant', data.response);
      } else {
        throw new Error(data.error || 'Error al obtener respuesta');
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message);
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: `❌ Error: ${err.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    if (messages.length > 0) {
      if (window.confirm('¿Guardar la conversación actual?')) {
        await saveCurrentConversation();
        setMessages([]);
        // Recargar historial
        window.dispatchEvent(new CustomEvent('refreshHistory'));
      } else {
        setMessages([]);
      }
    }
  };

  const clearChat = async () => {
    if (window.confirm('¿Borrar todas las conversaciones?')) {
      try {
        await chatService.clearAll();
        setMessages([]);
        setError(null);
        window.dispatchEvent(new CustomEvent('refreshHistory'));
      } catch (err) {
        console.error('Error limpiando:', err);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-700">💬 Chat con IA</h2>
          <button
            onClick={handleNewChat}
            className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
          >
            + Nuevo
          </button>
        </div>
        <button onClick={clearChat} className="text-xs text-red-500 hover:text-red-700">
          Limpiar todo
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-2xl mb-2">🤖</p>
            <p className="text-lg font-medium">¡Bienvenido a devfSeek!</p>
            <p className="text-sm">Escribe un mensaje para comenzar</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 shadow-md'
              }`}>
                <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 p-3 rounded-lg shadow-md">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        {error && !isLoading && (
          <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg border border-red-200">
            ❌ {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;