import React from 'react';
import { useChat } from '../../context/ChatContext';

const HistoryPanel = () => {
  const { state, loadConversation, deleteConversation, startNewChat } = useChat();

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleLoadConversation = (conversation) => {
    loadConversation(conversation);
  };

  const handleDeleteConversation = (id, e) => {
    e.stopPropagation();
    if (window.confirm('¿Eliminar esta conversación?')) {
      deleteConversation(id);
    }
  };

  return (
    <div className="w-64 bg-gray-50 border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Historial</h2>
        <button
          onClick={startNewChat}
          className="text-sm text-green-600 hover:text-green-800 mt-1"
        >
          + Nueva conversación
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {state.history.length === 0 ? (
          <p className="text-gray-500 text-sm text-center mt-4">
            No hay conversaciones previas
          </p>
        ) : (
          state.history.map((item) => (
            <div
              key={item.id}
              onClick={() => handleLoadConversation(item)}
              className="p-3 mb-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative"
            >
              <p className="text-sm font-medium truncate">
                {item.title || 'Conversación'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDate(item.timestamp)}
              </p>
              <p className="text-xs text-gray-400">
                {item.messages.length} mensajes
              </p>
              <button
                onClick={(e) => handleDeleteConversation(item.id, e)}
                className="absolute top-1 right-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;