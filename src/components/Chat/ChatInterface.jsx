import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useOllama } from '../../hooks/useOllama';
import MessageList from './MessageList';
import LoadingSpinner from '../common/LoadingSpinner';

const ChatInterface = () => {
  // Usar el contexto
  const { state, addMessage, startNewChat, setError } = useChat();
  const [input, setInput] = useState('');
  const { sendMessage, loading } = useOllama(state.model);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    addMessage(userMessage);
    setInput('');

    try {
      const history = state.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      history.push(userMessage);

      const response = await sendMessage(history);
      addMessage({ role: 'assistant', content: response });
    } catch (err) {
      setError(err.message || 'Error al enviar mensaje');
    }
  };

  const handleNewChat = () => {
    if (state.messages.length > 0) {
      startNewChat();
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
        {state.error && (
          <div className="text-red-500 p-4 bg-red-50 rounded-lg">
            Error: {state.error}
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