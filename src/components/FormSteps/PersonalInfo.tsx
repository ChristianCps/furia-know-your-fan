import React, { useState } from 'react';
import { FormData } from '../../types';
import { Loader2, Gamepad2 } from 'lucide-react';

interface PersonalInfoProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

const brazilianStates = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
];

const PersonalInfo: React.FC<PersonalInfoProps> = ({ formData, updateFormData }) => {
  const [loading, setLoading] = useState(false);
  const [cepFilled, setCepFilled] = useState(false);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/g, '($1)$2-$3');
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/g, '$1-$2');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    switch (name) {
      case 'cpf':
        formattedValue = formatCPF(value);
        break;
      case 'phone':
        formattedValue = formatPhone(value);
        break;
      case 'zipCode':
        formattedValue = formatCEP(value);
        if (formattedValue.length === 9) {
          searchCEP(formattedValue);
        }
        break;
    }

    updateFormData({ [name]: formattedValue });
  };

  const searchCEP = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length !== 8) return;

    setLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();

      if (!data.erro) {
        updateFormData({
          address: data.logradouro,
          city: data.localidade,
          state: data.uf,
          neighborhood: data.bairro
        });
        setCepFilled(true);
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3 mb-8">
        <Gamepad2 className="h-12 w-12 text-furia-gold" />
        <h2 className="text-2xl font-bold text-furia-white">Informações Pessoais</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label htmlFor="fullName" className="block text-furia-white mb-2">
            Nome Completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName || ''}
            onChange={handleChange}
            className="w-full p-3 bg-black border border-furia-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-furia-gold text-furia-white"
            placeholder="Seu nome completo"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="block text-furia-white mb-2">
            E-mail <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className="w-full p-3 bg-black border border-furia-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-furia-gold text-furia-white"
            placeholder="seu.email@exemplo.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cpf" className="block text-furia-white mb-2">
            CPF <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            value={formData.cpf || ''}
            onChange={handleChange}
            maxLength={14}
            className="w-full p-3 bg-black border border-furia-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-furia-gold text-furia-white"
            placeholder="000.000.000-00"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="birthDate" className="block text-furia-white mb-2">
            Data de Nascimento <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate || ''}
            onChange={handleChange}
            className="w-full p-3 bg-black border border-furia-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-furia-gold text-furia-white"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="block text-furia-white mb-2">Telefone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            maxLength={14}
            className="w-full p-3 bg-black border border-furia-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-furia-gold text-furia-white"
            placeholder="(00)00000-0000"
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender" className="block text-furia-white mb-2">
            Gênero <span className="text-red-500">*</span>
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender || ''}
            onChange={handleChange}
            className="w-full p-3 bg-black border border-furia-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-furia-gold text-furia-white"
            required
          >
            <option value="">Selecione o gênero</option>
            <option value="male">Masculino</option>
            <option value="female">Feminino</option>
            <option value="non-binary">Não-binário</option>
            <option value="prefer-not-to-say">Prefiro não dizer</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        <div className="form-group relative">
          <label htmlFor="zipCode" className="block text-furia-white mb-2">
            CEP <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode || ''}
              onChange={handleChange}
              maxLength={9}
              className="w-full p-3 bg-black border border-furia-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-furia-gold text-furia-white"
              placeholder="00000-000"
              required
            />
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-5 w-5 text-furia-gold animate-spin" />
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address" className="block text-furia-white mb-2">Endereço</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            className="w-full p-3 bg-black border border-furia-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-furia-gold text-furia-white"
            placeholder="Rua, número, bairro"
            readOnly={cepFilled}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="city" className="block text-furia-white mb-2">Cidade</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city || ''}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-furia-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-furia-gold text-furia-white"
              placeholder="Sua cidade"
              readOnly={cepFilled}
            />
          </div>

          <div className="form-group">
            <label htmlFor="state" className="block text-furia-white mb-2">Estado</label>
            <select
              id="state"
              name="state"
              value={formData.state || ''}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-furia-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-furia-gold text-furia-white"
              disabled={cepFilled}
            >
              <option value="">Selecione o estado</option>
              {brazilianStates.map(state => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-furia-gold/20">
        <p className="text-sm text-gray-300">
          Junte-se à família FURIA! Seus dados serão usados para melhorar sua experiência como fã e 
          garantir que você não perca nenhuma novidade ou evento especial.
        </p>
      </div>
    </div>
  );
};

export default PersonalInfo;