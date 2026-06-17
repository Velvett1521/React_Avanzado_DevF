import React from 'react';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">🤖 devfSeek Chat</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm bg-blue-500 px-3 py-1 rounded-full">
            DeepSeek R1
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;