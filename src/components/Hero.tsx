import React from 'react';
import { Gamepad2 } from 'lucide-react';

const Hero: React.FC = () => {
  const openSocialLinks = () => {
    window.open('https://twitter.com/FURIA', '_blank');
    window.open('https://www.instagram.com/furiagg/', '_blank');
    window.open('https://www.furia.gg/', '_blank');
  };

  return (
    <div className="relative overflow-hidden bg-black py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-furia-gold/30 z-10"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ 
          backgroundImage: 'url(https://images.pexels.com/photos/7915357/pexels-photo-7915357.jpeg?auto=compress&cs=tinysrgb&w=1600)', 
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      ></div>
      
      <div className="relative z-20 max-w-7xl mx-auto px-4">
        <div className="text-center">
          <div className="inline-block p-2 bg-furia-gold/20 rounded-full mb-4">
            <Gamepad2 className="h-8 w-8 text-furia-gold" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-furia-white mb-6">
            Conheça o Fã da <span className="text-furia-gold">FURIA</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Ajude-nos a criar a melhor experiência de esports compartilhando sua jornada com a FURIA.
          </p>
          <div className="max-w-md mx-auto bg-black/80 backdrop-blur p-6 rounded-xl border border-furia-gold/20">
            <p className="text-gray-300 mb-4">
              Estamos coletando informações para oferecer experiências exclusivas, produtos e conteúdo personalizado para você como fã da FURIA.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => window.scrollTo({ top: document.getElementById('form-section')?.offsetTop - 100, behavior: 'smooth' })}
                className="px-6 py-3 bg-furia-gold hover:bg-furia-gold/80 text-black rounded-lg transition-colors duration-300 font-medium"
              >
                Começar
              </button>
              <button 
                onClick={openSocialLinks}
                className="px-6 py-3 bg-transparent border border-furia-gold/50 hover:border-furia-gold text-furia-white rounded-lg transition-colors duration-300 font-medium"
              >
                Siga a FURIA
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-2 bg-gradient-to-r from-black via-furia-gold to-black animate-pulse"></div>
    </div>
  );
};

export default Hero;