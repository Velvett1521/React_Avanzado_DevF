// frontend/src/components/common/Header.jsx
import React from 'react';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
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
  );
};

export default Header;