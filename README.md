# Financify Easy Track

Sistema de gerenciamento financeiro pessoal com suporte a múltiplas contas, cartões de crédito, investimentos e metas financeiras.

## Sobre o Projeto

O Financify Easy Track é uma aplicação web completa para gerenciamento financeiro pessoal, desenvolvida com o objetivo de simplificar o controle de finanças e ajudar os usuários a alcançarem suas metas financeiras.

### Funcionalidades Principais

- **Gerenciamento de Contas**: Cadastro e controle de contas bancárias, incluindo saldos e movimentações
- **Controle de Transações**: Registro detalhado de receitas e despesas, com categorização e filtros
- **Cartões de Crédito**: Acompanhamento de faturas, limites e gastos por cartão
- **Metas Financeiras**: Definição e acompanhamento de objetivos financeiros
- **Investimentos**: Registro e monitoramento de investimentos
- **Categorias Personalizadas**: Criação e gerenciamento de categorias para melhor organização
- **Dashboard Intuitivo**: Visualização clara e organizada das finanças.

### Tecnologias Utilizadas

- **Frontend**:
  - React com TypeScript
  - Vite para build e desenvolvimento
  - Context API para gerenciamento de estado
  - Material-UI para interface

- **Backend**:
  - Node.js com Express
  - MariaDB como banco de dados
  - JWT para autenticação
  - RESTful API

### Objetivos

- Fornecer uma interface intuitiva e fácil de usar
- Permitir controle total das finanças pessoais
- Ajudar na organização e planejamento financeiro
- Facilitar o acompanhamento de metas e investimentos
- Proporcionar insights sobre hábitos financeiros

### Público-Alvo

- Pessoas que desejam ter maior controle sobre suas finanças
- Usuários que precisam organizar receitas e despesas
- Investidores que querem acompanhar seus investimentos
- Pessoas com metas financeiras específicas

## Estrutura do Projeto

```
financify-easy-track/
├── backend/                    # Diretório do backend
│   ├── config/                 # Configurações do backend
│   │   ├── database.js         # Configuração do banco de dados MariaDB
│   │   └── auth.js             # Configuração de autenticação JWT
│   ├── middleware/             # Middlewares do Express
│   │   └── auth.js             # Middleware de autenticação
│   ├── routes/                 # Rotas da API
│   │   ├── accounts.js         # Rotas de contas
│   │   ├── categories.js       # Rotas de categorias
│   │   ├── credit-cards.js     # Rotas de cartões de crédito
│   │   ├── goals.js            # Rotas de metas
│   │   ├── investments.js      # Rotas de investimentos
│   │   ├── transactions.js     # Rotas de transações
│   │   └── users.js            # Rotas de usuários
│   ├── app.js                  # Configuração principal do Express
│   └── server.js               # Ponto de entrada do servidor
│
├── src/                        # Diretório do frontend
│   ├── components/             # Componentes React
│   │   ├── accounts/           # Componentes relacionados a contas
│   │   ├── categories/         # Componentes relacionados a categorias
│   │   ├── credit-cards/       # Componentes relacionados a cartões
│   │   ├── goals/              # Componentes relacionados a metas
│   │   ├── investments/        # Componentes relacionados a investimentos
│   │   ├── transactions/       # Componentes relacionados a transações
│   │   └── ui/                 # Componentes de interface genéricos
│   ├── context/                # Contextos React
│   │   └── FinanceContext.tsx  # Contexto global de finanças
│   ├── pages/                  # Páginas da aplicação
│   │   ├── AccountsPage.tsx    # Página de contas
│   │   ├── CategoriesPage.tsx  # Página de categorias
│   │   ├── CreditCardsPage.tsx # Página de cartões
│   │   ├── DashboardPage.tsx   # Página inicial
│   │   ├── GoalsPage.tsx       # Página de metas
│   │   ├── InvestmentsPage.tsx # Página de investimentos
│   │   └── TransactionsPage.tsx# Página de transações
│   ├── services/               # Serviços de API
│   │   ├── AccountService.ts   # Serviço de contas
│   │   ├── CategoryService.ts  # Serviço de categorias
│   │   ├── CreditCardService.ts# Serviço de cartões
│   │   ├── GoalService.ts      # Serviço de metas
│   │   ├── InvestmentService.ts# Serviço de investimentos
│   │   ├── TransactionService.ts# Serviço de transações
│   │   └── UserService.ts      # Serviço de usuários
│   ├── types/                  # Definições de tipos TypeScript
│   │   └── index.ts            # Tipos globais
│   ├── App.tsx                 # Componente principal
│   └── main.tsx                # Ponto de entrada do frontend
│
├── financify-backend.service   # Arquivo de serviço do backend
├── financify-frontend.service  # Arquivo de serviço do frontend
└── README.md                   # Documentação do projeto
```

