import React, { useState } from 'react';
import { FormData } from '../../types';
import { Twitter, Instagram, Twitch, Youtube, Link2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SocialMediaConnectProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

const SocialMediaConnect: React.FC<SocialMediaConnectProps> = ({ formData, updateFormData }) => {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  const socialPlatforms = [
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'text-blue-400',
      connected: formData.connectedSocials?.includes('twitter')
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'text-pink-500',
      connected: formData.connectedSocials?.includes('instagram')
    },
    {
      id: 'twitch',
      name: 'Twitch',
      icon: Twitch,
      color: 'text-purple-500',
      connected: formData.connectedSocials?.includes('twitch')
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: 'text-red-500',
      connected: formData.connectedSocials?.includes('youtube')
    }
  ];

  const handleConnect = async (platform: string) => {
    setLoading({ ...loading, [platform]: true });
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/social-auth`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          platform,
          profileId: formData.profileId 
        }),
      });

      if (!response.ok) throw new Error('Falha ao conectar rede social');

      const data = await response.json();
      
      const popup = window.open(data.authUrl, 'social-auth', 'width=600,height=600');
      
      window.addEventListener('message', async (event) => {
        if (event.data.type === 'social-auth-callback') {
          const { code, state } = event.data;
          
          const verifyResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-social-auth`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, state, platform, profileId: formData.profileId }),
          });

          if (!verifyResponse.ok) throw new Error('Falha ao verificar conexão social');

          const updatedSocials = [...(formData.connectedSocials || []), platform];
          updateFormData({ connectedSocials: updatedSocials });
        }
      });

    } catch (error) {
      console.error('Erro ao conectar rede social:', error);
      setError('Falha ao conectar rede social. Por favor, tente novamente.');
    } finally {
      setLoading({ ...loading, [platform]: false });
    }
  };

  const handleDisconnect = async (platform: string) => {
    setLoading({ ...loading, [platform]: true });
    setError(null);

    try {
      const { error } = await supabase
        .from('social_media_accounts')
        .delete()
        .match({ 
          profile_id: formData.profileId,
          platform 
        });

      if (error) throw error;

      const updatedSocials = formData.connectedSocials?.filter(s => s !== platform) || [];
      updateFormData({ connectedSocials: updatedSocials });

    } catch (error) {
      console.error('Erro ao desconectar rede social:', error);
      setError('Falha ao desconectar rede social. Por favor, tente novamente.');
    } finally {
      setLoading({ ...loading, [platform]: false });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white mb-6">Conectar Redes Sociais</h2>
      
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <p className="text-white mb-6">
          Conecte suas redes sociais para aprimorar seu perfil de Fã FURIA. Isso nos ajuda a entender seus interesses em esports e fornecer melhores recomendações.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialPlatforms.map(platform => (
            <div 
              key={platform.id}
              className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <platform.icon className={`h-6 w-6 ${platform.color}`} />
                <span className="text-white font-medium">{platform.name}</span>
              </div>
              
              <button
                onClick={() => platform.connected ? handleDisconnect(platform.id) : handleConnect(platform.id)}
                disabled={loading[platform.id]}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-300 ${
                  platform.connected
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {loading[platform.id] ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    {platform.connected ? (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        <span>Conectado</span>
                      </>
                    ) : (
                      <>
                        <Link2 className="h-5 w-5" />
                        <span>Conectar</span>
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-800 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-white text-lg mb-3">Aviso de Privacidade</h3>
          <p className="text-gray-400 text-sm">
            Ao conectar suas redes sociais, você nos autoriza a acessar suas informações públicas de perfil
            e interações relacionadas ao conteúdo de esports. Coletaremos apenas dados relevantes aos seus
            interesses em games e esports. Você pode desconectar suas contas a qualquer momento. Para mais
            detalhes, leia nossa Política de Privacidade.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaConnect;