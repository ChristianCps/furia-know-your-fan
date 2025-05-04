import React from 'react';
import { Shield } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-furia-white p-6 mt-12">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <img src="https://assets.furia.gg/logos/furia-logo-white.svg" alt="FURIA Logo" className="h-8" />
            <h2 className="text-xl font-bold">FURIA <span className="text-furia-gold">Fan ID</span></h2>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div>
              <h3 className="font-semibold mb-2 text-furia-gold">Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-furia-gold transition-colors duration-300">Início</a></li>
                <li><a href="#" className="hover:text-furia-gold transition-colors duration-300">Sobre</a></li>
                <li><a href="#" className="hover:text-furia-gold transition-colors duration-300">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-furia-gold transition-colors duration-300">Termos de Serviço</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-furia-gold">Siga-nos</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-furia-gold transition-colors duration-300">Twitter</a></li>
                <li><a href="#" className="hover:text-furia-gold transition-colors duration-300">Instagram</a></li>
                <li><a href="#" className="hover:text-furia-gold transition-colors duration-300">Twitch</a></li>
                <li><a href="#" className="hover:text-furia-gold transition-colors duration-300">YouTube</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} FURIA Esports. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;