### Descrição dos Componentes Principais

#### Backend

- **config/**
  - `database.js`: Configuração da conexão com o banco de dados MariaDB
  - `auth.js`: Configuração do JWT para autenticação

- **middleware/**
  - `auth.js`: Middleware para verificação de tokens JWT

- **routes/**
  - `accounts.js`: API para gerenciamento de contas bancárias
  - `categories.js`: API para gerenciamento de categorias
  - `credit-cards.js`: API para gerenciamento de cartões de crédito
  - `goals.js`: API para gerenciamento de metas financeiras
  - `investments.js`: API para gerenciamento de investimentos
  - `transactions.js`: API para gerenciamento de transações
  - `users.js`: API para gerenciamento de usuários

#### Frontend

- **components/**
  - Componentes React reutilizáveis organizados por funcionalidade
  - Cada subdiretório contém componentes específicos de sua área

- **context/**
  - `FinanceContext.tsx`: Contexto global para gerenciamento de estado

- **pages/**
  - Páginas principais da aplicação, cada uma responsável por uma funcionalidade específica

- **services/**
  - Serviços para comunicação com a API do backend
  - Cada serviço corresponde a uma entidade do sistema

- **types/**
  - Definições de tipos TypeScript para tipagem estática


## 🐳 Executando com Docker Compose

### Pré-requisitos
- Docker instalado
- Docker Compose instalado

### Passos para Execução

1. Clone o repositório:
```bash
git clone https://github.com/Geraldojnjr/FinanciFy.git
cd financify
```

2. Configure as variáveis de ambiente:
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
nano .env
```

3. Construa e inicie os containers:
```bash
# Construir as imagens
docker-compose build

# Iniciar os serviços
docker-compose up -d
```

4. Verifique se os serviços estão rodando:
```bash
docker-compose ps
```

### Acessando a Aplicação

- Frontend: http://localhost:8090
- Backend API: http://localhost:3000
- MariaDB: localhost:3306

### Comandos Úteis

```bash
# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mariadb

# Parar todos os serviços
docker-compose down

# Reconstruir e reiniciar um serviço específico
docker-compose up -d --build frontend
docker-compose up -d --build backend

# Acessar o shell de um container
docker-compose exec frontend sh
docker-compose exec backend sh
docker-compose exec mariadb sh
```

### Solução de Problemas

1. Se encontrar problemas de permissão:
```bash
sudo chown -R $USER:$USER .
```

2. Para limpar todos os containers e volumes:
```bash
docker-compose down -v
```

3. Para reconstruir tudo do zero:
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

4. Se precisar reiniciar o banco de dados:
```bash
docker-compose restart mariadb
```

5. Para verificar os logs de erro:
```bash
docker-compose logs --tail=100 -f
```

### Estrutura do Docker Compose

O arquivo `docker-compose.yml` configura três serviços principais:

1. **Frontend**:
   - Porta: 8090
   - Build: Dockerfile.frontend
   - Dependências: backend

2. **Backend**:
   - Porta: 3000
   - Build: Dockerfile
   - Dependências: mariadb

3. **MariaDB**:
   - Porta: 3306
   - Volume: mariadb_data
   - Variáveis de ambiente configuráveis

### Manutenção

1. Para atualizar o código:
```bash
git pull
docker-compose up -d --build
```

2. Para fazer backup do banco de dados:
```bash
docker-compose exec mariadb sh -c 'mysqldump -u root -p financify > /backup/financify_$(date +%Y%m%d).sql'
```

3. Para restaurar um backup:
```bash
docker-compose exec mariadb sh -c 'mysql -u root -p financify < /backup/seu_backup.sql'
```

### Notas Importantes

1. **Segurança**:
   - Nunca exponha as portas do MariaDB para fora do ambiente Docker
   - Mantenha as senhas seguras no arquivo .env
   - Não comite o arquivo .env no repositório

2. **Performance**:
   - Os containers são configurados com limites de memória e CPU
   - O MariaDB usa um volume persistente para os dados
   - O frontend e backend são otimizados para produção

3. **Desenvolvimento**:
   - Para desenvolvimento, use `docker-compose -f docker-compose.dev.yml up -d`
   - Os volumes são montados para hot-reload
   - Os logs são mais detalhados em modo desenvolvimento
