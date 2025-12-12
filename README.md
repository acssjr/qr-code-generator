<div align="center">

# 🎨 QR Code Generator Pro

<p align="center">
  <strong>Gerador de QR Code profissional com personalização avançada e rastreamento de analytics em tempo real</strong>
</p>

<p align="center">
  <a href="https://qr-generator-pro-pearl.vercel.app">
    <img src="https://img.shields.io/badge/▲_Vercel-Deploy-black?style=for-the-badge&logo=vercel" alt="Vercel Deploy" />
  </a>
  <a href="https://github.com/acssjr/qr-generator-pro">
    <img src="https://img.shields.io/github/stars/acssjr/qr-generator-pro?style=for-the-badge&logo=github&color=yellow" alt="GitHub Stars" />
  </a>
  <a href="https://github.com/acssjr/qr-generator-pro/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
  </a>
</p>

<p align="center">
  <a href="#-demo">Demo</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-começando">Começando</a> •
  <a href="#-estrutura">Estrutura</a> •
  <a href="#-api">API</a>
</p>

<br />

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="divider" />

</div>

<br />

## 🎯 Demo

<div align="center">

### 🌐 [Acesse o App →](https://qr-generator-pro-pearl.vercel.app)

</div>

<br />

## ✨ Funcionalidades

<table>
<tr>
<td width="50%">

### 🎨 Personalização Completa

- 🎯 **6 estilos de pontos** - Arredondado, círculos, clássico e mais
- 📐 **3 estilos de cantos** - Extra arredondado, círculo, quadrado
- 🖼️ **Logo central** - Adicione sua marca ao QR Code
- 🌈 **Cores customizáveis** - Pontos, cantos e fundo
- 🛡️ **Correção de erros** - 4 níveis (L, M, Q, H)
- 📏 **Margem ajustável** - 0-50px
- 📐 **Tamanho do download** - 100-1000px

</td>
<td width="50%">

### 📊 Analytics & Tracking

- 📈 **Scans em tempo real** - Monitore cada escaneamento
- 👥 **Visitantes únicos** - Identifique pessoas diferentes
- 🌍 **Geolocalização** - País e cidade de cada scan
- 📱 **Dispositivos** - Mobile, tablet, desktop
- 🌐 **Navegadores** - Chrome, Safari, Firefox, etc.
- 💻 **Sistema Operacional** - iOS, Android, Windows
- 📅 **Histórico** - Scans por dia e hora

</td>
</tr>
</table>

<br />

