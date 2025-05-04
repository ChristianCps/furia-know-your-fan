import React from 'react';
import { FormData } from '../../types';

interface FuriaFandomProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

const FuriaFandom: React.FC<FuriaFandomProps> = ({ formData, updateFormData }) => {
  const furiaTeams = [
    'CS:GO / CS2',
    'League of Legends',
    'Valorant',
    'Rainbow Six Siege',
    'Apex Legends',
    'Free Fire'
  ];

  const handleTeamsChange = (team: string) => {
    const updatedTeams = formData.favoriteTeams?.includes(team)
      ? formData.favoriteTeams.filter(t => t !== team)
      : [...(formData.favoriteTeams || []), team];
    
    updateFormData({ favoriteTeams: updatedTeams });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-furia-white mb-6">Fã da FURIA</h2>
      
      <div className="form-group">
        <label className="block text-furia-white mb-4">Quais times da FURIA você acompanha? (Selecione todos que se aplicam)</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {furiaTeams.map(team => (
            <div key={team} className="flex items-center">
              <input
                type="checkbox"
                id={`team-${team}`}
                checked={formData.favoriteTeams?.includes(team) || false}
                onChange={() => handleTeamsChange(team)}
                className="h-5 w-5 text-furia-gold focus:ring-furia-gold rounded border-furia-gold/30 bg-black"
              />
              <label htmlFor={`team-${team}`} className="ml-2 text-furia-white">{team}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group mt-8">
        <label htmlFor="fanSince" className="block text-furia-white mb-2">Há quanto tempo você é fã da FURIA?</label>
        <select
          id="fanSince"
          name="furiaFanSince"
          value={formData.furiaFanSince || ''}
          onChange={handleChange}
          className="w-full p-3 bg-black border border-furia-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-furia-gold text-furia-white"
        >
          <option value="">Selecione o tempo</option>
          <option value="less-than-1">Menos de um ano</option>
          <option value="1-2">1-2 anos</option>
          <option value="3-5">3-5 anos</option>
          <option value="since-beginning">Desde o início (2017)</option>
        </select>
      </div>

      <div className="form-group mt-8">
        <label htmlFor="favoritePlayers" className="block text-furia-white mb-2">Quem são seus jogadores favoritos da FURIA? (Separados por vírgula)</label>
        <input
          type="text"
          id="favoritePlayers"
          name="favoritePlayers"
          value={formData.favoritePlayers || ''}
          onChange={handleChange}
          className="w-full p-3 bg-black border border-furia-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-furia-gold text-furia-white"
          placeholder="ex: arT, KSCERATO, yuurih"
        />
      </div>

      <div className="form-group mt-8">
        <label htmlFor="purchasedMerchandise" className="block text-furia-white mb-2">Você comprou produtos da FURIA nos últimos 12 meses?</label>
        <select
          id="purchasedMerchandise"
          name="purchasedMerchandise"
          value={formData.purchasedMerchandise || ''}
          onChange={handleChange}
          className="w-full p-3 bg-black border border-furia-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-furia-gold text-furia-white"
        >
          <option value="">Selecione uma opção</option>
          <option value="yes">Sim</option>
          <option value="no">Não</option>
        </select>
      </div>

      <div className="form-group mt-8">
        <label htmlFor="attendedEvents" className="block text-furia-white mb-2">Você já assistiu a alguma partida ou evento da FURIA presencialmente?</label>
        <select
          id="attendedEvents"
          name="attendedEvents"
          value={formData.attendedEvents || ''}
          onChange={handleChange}
          className="w-full p-3 bg-black border border-furia-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-furia-gold text-furia-white"
        >
          <option value="">Selecione uma opção</option>
          <option value="yes-multiple">Sim, várias vezes</option>
          <option value="yes-once">Sim, uma vez</option>
          <option value="no-plan-to">Não, mas pretendo</option>
          <option value="no">Não, nunca tive a oportunidade</option>
        </select>
      </div>

      <div className="form-group mt-8">
        <label htmlFor="whyFuria" className="block text-furia-white mb-2">Em suas palavras, por que você é fã da FURIA?</label>
        <textarea
          id="whyFuria"
          name="whyFuria"
          value={formData.whyFuria || ''}
          onChange={handleChange}
          className="w-full p-3 bg-black border border-furia-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-furia-gold text-furia-white h-32"
          placeholder="Conte-nos por que você torce pela FURIA..."
        />
      </div>
    </div>
  );
};

export default FuriaFandom;