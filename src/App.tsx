import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MainForm from './components/MainForm';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-furia-black text-furia-white">
      <Header />
      <Hero />
      
      <div id="form-section" className="py-16 bg-furia-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Junte-se à Família FURIA</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Preencha o formulário abaixo para nos ajudar a entender o que faz de você um fã único da FURIA.
              Essas informações nos ajudarão a criar experiências e ofertas personalizadas para você.
            </p>
          </div>
          
          <MainForm />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default App;