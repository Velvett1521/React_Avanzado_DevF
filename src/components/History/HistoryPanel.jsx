import React, { useState, useEffect } from 'react';
import { chatService } from '../../services/chatService';

const HistoryPanel = () => {
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    try {
      const conversations = await chatService.getConversations();
      setHistory(conversations);
    } catch (err) {
      console.error('Error cargando historial:', err);
    }
  };

  useEffect(() => {
    loadHistory();
    // Escuchar eventos de recarga
    const handleRefresh = () => loadHistory();
    window.addEventListener('refreshHistory', handleRefresh);
    return () => {
      window.removeEventListener('refreshHistory', handleRefresh);
    };
  }, []);

  const loadConversation = (conversation) => {
    window.dispatchEvent(new CustomEvent('loadConversation', {
      detail: { messages: conversation.messages }
    }));
  };

  const deleteConversation = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('¿Eliminar esta conversación?')) {
      await chatService.deleteConversation(id);
      await loadHistory();
      window.dispatchEvent(new CustomEvent('refreshHistory'));
    }
  };

  return (
    <div className="w-64 bg-gray-50 border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">📚 Historial</h2>
        <button
          onClick={loadHistory}
          className="text-xs text-blue-500 hover:text-blue-700 mt-1"
        >
          ↻ Recargar
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm text-center mt-4">
            No hay conversaciones guardadas
          </p>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              onClick={() => loadConversation(item)}
              className="p-3 mb-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative"
            >
              <p className="text-sm font-medium truncate">{item.title}</p>
              <p className="text-xs text-gray-400">{item.messages.length} mensajes</p>
              <button
                onClick={(e) => deleteConversation(item.id, e)}
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