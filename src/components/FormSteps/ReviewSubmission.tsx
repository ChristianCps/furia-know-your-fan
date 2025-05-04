import React from 'react';
import { FormData } from '../../types';
import { CheckCircle } from 'lucide-react';

interface ReviewSubmissionProps {
  formData: FormData;
}

const ReviewSubmission: React.FC<ReviewSubmissionProps> = ({ formData }) => {
  const personalInfoComplete = formData.fullName && formData.email && formData.cpf;
  const gamingInterestsComplete = formData.favoriteGames && formData.favoriteGames.length > 0;
  const furiaFandomComplete = formData.favoriteTeams && formData.favoriteTeams.length > 0;
  const documentComplete = formData.documentUploaded;

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white mb-6">Revisar Informações</h2>

      <div className="bg-gray-900 rounded-xl overflow-hidden">
        {/* Personal Information Section */}
        <div className="border-b border-gray-800">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Informações Pessoais</h3>
              <div className={`flex items-center ${personalInfoComplete ? 'text-green-500' : 'text-red-500'}`}>
                {personalInfoComplete ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-1" />
                    <span>Completo</span>
                  </>
                ) : (
                  <span>Incompleto</span>
                )}
              </div>
            </div>

            {personalInfoComplete ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Nome Completo</p>
                  <p className="text-white">{formData.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">{formData.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">CPF</p>
                  <p className="text-white">{formData.cpf}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Telefone</p>
                  <p className="text-white">{formData.phone || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Endereço</p>
                  <p className="text-white">{formData.address || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Data de Nascimento</p>
                  <p className="text-white">{formData.birthDate || 'Não informado'}</p>
                </div>
              </div>
            ) : (
              <p className="text-red-300">Por favor, complete a seção de Informações Pessoais.</p>
            )}
          </div>
        </div>

        {/* Gaming Interests Section */}
        <div className="border-b border-gray-800">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Interesses em Games</h3>
              <div className={`flex items-center ${gamingInterestsComplete ? 'text-green-500' : 'text-red-500'}`}>
                {gamingInterestsComplete ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-1" />
                    <span>Completo</span>
                  </>
                ) : (
                  <span>Incompleto</span>
                )}
              </div>
            </div>

            {gamingInterestsComplete ? (
              <div>
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">Jogos Favoritos</p>
                  <p className="text-white">{formData.favoriteGames?.join(', ')}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">Plataformas</p>
                  <p className="text-white">{formData.gamingPlatforms?.join(', ') || 'Não informado'}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">Horas Semanais de Jogo</p>
                  <p className="text-white">{formData.gamingHoursWeekly || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Acompanha Esports Desde</p>
                  <p className="text-white">{formData.esportsSince || 'Não informado'}</p>
                </div>
              </div>
            ) : (
              <p className="text-red-300">Por favor, complete a seção de Interesses em Games.</p>
            )}
          </div>
        </div>

        {/* FURIA Fandom Section */}
        <div className="border-b border-gray-800">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Fã da FURIA</h3>
              <div className={`flex items-center ${furiaFandomComplete ? 'text-green-500' : 'text-red-500'}`}>
                {furiaFandomComplete ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-1" />
                    <span>Completo</span>
                  </>
                ) : (
                  <span>Incompleto</span>
                )}
              </div>
            </div>

            {furiaFandomComplete ? (
              <div>
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">Times Favoritos da FURIA</p>
                  <p className="text-white">{formData.favoriteTeams?.join(', ')}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">Fã da FURIA Desde</p>
                  <p className="text-white">{formData.furiaFanSince || 'Não informado'}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">Jogadores Favoritos</p>
                  <p className="text-white">{formData.favoritePlayers || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Eventos Presenciais</p>
                  <p className="text-white">{formData.attendedEvents || 'Não informado'}</p>
                </div>
              </div>
            ) : (
              <p className="text-red-300">Por favor, complete a seção Fã da FURIA.</p>
            )}
          </div>
        </div>

        {/* Document Upload Section */}
        <div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Verificação de Documento</h3>
              <div className={`flex items-center ${documentComplete ? 'text-green-500' : 'text-red-500'}`}>
                {documentComplete ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-1" />
                    <span>Completo</span>
                  </>
                ) : (
                  <span>Incompleto</span>
                )}
              </div>
            </div>

            {documentComplete ? (
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Documento Enviado</p>
                  <p className="text-white">{formData.documentName}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-2">Status da Verificação</p>
                  <div className={`flex items-center gap-2 ${
                    formData.documentStatus === 'verified' ? 'text-green-500' :
                    formData.documentStatus === 'failed' ? 'text-red-500' :
                    'text-yellow-500'
                  }`}>
                    <CheckCircle className="w-5 h-5" />
                    <span className="capitalize">
                      {formData.documentStatus === 'verified' ? 'Verificado' :
                       formData.documentStatus === 'failed' ? 'Falhou' :
                       'Pendente'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-red-300">Por favor, envie seu documento de identificação.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmission;