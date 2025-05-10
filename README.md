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

## Configuração de Inicialização Automática no Linux

Para configurar o Financify Easy Track para iniciar automaticamente no Linux, siga os passos abaixo:

### 1. Criar os arquivos de serviço

Crie o arquivo `financify-backend.service` na raiz do projeto:

#### financify-backend.service
```ini
[Unit]
Description=Financify Easy Track Backend Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/financify-easy-track
ExecStartPre=/usr/bin/npm install
ExecStartPre=/usr/bin/npm run build
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=financify-backend

[Install]
WantedBy=multi-user.target 
```

### 2. Copiar os arquivos de serviço para o systemd

Execute os seguintes comandos como root:

```bash
# Copiar os arquivos de serviço para o diretório do systemd
sudo cp financify-backend.service /etc/systemd/system/

# Recarregar os serviços do systemd
sudo systemctl daemon-reload

# Habilitar os serviços para iniciar na inicialização
sudo systemctl enable financify-backend.service

# Iniciar os serviços
sudo systemctl start financify-backend.service
```

### 3. Verificar o status dos serviços

Para verificar se os serviços estão rodando corretamente:

```bash
# Verificar status
sudo systemctl status financify-backend.service

# Verificar logs
sudo journalctl -u financify-backend.service
```

### 4. Comandos úteis para gerenciamento

```bash
# Iniciar serviços
sudo systemctl start financify-backend.service

# Parar serviços
sudo systemctl stop financify-backend.service

# Reiniciar serviços
sudo systemctl restart financify-backend.service

# Desabilitar inicialização automática
sudo systemctl disable financify-backend.service
```

### 5. Solução de problemas

Se os serviços não iniciarem corretamente:

1. Verifique os logs:
```bash
sudo journalctl -u financify-backend.service -n 50
```

2. Verifique se os arquivos de serviço foram copiados corretamente:
```bash
ls -l /etc/systemd/system/financify-*.service
```

3. Verifique se o Node.js e npm estão instalados e acessíveis:
```bash
which node
which npm
```

4. Verifique se as portas necessárias estão disponíveis:
```bash
netstat -tulpn | grep -E '8080'
```

### Observações importantes

- Os serviços estão configurados para executar como root
- O frontend inicia após o backend para garantir que a API esteja disponível
- Os serviços reiniciam automaticamente se falharem
- Os logs são registrados no syslog do sistema

## Compilação e Execução do Projeto

### Compilação

1. Acesse o diretório do projeto:
```bash
cd /root/financify-easy-track
```

2. Instale as dependências (se necessário):
```bash
npm install
```

3. Compile o frontend:
```bash
npm run build
```

### Execução

1. Inicie o serviço:
```bash
systemctl start financify-backend
```

2. Verifique o status:
```bash
systemctl status financify-backend
```

### Atualização

Quando precisar atualizar o sistema:

1. Atualize o código:
```bash
cd /root/financify-easy-track
git pull
```

2. Recompile o frontend:
```bash
npm run build
```

3. Reinicie o serviço:
```bash
systemctl restart financify-backend
```

### Solução de Problemas na Compilação

Se encontrar problemas durante a compilação:

1. Erro de dependências faltantes:
```bash
# Reinstale as dependências
npm install
```

2. Erro ao compilar o frontend:
```bash
# Limpe a pasta dist (se existir)
rm -rf dist

# Recompile
npm run build
```

3. Erro "ENOENT: no such file or directory, stat '/root/financify-easy-track/dist/index.html'":
```bash
# Recompile o frontend
npm run build

# Reinicie o serviço
systemctl restart financify-backend
```

## Configuração HTTPS

### Pré-requisitos
- Nginx instalado
- Domínio configurado apontando para o servidor
- Certbot instalado
- Portas 80 e 443 liberadas no firewall

### 1. Instalação do Certbot
```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
```

### 2. Configuração do Nginx
1. Crie o arquivo de configuração:
```bash
sudo nano /etc/nginx/sites-available/financify
```

2. Adicione a seguinte configuração:
```nginx
server {
    listen 8443 ssl;
    server_name seu.dominio.com;

    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/seu.dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu.dominio.com/privkey.pem;

    # Configurações SSL básicas
    ssl_protocols TLSv1.2 TLSv1.3;

    location / {
        # Configurações CORS
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
        add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;

        # Configuração para preflight requests
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }

        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Configurações WebSocket
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Configuração favicon.ico
    location = /favicon.ico {
        access_log off;
        log_not_found off;
        return 204;
    }
}
```

3. Crie o link simbólico:
```bash
sudo ln -s /etc/nginx/sites-available/financify /etc/nginx/sites-enabled/
```

### 3. Obtenção dos Certificados SSL

