import React from 'react';
import ChatInterface from './components/Chat/ChatInterface';
import HistoryPanel from './components/History/HistoryPanel';

function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🤖 devfSeek Chat</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-blue-500 px-3 py-1 rounded-full">
              DeepSeek R1
            </span>
            <span className="text-xs bg-green-500 px-3 py-1 rounded-full">
              ● Online
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex overflow-hidden max-w-6xl mx-auto w-full">
        <HistoryPanel />
        <div className="flex-1 bg-white">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}

export default App;