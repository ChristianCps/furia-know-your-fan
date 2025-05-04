FURIA Fan ID
FURIA Fan ID é uma aplicação web desenvolvida para coletar e gerenciar informações de fãs da FURIA Esports. A plataforma permite que fãs criem perfis, compartilhem seus interesses em jogos e se conectem com a comunidade da FURIA.

Funcionalidades
Gerenciamento de Informações Pessoais: Coleta de informações básicas e dados de contato dos usuários

Interesses em Jogos: Registro de jogos favoritos, plataformas utilizadas e preferências de visualização de esports

Fandom da FURIA: Coleta de informações sobre a conexão dos fãs com os times e jogadores da FURIA

Envio de Documentos: Funcionalidade básica de upload de documentos (apenas simulação de verificação)

Integração com Redes Sociais: Suporte a conexões OAuth com diversas plataformas (em desenvolvimento)

Tecnologias Utilizadas
React 18

TypeScript

Vite

Tailwind CSS

Supabase (Banco de Dados & Armazenamento)

Lucide React (Ícones)

Pré-requisitos
Node.js 18 ou superior

npm ou yarn

Conta no Supabase

Primeiros Passos
1.Clone o repositório:

2.Instale as dependências:
bash
   npm install

3.Configure as variáveis de ambiente:
Crie um arquivo .env na raiz do projeto com suas credenciais do Supabase:
   VITE_SUPABASE_URL=sua_url_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_supabase

4.Inicie o servidor de desenvolvimento:
bash
   npm run dev

Estrutura do Projeto
├── src/
│   ├── components/     # Componentes React
│   ├── lib/            # Funções utilitárias e configurações
│   ├── types/          # Definições de tipos TypeScript
│   └── App.tsx         # Componente principal da aplicação
├── public/             # Arquivos estáticos
└── supabase/
    ├── functions/      # Funções Edge
    └── migrations/     # Migrações do banco de dados

Observações Importantes
Verificação de Documentos: O sistema de verificação de documentos é atualmente uma simulação e não realiza validações reais

Integração com Redes Sociais: As conexões OAuth estão implementadas, mas ainda não funcionam completamente. No momento, o sistema apenas demonstra o fluxo de conexão, sem buscar dados reais

Armazenamento de Dados: Todos os dados dos usuários são armazenados no Supabase, com políticas de segurança adequadas

Esquema do Banco de Dados
A aplicação utiliza as seguintes tabelas principais:

fan_profiles: Informações básicas do usuário

gaming_interests: Preferências e histórico de jogos

furia_fandom: Informações específicas sobre a FURIA

documents: Registros de upload de documentos

social_media_accounts: Registros de conexões com redes sociais

Agradecimentos
FURIA Esports pela inspiração

Supabase pela infraestrutura de backend

Comunidades do React e Vite