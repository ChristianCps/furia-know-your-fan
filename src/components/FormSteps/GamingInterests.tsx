import React from 'react';
import { FormData } from '../../types';

interface GamingInterestsProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

const GamingInterests: React.FC<GamingInterestsProps> = ({ formData, updateFormData }) => {
  const games = [
    'CS:GO / CS2',
    'League of Legends',
    'Valorant',
    'Dota 2',
    'Rainbow Six Siege',
    'Apex Legends',
    'FIFA / EA FC',
    'Rocket League',
    'Fortnite',
    'Overwatch',
    'PUBG',
    'Call of Duty'
  ];

  const platforms = [
    'PC',
    'PlayStation',
    'Xbox',
    'Nintendo Switch',
    'Mobile'
  ];

  const handleGamesChange = (game: string) => {
    const updatedGames = formData.favoriteGames?.includes(game)
      ? formData.favoriteGames.filter(g => g !== game)
      : [...(formData.favoriteGames || []), game];
    
    updateFormData({ favoriteGames: updatedGames });
  };

  const handlePlatformsChange = (platform: string) => {
    const updatedPlatforms = formData.gamingPlatforms?.includes(platform)
      ? formData.gamingPlatforms.filter(p => p !== platform)
      : [...(formData.gamingPlatforms || []), platform];
    
    updateFormData({ gamingPlatforms: updatedPlatforms });
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ gamingHoursWeekly: e.target.value });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-furia-white mb-6">Interesses em Games</h2>
      
      <div className="form-group">
        <label className="block text-furia-white mb-4">Quais jogos você acompanha nos esports? (Selecione todos que se aplicam)</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {games.map(game => (
            <div key={game} className="flex items-center">
              <input
                type="checkbox"
                id={`game-${game}`}
                checked={formData.favoriteGames?.includes(game) || false}
                onChange={() => handleGamesChange(game)}
                className="h-5 w-5 text-furia-gold focus:ring-furia-gold rounded border-furia-gold/30 bg-black"
              />
              <label htmlFor={`game-${game}`} className="ml-2 text-furia-white">{game}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group mt-8">
        <label className="block text-furia-white mb-4">Quais plataformas você usa? (Selecione todas que se aplicam)</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {platforms.map(platform => (
            <div key={platform} className="flex items-center">
              <input
                type="checkbox"
                id={`platform-${platform}`}
                checked={formData.gamingPlatforms?.includes(platform) || false}
                onChange={() => handlePlatformsChange(platform)}
                className="h-5 w-5 text-furia-gold focus:ring-furia-gold rounded border-furia-gold/30 bg-black"
              />
              <label htmlFor={`platform-${platform}`} className="ml-2 text-furia-white">{platform}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group mt-8">
        <label htmlFor="gamingHours" className="block text-furia-white mb-2">Quantas horas por semana você joga?</label>
        <select
          id="gamingHours"
          name="gamingHoursWeekly"
          value={formData.gamingHoursWeekly || ''}
          onChange={handleHoursChange}
          className="w-full p-3 bg-black border border-furia-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-furia-gold text-furia-white"
        >
          <option value="">Selecione as horas</option>
          <option value="0-5">0-5 horas</option>
          <option value="6-10">6-10 horas</option>
          <option value="11-20">11-20 horas</option>
          <option value="21-30">21-30 horas</option>
          <option value="30+">Mais de 30 horas</option>
        </select>
      </div>

      <div className="form-group mt-8">
        <label htmlFor="startedGaming" className="block text-furia-white mb-2">Quando você começou a acompanhar esports?</label>
        <select
          id="startedGaming"
          name="esportsSince"
          value={formData.esportsSince || ''}
          onChange={(e) => updateFormData({ esportsSince: e.target.value })}
          className="w-full p-3 bg-black border border-furia-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-furia-gold text-furia-white"
        >
          <option value="">Selecione quando</option>
          <option value="less-than-1">Menos de 1 ano atrás</option>
          <option value="1-2">1-2 anos atrás</option>
          <option value="3-5">3-5 anos atrás</option>
          <option value="6-10">6-10 anos atrás</option>
          <option value="more-than-10">Mais de 10 anos atrás</option>
        </select>
      </div>

      <div className="form-group mt-8">
        <label htmlFor="preferredWatching" className="block text-furia-white mb-2">Como você prefere assistir às partidas de esports?</label>
        <select
          id="preferredWatching"
          name="watchingPreference"
          value={formData.watchingPreference || ''}
          onChange={(e) => updateFormData({ watchingPreference: e.target.value })}
          className="w-full p-3 bg-black border border-furia-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-furia-gold text-furia-white"
        >
          <option value="">Selecione sua preferência</option>
          <option value="twitch">Twitch</option>
          <option value="youtube">YouTube</option>
          <option value="in-person">Eventos presenciais</option>
          <option value="tv">Transmissões na TV</option>
          <option value="other">Outras plataformas</option>
        </select>
      </div>
    </div>
  );
};

export default GamingInterests;