import React, { useState } from 'react';
import PersonalInfo from './FormSteps/PersonalInfo';
import GamingInterests from './FormSteps/GamingInterests';
import FuriaFandom from './FormSteps/FuriaFandom';
import DocumentUpload from './FormSteps/DocumentUpload';
import SocialMediaConnect from './FormSteps/SocialMediaConnect';
import ReviewSubmission from './FormSteps/ReviewSubmission';
import ProgressBar from './ProgressBar';
import { FormData } from '../types';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

const MainForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    cpf: '',
    birthDate: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    favoriteGames: [],
    gamingPlatforms: [],
    gamingHoursWeekly: '',
    esportsSince: '',
    watchingPreference: '',
    favoriteTeams: [],
    furiaFanSince: '',
    favoritePlayers: '',
    purchasedMerchandise: '',
    attendedEvents: '',
    whyFuria: '',
    documentUploaded: false,
    documentName: '',
    connectedSocials: [],
  });

  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const totalSteps = 6;

  const createInitialProfile = async () => {
    try {
      // Check if profile already exists with this CPF
      const { data: existingProfile, error: searchError } = await supabase
        .from('fan_profiles')
        .select('id')
        .eq('cpf', formData.cpf)
        .single();

      if (searchError && searchError.code !== 'PGRST116') {
        throw searchError;
      }

      if (existingProfile) {
        updateFormData({ profileId: existingProfile.id });
        return existingProfile.id;
      }

      // Create new profile
      const { data: profile, error: insertError } = await supabase
        .from('fan_profiles')
        .insert({
          email: formData.email,
          full_name: formData.fullName,
          cpf: formData.cpf,
          birth_date: formData.birthDate,
          phone: formData.phone || null,
          gender: formData.gender,
          address: formData.address || null,
          city: formData.city || null,
          state: formData.state || null,
          zip_code: formData.zipCode || null
        })
        .select()
        .single();

      if (insertError) throw insertError;

      updateFormData({ profileId: profile.id });
      return profile.id;

    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  };

  const nextStep = async () => {
    if (currentStep === 0) {
      try {
        await createInitialProfile();
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      } catch (error) {
        alert('Erro ao criar perfil. Por favor, verifique os dados e tente novamente.');
      }
    } else if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const sendConfirmationEmail = async () => {
    try {
      setEmailError(null);
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-confirmation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.fullName,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar email de confirmação');
      }

      return true;
    } catch (error: any) {
      console.error('Erro ao enviar email de confirmação:', error);
      setEmailError(error.message);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !termsAccepted) return;
    
    setIsSubmitting(true);
    try {
      // Ensure we have a profile ID
      const profileId = formData.profileId || await createInitialProfile();
      
      if (!profileId) {
        throw new Error('Falha ao criar ou recuperar perfil');
      }

      // Insert gaming interests
      const { error: gamingError } = await supabase
        .from('gaming_interests')
        .insert({
          profile_id: profileId,
          favorite_games: formData.favoriteGames,
          gaming_platforms: formData.gamingPlatforms,
          gaming_hours_weekly: formData.gamingHoursWeekly,
          esports_since: formData.esportsSince,
          watching_preference: formData.watchingPreference
        });

      if (gamingError) throw gamingError;

      // Insert FURIA fandom data
      const { error: furiaError } = await supabase
        .from('furia_fandom')
        .insert({
          profile_id: profileId,
          favorite_teams: formData.favoriteTeams,
          fan_since: formData.furiaFanSince,
          favorite_players: formData.favoritePlayers,
          purchased_merchandise: formData.purchasedMerchandise,
          attended_events: formData.attendedEvents,
          why_furia: formData.whyFuria
        });

      if (furiaError) throw furiaError;

      const emailSent = await sendConfirmationEmail();
      
      if (emailSent) {
        setSubmissionComplete(true);
        let timeLeft = 5;
        const timer = setInterval(() => {
          timeLeft -= 1;
          setCountdown(timeLeft);
          
          if (timeLeft === 0) {
            clearInterval(timer);
            window.close();
          }
        }, 1000);
      }

    } catch (error: any) {
      console.error('Erro ao enviar formulário:', error);
      alert('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    if (submissionComplete) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-white mb-4">Obrigado pela participação!</h2>
          <p className="text-gray-300 mb-4">
            Seu cadastro foi realizado com sucesso. Um email de confirmação foi enviado para {formData.email}.
          </p>
          <p className="text-sm text-gray-400">
            Esta página será fechada automaticamente em {countdown} segundos.
          </p>
        </div>
      );
    }

    switch (currentStep) {
      case 0:
        return <PersonalInfo formData={formData} updateFormData={updateFormData} />;
      case 1:
        return <GamingInterests formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <FuriaFandom formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <DocumentUpload formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <SocialMediaConnect formData={formData} updateFormData={updateFormData} />;
      case 5:
        return (
          <>
            <ReviewSubmission formData={formData} />
            <div className="mt-8 p-6 bg-gray-900 rounded-xl border border-gray-800">
              <h3 className="font-semibold text-white mb-4">Termos e Condições</h3>
              <div className="flex items-start mb-6">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="h-5 w-5 text-red-600 focus:ring-red-500 rounded border-gray-700 bg-gray-800 mt-1"
                />
                <label htmlFor="terms" className="ml-3 text-gray-300 text-sm">
                  Aceito os Termos de Serviço e a Política de Privacidade. Entendo que meus dados pessoais serão processados conforme descrito na Política de Privacidade.
                </label>
              </div>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="marketing"
                  checked={marketingAccepted}
                  onChange={(e) => setMarketingAccepted(e.target.checked)}
                  className="h-5 w-5 text-red-600 focus:ring-red-500 rounded border-gray-700 bg-gray-800 mt-1"
                />
                <label htmlFor="marketing" className="ml-3 text-gray-300 text-sm">
                  Concordo em receber comunicações de marketing da FURIA Esports sobre novos produtos, eventos e ofertas exclusivas. Você pode cancelar a inscrição a qualquer momento.
                </label>
              </div>
            </div>
          </>
        );
      default:
        return <PersonalInfo formData={formData} updateFormData={updateFormData} />;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!(formData.fullName && formData.email && formData.cpf && formData.birthDate && 
                 formData.gender && formData.zipCode);
      case 1:
        return formData.favoriteGames && formData.favoriteGames.length > 0;
      case 2:
        return formData.favoriteTeams && formData.favoriteTeams.length > 0;
      case 3:
        return formData.documentUploaded;
      case 4:
        return true;
      case 5:
        return termsAccepted;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      
      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-6 shadow-xl">
        {renderStep()}
        
        {emailError && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            <p>Erro ao enviar email de confirmação: {emailError}</p>
            <p className="text-sm mt-2">Por favor, tente novamente ou entre em contato com o suporte.</p>
          </div>
        )}

        <div className="flex justify-between mt-10">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
              Voltar
            </button>
          ) : (
            <div></div>
          )}
          
          {currentStep < totalSteps - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors duration-300 ${
                canProceed()
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              Próximo
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || !termsAccepted}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors duration-300 ${
                isSubmitting || !termsAccepted
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar'}
              <Send className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MainForm;