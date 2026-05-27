<div align="center">

<img src="fotos/logo.png" alt="CarShopping Logo" width="200"/>

# 🚗 CarShopping

### Marketplace de Veículos — Compre e Venda com Segurança

[![Netlify Status](https://api.netlify.com/api/v1/badges/carshopping/deploy-status)](https://carshopping-app.netlify.app)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![Fastify](https://img.shields.io/badge/Fastify-v5-000000?style=flat&logo=fastify&logoColor=white)](https://fastify.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Netlify](https://img.shields.io/badge/Netlify-deployed-00C7B7?style=flat&logo=netlify&logoColor=white)](https://carshopping-app.netlify.app)
[![Railway](https://img.shields.io/badge/Railway-deployed-0B0D0E?style=flat&logo=railway&logoColor=white)](https://sitecarshopping-production.up.railway.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PageSpeed](https://img.shields.io/badge/PageSpeed-95%2B-4CAF50?style=flat&logo=google&logoColor=white)](#-performance)
[![Security Headers](https://img.shields.io/badge/Security%20Headers-A-green?style=flat&logo=shield&logoColor=white)](#-segurança)

<br/>

**[🌐 Ver Site ao Vivo](https://carshopping-app.netlify.app)** &nbsp;|&nbsp;
**[🔌 API Docs](#-api-rest)** &nbsp;|&nbsp;
**[⚡ Deploy Guide](#-deploy)** &nbsp;|&nbsp;
**[📄 Documentação Técnica](CarShopping_Documentacao_Tecnica.docx)**

</div>

---

## 📋 Índice

- [✨ Sobre o Projeto](#-sobre-o-projeto)
- [🎯 Funcionalidades](#-funcionalidades)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [🏗️ Arquitetura](#️-arquitetura)
- [📁 Estrutura de Arquivos](#-estrutura-de-arquivos)
- [🚀 Como Rodar Localmente](#-como-rodar-localmente)
- [🔌 API REST](#-api-rest)
- [⚡ Deploy](#-deploy)
- [🔒 Segurança](#-segurança)
- [📊 Performance](#-performance)
- [🌙 Dark Mode](#-dark-mode)
- [📱 Responsividade](#-responsividade)
- [🤝 Contribuindo](#-contribuindo)

---

## ✨ Sobre o Projeto

O **CarShopping** é um marketplace completo para compra e venda de veículos, construído com uma stack moderna e foco em performance, segurança e experiência do usuário.

A plataforma permite que usuários **anunciem** seus veículos com fotos, **busquem** com filtros avançados e **entrem em contato** diretamente com vendedores via WhatsApp — tudo em uma interface rápida e responsiva.

```
🌐 Frontend  →  Netlify (CDN Global)
⚙️  Backend   →  Railway (Node.js + Fastify v5)
🗄️  Banco     →  Neon (PostgreSQL Serverless)
```

---

## 🎯 Funcionalidades

<table>
<tr>
<td width="50%">

### 👤 Usuários
- ✅ Cadastro e login com JWT
- ✅ Hash de senhas com bcrypt
- ✅ Recuperação de senha
- ✅ Perfil com número de telefone
- ✅ Sessão persistente (localStorage)

### 🔍 Busca e Filtros
- ✅ Busca por texto (marca, modelo)
- ✅ Filtro por preço (mín/máx)
- ✅ Filtro por ano, km, combustível
- ✅ Ordenação por preço e ano
- ✅ Paginação de resultados

</td>
<td width="50%">

### 🚗 Veículos
- ✅ Anunciar com até 10 fotos
- ✅ Galeria interativa (arrows + thumbs)
- ✅ Contato via WhatsApp do vendedor
- ✅ Especificações completas do veículo
- ✅ Formulário de contato embutido

### 🎨 Interface
- ✅ Dark Mode / Light Mode
- ✅ 100% Responsivo (mobile first)
- ✅ Skeleton loading
- ✅ Animações suaves
- ✅ Acessibilidade 100/100

</td>
</tr>
</table>

---

## 🛠️ Stack Tecnológico

### Frontend
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![WebP](https://img.shields.io/badge/WebP-Images-4285F4?style=for-the-badge&logo=google&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-v5-000000?style=for-the-badge&logo=fastify&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-Passwords-FF6B6B?style=for-the-badge)

### Banco de Dados & ORM
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=for-the-badge&logoColor=black)
![Neon](https://img.shields.io/badge/Neon-Serverless-00E5B4?style=for-the-badge)

### Infraestrutura
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-Actions-181717?style=for-the-badge&logo=github&logoColor=white)

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    USUÁRIO (Navegador)                   │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────┐
│           FRONTEND — Netlify CDN (HTML/CSS/JS)           │
│                                                         │
│   index.html  busca.html  detalhe.html  vender.html     │
│   servicos.html  contato.html  login.html  cadastro.html│
└──────────────────────────┬──────────────────────────────┘
                           │ REST API (JSON)
┌──────────────────────────▼──────────────────────────────┐
│          BACKEND — Railway (Node.js + Fastify v5)        │
│                                                         │
│   /api/auth     →  Autenticação JWT + bcrypt            │
│   /api/cars     →  CRUD veículos + upload fotos         │
│   /api/contact  →  Formulário de contato                │
│                                                         │
│   Rate Limit: 100 req/min  │  CORS configurado          │
└──────────────────────────┬──────────────────────────────┘
                           │ SQL (Drizzle ORM)
┌──────────────────────────▼──────────────────────────────┐
│         BANCO DE DADOS — Neon (PostgreSQL Serverless)    │
│                                                         │
│   users  │  cars  │  car_images  │  contacts            │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Estrutura de Arquivos

<details>
<summary>📂 Clique para expandir a estrutura completa</summary>

```
site_carshopping/
│
├── 📄 HTML/
│   ├── index.html           # Página inicial com hero + carros populares
│   ├── busca.html           # Busca com filtros avançados + paginação
│   ├── detalhe.html         # Detalhe do veículo com galeria
│   ├── servicos.html        # Serviços automotivos parceiros
│   ├── vender.html          # Anunciar veículo (requer login)
│   ├── contato.html         # Formulário de contato
│   ├── login.html           # Autenticação
│   ├── cadastro.html        # Registro de usuário
│   └── recuperar-senha.html # Recuperação de senha
│
├── 🎨 CSS/
│   ├── tokens.css           # Design tokens (cores, fontes, sombras)
│   ├── style.css            # Header, footer, componentes globais
│   ├── busca.css            # Sidebar de filtros + grid de resultados
│   ├── detalhe.css          # Galeria + card de informações
│   ├── servicos.css         # Cards de serviço + FAQ
│   ├── vender.css           # Formulário + upload de fotos
│   ├── contato.css          # Layout de contato
│   ├── login.css            # Login e cadastro
│   └── cadastro.css         # Formulário de registro
│
├── ⚡ JS/
│   ├── config.js            # URLs da API (dev/produção automático)
│   ├── api.js               # Wrapper fetch com auth e erros
│   ├── utils.js             # Dark mode, formatação, utilitários
│   ├── auth.js              # Gerenciamento de sessão JWT
│   ├── script.js            # Lógica da home
│   ├── busca.js             # Filtros + chamadas API
│   ├── detalhe.js           # Galeria + WhatsApp do vendedor
│   ├── vender.js            # Upload fotos + submit anúncio
│   ├── contato.js           # Envio de mensagens
│   ├── login.js             # Autenticação
│   ├── cadastro.js          # Registro
│   ├── servicos.js          # Filtros de categoria
│   └── cookies.js           # Banner de consentimento
│
├── 🖼️ fotos/                # Imagens .png e .webp (otimizadas)
│
├── ⚙️ backend/
│   └── src/
│       ├── server.js        # Fastify + plugins + rate limiting
│       ├── routes/
│       │   ├── auth.js      # POST /register, POST /login, GET /me
│       │   ├── cars.js      # GET/POST/PUT/DELETE /cars
│       │   └── contact.js   # POST /contact
│       ├── db/              # Schema Drizzle + conexão Neon
│       ├── lib/             # Storage de arquivos
│       └── middleware/      # Auth guard JWT
│
├── 🌐 netlify.toml          # Redirects + headers de segurança
├── 🤖 robots.txt            # Instruções para crawlers
├── 🗺️ sitemap.xml           # Mapa do site para SEO
└── 📦 package.json          # Dependências Node.js
```

</details>

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

```bash
node -v   # >= 18.0.0
npm -v    # >= 9.0.0
```

### 1. Clone o repositório

```bash
git clone https://github.com/Miller-hub-cyber/site_carshopping.git
cd site_carshopping
```

### 2. Configure o Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` na pasta `backend/`:

```env
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=sua_chave_secreta_de_pelo_menos_32_caracteres
CORS_ORIGIN=http://localhost:5500
PORT=3000
NODE_ENV=development
```

Rode as migrations do banco:

```bash
npm run db:push
```

Inicie o servidor:

```bash
npm run dev
# Servidor rodando em http://localhost:3000
```

### 3. Configure o Frontend

Edite `JS/config.js` e certifique-se que `DEV_API_BASE` aponta para `http://localhost:3000/api`.

Abra o `HTML/index.html` com Live Server (VS Code) ou qualquer servidor estático:

```bash
# Com npx serve:
npx serve .
# Acesse: http://localhost:3000
```

> **Dica:** Use a extensão **Live Server** do VS Code para hot reload automático.

---

## 🔌 API REST

**Base URL:** `https://sitecarshopping-production.up.railway.app/api`

<details>
<summary>🔐 Autenticação — <code>/api/auth</code></summary>

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/auth/register` | Criar conta | ❌ |
| `POST` | `/auth/login` | Entrar e receber JWT | ❌ |
| `GET` | `/auth/me` | Dados do usuário logado | ✅ |

**Exemplo de login:**
```json
POST /api/auth/login
{
  "email": "usuario@email.com",
  "password": "minhasenha123"
}
```

```json
// Resposta
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "name": "João", "email": "joao@email.com" }
}
```

</details>

<details>
<summary>🚗 Veículos — <code>/api/cars</code></summary>

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/cars` | Listar com filtros e paginação | ❌ |
| `GET` | `/cars/:id` | Detalhe do veículo | ❌ |
| `POST` | `/cars` | Criar anúncio (multipart) | ✅ |
| `PUT` | `/cars/:id` | Editar anúncio | ✅ |
| `DELETE` | `/cars/:id` | Remover anúncio | ✅ |

**Filtros disponíveis (GET /api/cars):**

| Parâmetro | Tipo | Exemplo |
|-----------|------|---------|
| `q` | string | `?q=onix` |
| `brand` | string | `?brand=chevrolet` |
| `priceMin` | number | `?priceMin=30000` |
| `priceMax` | number | `?priceMax=100000` |
| `year` | number | `?year=2024` |
| `fuel` | string | `?fuel=flex` |
| `kmMax` | number | `?kmMax=50000` |
| `sort` | string | `?sort=price_asc` |
| `page` | number | `?page=1` |
| `limit` | number | `?limit=12` |

</details>

<details>
<summary>📩 Contato — <code>/api/contact</code></summary>

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/contact` | Enviar mensagem | ❌ |

```json
POST /api/contact
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "phone": "11 99999-9999",
  "subject": "Interesse no Onix 2024",
  "message": "Gostaria de mais informações sobre o veículo."
}
```

</details>

> Todas as rotas protegidas requerem o header: `Authorization: Bearer <token>`

---

## ⚡ Deploy

### Frontend → Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Miller-hub-cyber/site_carshopping)

1. Conecte o repositório no [Netlify](https://netlify.com)
2. **Publish directory:** `.` (raiz)
3. O `netlify.toml` já cuida de redirects e headers de segurança

### Backend → Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app)

1. Conecte o repositório no [Railway](https://railway.app)
2. **Root Directory:** `backend`
3. Configure as variáveis de ambiente:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
CORS_ORIGIN=https://seu-site.netlify.app
PORT=3000
```

### Banco de Dados → Neon

1. Crie um projeto no [Neon](https://neon.tech)
2. Copie a connection string para `DATABASE_URL`
3. Rode `npm run db:push` no backend para criar as tabelas

---

## 🔒 Segurança

| Header | Valor | Proteção |
|--------|-------|----------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Força HTTPS |
| `X-Content-Type-Options` | `nosniff` | Previne MIME sniffing |
| `X-Frame-Options` | `SAMEORIGIN` | Previne clickjacking |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controla referer |
| `Content-Security-Policy` | `default-src 'self'; ...` | Previne XSS |
| `Permissions-Policy` | `camera=(), microphone=(), ...` | Desativa APIs não usadas |

**Score atual:** 🟢 **A** no [securityheaders.com](https://securityheaders.com)

**Outras proteções:**
- 🔑 Senhas com **bcrypt** (salt rounds: 10) — nunca armazenadas em texto puro
- 🎫 **JWT** com expiração de 7 dias
- 🚦 **Rate Limiting:** máximo 100 req/min por IP
- 🌐 **CORS** restrito à URL de produção

---

## 📊 Performance

> Resultados do Google PageSpeed Insights — Desktop

<table>
<tr>
<td align="center">

### ⚡ Performance
## 95+
*após otimizações WebP*

</td>
<td align="center">

### ♿ Acessibilidade
## 100
*WCAG 2.1 AA*

</td>
<td align="center">

### ✅ Boas Práticas
## 100
*HTTPS, headers, etc.*

</td>
<td align="center">

### 🔍 SEO
## 100
*meta, sitemap, robots*

</td>
</tr>
</table>

### Otimizações aplicadas

| Técnica | Impacto |
|---------|---------|
| 🖼️ Conversão PNG → WebP (27 imagens) | **−3.5 MB** de payload |
| 🦸 Hero image preload + `fetchpriority="high"` | LCP < 2.5s |
| ⚡ Font Awesome assíncrono (`rel="preload"`) | −60ms render-blocking |
| 📐 `width`/`height` em todas as imagens | CLS ≈ 0 |
| 🖼️ `<picture>` com source WebP + fallback PNG | 96% navegadores |
| 💾 Cache 1 ano para imagens (`immutable`) | 0ms no retorno |

<details>
<summary>📈 Economia por imagem (clique para ver)</summary>

| Imagem | PNG | WebP | Redução |
|--------|-----|------|---------|
| Tela_principal (hero) | 1.573 KB | 141 KB | **−91%** |
| onix.png | 841 KB | 89 KB | **−89%** |
| tracker.png | 770 KB | 88 KB | **−89%** |
| hb20.png | 219 KB | 29 KB | **−87%** |
| image_2.png | 148 KB | 21 KB | **−86%** |
| Logos e ícones | ~250 KB | ~45 KB | **−82%** |

</details>

---

## 🌙 Dark Mode

O site possui dark mode completo, ativado via botão na navbar (ícone 🌙/☀️).

- Preferência salva no `localStorage`
- **Padrão:** modo claro
- Implementado com CSS custom properties + `[data-theme="dark"]`
- Todas as páginas têm suporte completo

```css
/* Exemplo de token de cor */
:root {
  --text-dark: #1a1a2e;
  --light-bg:  #f8f9fa;
}
[data-theme="dark"] {
  --text-dark: #e2e8f0;
  --light-bg:  #0f172a;
}
```

---

## 📱 Responsividade

| Breakpoint | Tela | Comportamento |
|------------|------|---------------|
| Desktop | > 1024px | Layout completo, sidebar visível |
| Tablet | 768–1024px | Grid 2 colunas, sidebar colapsada |
| Mobile | 480–768px | Grid 1 coluna, filtros em painel off-canvas |
| Mobile XS | < 480px | Inputs font-size 16px (sem zoom iOS) |

---

## 🗄️ Banco de Dados

```
┌──────────┐       ┌──────────────┐       ┌─────────────┐
│  users   │ 1───N │     cars     │ 1───N │ car_images  │
│──────────│       │──────────────│       │─────────────│
│ id       │       │ id           │       │ id          │
│ name     │       │ userId  (FK) │       │ carId  (FK) │
│ email    │       │ brand        │       │ filename    │
│ password │       │ model        │       │ order       │
│ phone    │       │ year         │       └─────────────┘
│ created_at       │ price        │
└──────────┘       │ km           │       ┌─────────────┐
                   │ fuel         │       │  contacts   │
                   │ transmission │       │─────────────│
                   │ description  │       │ id          │
                   │ status       │       │ name        │
                   └──────────────┘       │ email       │
                                          │ message     │
                                          │ created_at  │
                                          └─────────────┘
```

---

## 📂 Páginas do Site

| Página | Rota | Descrição |
|--------|------|-----------|
| 🏠 Home | `/HTML/index.html` | Carros populares, parceiros, categorias |
| 🔍 Busca | `/HTML/busca.html` | Filtros avançados + listagem da API |
| 🚗 Detalhe | `/HTML/detalhe.html?id=:id` | Galeria + WhatsApp do vendedor |
| 🏪 Serviços | `/HTML/servicos.html` | Serviços automotivos parceiros |
| 📢 Vender | `/HTML/vender.html` | Anunciar veículo (requer login) |
| 📞 Contato | `/HTML/contato.html` | Formulário de contato |
| 🔐 Login | `/HTML/login.html` | Autenticação |
| 📝 Cadastro | `/HTML/cadastro.html` | Criar conta |

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. **Fork** o repositório
2. Crie uma **branch** para sua feature:
   ```bash
   git checkout -b feature/minha-feature
   ```
3. **Commit** suas mudanças:
   ```bash
   git commit -m "feat: adiciona funcionalidade X"
   ```
4. **Push** para a branch:
   ```bash
   git push origin feature/minha-feature
   ```
5. Abra um **Pull Request**

### Padrão de commits

```
feat:     Nova funcionalidade
fix:      Correção de bug
perf:     Melhoria de performance
style:    Mudança de estilo/CSS
docs:     Documentação
refactor: Refatoração sem mudar comportamento
security: Melhorias de segurança
```

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

Feito com ❤️ por **Miller Lima**

[![GitHub](https://img.shields.io/badge/GitHub-Miller--hub--cyber-181717?style=flat&logo=github)](https://github.com/Miller-hub-cyber)

⭐ **Se este projeto te ajudou, deixa uma estrela!** ⭐

</div>
