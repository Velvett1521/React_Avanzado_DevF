import React from 'react';
import { useGlobalContext } from '../../context/GlobalContext';

const HistoryPanel = () => {
  const { state, clearChat } = useGlobalContext();

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="w-64 bg-gray-50 border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Historial</h2>
        <button
          onClick={clearChat}
          className="text-sm text-red-600 hover:text-red-800 mt-1"
        >
          Limpiar chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {state.history.length === 0 ? (
          <p className="text-gray-500 text-sm text-center mt-4">
            No hay conversaciones previas
          </p>
        ) : (
          state.history.map((item, index) => (
            <div
              key={index}
              className="p-3 mb-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <p className="text-sm font-medium truncate">
                {item.messages[0]?.content || 'Conversación'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDate(item.timestamp)}
              </p>
              <p className="text-xs text-gray-400">
                {item.messages.length} mensajes
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;