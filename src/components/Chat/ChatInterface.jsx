import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { useOllama } from '../../hooks/useOllama';
import MessageList from './MessageList';
import LoadingSpinner from '../common/LoadingSpinner';

const ChatInterface = () => {
  const { state, addMessage, saveHistory, startNewChat } = useGlobalContext();
  const [input, setInput] = useState('');
  const { sendMessage, loading, error } = useOllama(state.model);

  // Guardar historial automáticamente cuando hay mensajes
  useEffect(() => {
    if (state.messages.length > 0 && !state.loading) {
      // Guardar después de recibir respuesta
      const lastMessage = state.messages[state.messages.length - 1];
      if (lastMessage?.role === 'assistant') {
        saveHistory();
      }
    }
  }, [state.messages, state.loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // Agregar mensaje del usuario
    const userMessage = { role: 'user', content: input };
    addMessage(userMessage);
    setInput('');

    try {
      // Preparar historial para Ollama
      const history = state.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      history.push(userMessage);

      // Obtener respuesta
      const response = await sendMessage(history);
      
      // Agregar respuesta al estado
      addMessage({ role: 'assistant', content: response });
      
      // El historial se guarda automáticamente con el useEffect
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleNewChat = () => {
    if (state.messages.length > 0) {
      if (window.confirm('¿Guardar la conversación actual antes de empezar una nueva?')) {
        startNewChat();
      } else {
        // Limpiar sin guardar
        state.messages = [];
        // Forzar actualización
        window.location.reload(); // Opcional: mejor usar un estado de actualización
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Chat</h2>
          <button
            onClick={handleNewChat}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
          >
            + Nueva conversación
          </button>
        </div>
        <MessageList messages={state.messages} />
        {loading && <LoadingSpinner />}
        {error && (
          <div className="text-red-500 p-4 bg-red-50 rounded-lg">
            Error: {error}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;