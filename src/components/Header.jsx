import React from 'react';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Network Security Dashboard</h1>
        <div className="flex items-center">
          <span className="mr-4">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
            Monitoring Active
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;