import React from 'react';
import { GlobalProvider } from './context/GlobalContext';
import ChatInterface from './components/Chat/ChatInterface';
import HistoryPanel from './components/History/HistoryPanel';
import Header from './components/common/Header';

function App() {
  return (
    <GlobalProvider>
      <div className="h-screen flex flex-col bg-gray-100">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <HistoryPanel />
          <div className="flex-1 bg-white">
            <ChatInterface />
          </div>
        </div>
      </div>
    </GlobalProvider>
  );
}

export default App;