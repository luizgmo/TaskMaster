# TaskMaster

TaskMaster é uma aplicação web de gerenciamento de tarefas (Todo List) desenvolvida com Angular no frontend e .NET no backend. A aplicação permite aos usuários gerenciar suas tarefas diárias com recursos de filtragem, ordenação e categorização por prioridades.

## 📋 Funcionalidades

- **Gerenciamento completo de tarefas**
  - Criar, visualizar, editar e excluir tarefas
  - Marcar tarefas como concluídas
  - Remover todas as tarefas concluídas de uma vez

- **Organização avançada**
  - Definir prioridades (Baixa, Média, Alta)
  - Estabelecer datas de vencimento
  - Ordenar por data ou prioridade

- **Filtragem inteligente**
  - Buscar tarefas por texto
  - Filtrar por múltiplas prioridades
  - Visualização personalizada das tarefas

- **Interface responsiva**
  - Design adaptável para dispositivos móveis e desktop
  - Tema escuro moderno
  - Experiência de usuário intuitiva

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Angular** - Framework para desenvolvimento do frontend
- **TypeScript** - Linguagem de programação
- **SCSS** - Pré-processador CSS para estilização
- **HttpClient** - Para comunicação com a API

### Backend
- **ASP.NET Core** - Framework para desenvolvimento do backend
- **Entity Framework Core** - ORM para acesso ao banco de dados
- **InMemory Database** - Banco de dados em memória para desenvolvimento
- **C#** - Linguagem de programação

## 🚀 Instalação e Execução

### Pré-requisitos
- [Node.js](https://nodejs.org/)
- [Angular CLI](https://cli.angular.io/)
- [.NET SDK](https://dotnet.microsoft.com/download)

## 🚀 Instruções para rodar o projeto

```bash
# 1. Clonar o repositório
git clone https://github.com/luizgmo/TaskMaster.git
cd TaskMaster

# 2. Rodar o Backend (.NET)
cd TodoApi
dotnet restore
dotnet build
dotnet run
# O backend estará rodando em http://localhost:5206

# 3. Rodar o Frontend (Angular)
# Abra um novo terminal
cd ../todo-app
npm install
ng serve
# O frontend estará acessível em http://localhost:4200