## 🛠️ Tecnologias

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![D1 Database](https://img.shields.io/badge/D1_Database-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

<br />

| Categoria | Tecnologia | Descrição |
|-----------|------------|-----------|
| **Frontend** | Next.js 16 | Framework React com App Router e Turbopack |
| **Estilização** | TailwindCSS | Utility-first CSS framework |
| **Linguagem** | TypeScript | Tipagem estática para JavaScript |
| **QR Code** | qr-code-styling | Biblioteca para geração de QR Codes customizados |
| **Ícones** | Lucide React | Ícones SVG modernos |
| **Backend** | Cloudflare Workers | Serverless functions na edge |
| **Database** | Cloudflare D1 | SQLite na edge |
| **Hospedagem** | Vercel | Deploy automático e CDN global |

<br />

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta na [Cloudflare](https://cloudflare.com) (para o tracking)
- Conta na [Vercel](https://vercel.com) (para deploy)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/acssjr/qr-generator-pro.git

# Entre no diretório
cd qr-generator-pro

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Scripts disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento (http://localhost:3000)
npm run build    # Build de produção
npm run start    # Inicia servidor de produção
npm run lint     # Verifica erros de código
```

<br />

## 📁 Estrutura

```
qr-generator-pro/
├── 📂 src/
│   ├── 📂 app/
│   │   ├── 🎨 globals.css       # Estilos globais + tema
│   │   ├── 📄 layout.tsx        # Layout principal
│   │   └── 📄 page.tsx          # Página principal
│   │
│   ├── 📂 components/
│   │   ├── 🎛️ CustomizationPanel.tsx   # Painel de personalização
│   │   ├── 📊 DashboardModal.tsx       # Modal de estatísticas
│   │   ├── 📱 QRCodeDisplay.tsx        # Exibição do QR Code
│   │   └── 🔔 Toast.tsx                # Notificações
│   │
│   ├── 📂 lib/
│   │   └── 🔌 api.ts            # Serviço de API
│   │
│   └── 📂 types/
│       └── 📝 index.ts          # Tipos TypeScript
│
├── 📂 worker/                   # Cloudflare Worker (API de tracking)
│   ├── 📂 src/
│   │   └── 📄 index.js          # Lógica do Worker
│   ├── 📄 schema.sql            # Schema do banco de dados
│   └── 📄 wrangler.toml         # Configuração do Worker
│
├── 📄 package.json
├── 📄 tailwind.config.ts
├── 📄 tsconfig.json
└── 📄 next.config.ts
```

<br />

## 🔌 API

A API de tracking está hospedada em Cloudflare Workers.

### Base URL

```
https://qr-tracker.acssjr.workers.dev
```

### Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/links` | Criar link rastreável |
| `GET` | `/api/links` | Listar todos os links |
| `GET` | `/api/links/:id` | Detalhes de um link |
| `DELETE` | `/api/links/:id` | Desativar link |
| `GET` | `/api/stats/:id` | Estatísticas de um link |
| `GET` | `/t/:shortCode` | Redirecionar e registrar scan |
| `GET` | `/health` | Health check |

### Exemplo de uso

```typescript
// Criar link rastreável
const response = await fetch('https://qr-tracker.acssjr.workers.dev/api/links', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://meusite.com',
    title: 'Meu Site'
  })
});

const { data } = await response.json();
// data.trackingUrl = "https://qr-tracker.acssjr.workers.dev/t/abc123"
```

### Dados coletados em cada scan

| Dado | Descrição | Privacidade |
|------|-----------|-------------|
| País | Código do país (ex: BR, US) | ✅ Público via Cloudflare |
| Cidade | Nome da cidade | ✅ Público via Cloudflare |
| Dispositivo | mobile, tablet, desktop | ✅ User-Agent |
| Navegador | Chrome, Safari, Firefox, etc. | ✅ User-Agent |
| Sistema | iOS, Android, Windows, etc. | ✅ User-Agent |
| IP Hash | Hash SHA-256 do IP | 🔒 Anonimizado |
| Data/Hora | Timestamp do scan | ✅ UTC |

<br />

## 🌐 Deploy

### Vercel (Frontend)

O deploy é automático a cada push para o branch `master`.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/acssjr/qr-generator-pro)

### Cloudflare Workers (API)

```bash
# Dentro da pasta worker/
cd worker

# Deploy do Worker
npx wrangler deploy

# Criar banco de dados D1 (primeira vez)
npx wrangler d1 create qr-tracker-db

# Executar migrations
npx wrangler d1 execute qr-tracker-db --remote --file=./schema.sql
```

<br />

## 📊 Deep Links

Acesse estatísticas de qualquer QR Code diretamente via URL:

```
https://qr-generator-pro-pearl.vercel.app/#stats/{shortCode}
```

Exemplo: `https://qr-generator-pro-pearl.vercel.app/#stats/abc123`

<br />

## 🤝 Contribuindo

Contribuições são sempre bem-vindas!

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

<br />

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

<br />

<div align="center">

---

**Feito com 💜 por [@acssjr](https://github.com/acssjr)**

<br />

<a href="https://qr-generator-pro-pearl.vercel.app">
  <img src="https://img.shields.io/badge/Acessar_App-8B5CF6?style=for-the-badge&logo=vercel&logoColor=white" alt="Acessar App" />
</a>

</div>
