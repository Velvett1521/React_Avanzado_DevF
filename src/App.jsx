import React from 'react';
import { ChatProvider } from './context/ChatContext';
import ChatInterface from './components/Chat/ChatInterface';
import HistoryPanel from './components/History/HistoryPanel';
import Header from './components/common/Header';

function App() {
  return (
    // El Provider envuelve toda la aplicación
    <ChatProvider>
      <div className="h-screen flex flex-col bg-gray-100">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <HistoryPanel />
          <div className="flex-1 bg-white">
            <ChatInterface />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
}

export default App;