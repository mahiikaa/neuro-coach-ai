
import React from 'react';
import { View } from '../types';
import { BrainIcon, ChartIcon } from './icons';

interface HeaderProps {
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ setView }) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-20 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setView('selection')}>
            <BrainIcon className="h-8 w-8 text-indigo-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-800 tracking-tight">Neuro-Coach AI</h1>
          </div>
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setView('selection')}
              className="px-4 py-2 rounded-md text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
            >
              Scenarios
            </button>
            <button
              onClick={() => setView('dashboard')}
              className="flex items-center px-4 py-2 rounded-md text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
            >
              <ChartIcon className="h-5 w-5 mr-1.5" />
              Dashboard
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