1. Pare temporariamente o nginx:
```bash
sudo systemctl stop nginx
```

2. Obtenha os certificados:
```bash
sudo certbot certonly --standalone -d seu.dominio.com
```

3. Inicie o nginx:
```bash
sudo systemctl start nginx
```

### 4. Configuração da Renovação Automática

1. Teste a renovação automática:
```bash
sudo certbot renew --dry-run
```

2. Configure o crontab:
```bash
sudo crontab -e
```

3. Adicione estas linhas:
```bash
# Renovar certificados todo dia às 3:30
30 3 * * * /usr/bin/certbot renew --quiet

# Reiniciar nginx após a renovação (às 3:35)
35 3 * * * /usr/bin/systemctl restart nginx
```

### Solução de Problemas Comuns

#### 1. Erro: "address already in use"
**Problema**: Porta já está em uso
**Solução**: 
```bash
# Verifique quais processos estão usando a porta
sudo netstat -tulpn | grep '8443\|8080'

# Pare o serviço que está usando a porta
sudo systemctl stop [nome-do-servico]
```

#### 2. Erro: "SSL_CTX_use_PrivateKey_file" ou certificados não encontrados
**Problema**: Certificados SSL não encontrados ou com permissões incorretas
**Solução**:
```bash
# Verifique se os certificados existem
ls -l /etc/letsencrypt/live/seu.dominio.com/

# Regenere os certificados se necessário
sudo certbot delete --cert-name seu.dominio.com
sudo certbot certonly --standalone -d seu.dominio.com
```

#### 3. Erro: "Bad Request" ou problemas de CORS
**Problema**: Configuração CORS incorreta
**Solução**: Verifique se os headers CORS estão configurados corretamente no bloco `location` do nginx

#### 4. Erro: "Connection refused" ou timeout
**Problema**: Firewall bloqueando conexões
**Solução**:
```bash
# Verifique o status do firewall
sudo ufw status

# Permita as portas necessárias
sudo ufw allow 8443
sudo ufw allow 8080
```

### Verificação da Configuração

1. Teste a configuração do nginx:
```bash
sudo nginx -t
```

2. Verifique o status do serviço:
```bash
sudo systemctl status nginx
```

3. Monitore os logs:
```bash
sudo tail -f /var/log/nginx/error.log
```

### Notas Importantes

1. **Segurança**:
   - Mantenha o sistema e o nginx atualizados
   - Configure corretamente as permissões dos arquivos
   - Use senhas fortes e restrinja o acesso quando necessário

2. **Manutenção**:
   - Monitore a validade dos certificados
   - Verifique regularmente os logs
   - Mantenha backups das configurações

3. **Performance**:
   - Ajuste os timeouts conforme necessário
   - Configure cache quando apropriado
   - Monitore o uso de recursos

4. **Compatibilidade**:
   - Teste em diferentes navegadores
   - Verifique a compatibilidade com dispositivos móveis
   - Mantenha suporte a versões antigas do TLS se necessário

## Configuração do Ambiente

### Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para configurações sensíveis. Siga estes passos para configurar:

1. Crie um arquivo `.env` na raiz do projeto
2. Copie o conteúdo do arquivo `.env.example` (se existir) ou use o template abaixo:

```env
# Configurações do Banco de Dados MariaDB
VITE_MARIADB_HOST=seu_host
VITE_MARIADB_PORT=3306
VITE_MARIADB_USER=seu_usuario
VITE_MARIADB_PASSWORD=sua_senha
VITE_MARIADB_DATABASE=seu_banco

# URL da API
VITE_MARIADB_API_URL=http://localhost:3000/api

# Configurações do Supabase (opcional)
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

3. Substitua os valores pelos dados do seu ambiente
4. **IMPORTANTE**: Nunca comite o arquivo `.env` no repositório
5. O arquivo `.env` já está incluído no `.gitignore`

### Configuração do Banco de Dados

1. Certifique-se de que o MariaDB está instalado e rodando
2. Crie um banco de dados com o nome especificado em `VITE_MARIADB_DATABASE`
3. Crie um usuário com as permissões necessárias
4. Atualize as variáveis de ambiente com as credenciais corretas

### Configuração do Supabase (Opcional)

Se você estiver usando o Supabase como alternativa ao MariaDB:

1. Crie uma conta no Supabase
2. Crie um novo projeto
3. Obtenha a URL e a chave anônima nas configurações do projeto
4. Atualize as variáveis de ambiente correspondentes

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Construir para produção
npm run build
```

## Segurança

- Nunca compartilhe seu arquivo `.env`
- Mantenha suas credenciais seguras
- Use diferentes credenciais para desenvolvimento e produção
- Revise regularmente as permissões do banco de dados

## Suporte

Se precisar de ajuda com a configuração, abra uma issue no repositório.
