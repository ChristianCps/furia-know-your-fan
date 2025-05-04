import React from 'react';
import { Gamepad2 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-black p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Gamepad2 className="text-furia-gold h-8 w-8" />
          <h1 className="text-furia-white text-2xl font-bold">FURIA <span className="text-furia-gold">Fan ID</span></h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#" className="text-furia-white hover:text-furia-gold transition-colors duration-300">Início</a></li>
            <li><a href="https://www.furia.gg" target="_blank" rel="noopener noreferrer" className="text-furia-white hover:text-furia-gold transition-colors duration-300">Loja FURIA</a></li>
            <li><a href="#" className="text-furia-white hover:text-furia-gold transition-colors duration-300">Contato</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;