import React from 'react';
import { Search, Bell } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between mb-8">
      {/* Search Bar */}
      <div className="flex-1 max-w-lg">
        <div className="flex items-center px-4 py-3 rounded-xl h-12 w-full shadow-neu-pressed border border-white/5 bg-bg-dark">
          <Search className="text-text-sub mr-3" size={20} />
          <input 
            className="bg-transparent border-none w-full text-sm font-medium text-text-main placeholder-text-sub focus:ring-0 focus:outline-none h-full" 
            placeholder="Tìm kiếm dự án..." 
            type="text" 
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <button className="w-12 h-12 flex items-center justify-center rounded-full text-text-main relative shadow-neu-btn border border-white/5 hover:text-primary transition-colors">
          <Bell size={20} />
          <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border border-bg-dark"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;