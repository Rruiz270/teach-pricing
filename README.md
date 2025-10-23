# TEACH Platform - Calculadora de Preços

Ferramenta interativa para gerar propostas comerciais dos cursos de IA para educadores da plataforma TEACH.

## 🎯 Funcionalidades

### 📊 Modelos de Curso

1. **TEACH Digital** - Aprendizado assíncrono
   - Acesso ilimitado à plataforma
   - 2 workshops mensais
   - Aula introdutória presencial
   - Tiers: 1-200 (R$120), 201-500 (R$105), 501-1000 (R$95), 1001+ (R$89)

2. **TEACH Interativo** - Aulas em grupo online
   - Aulas online 2x/semana (90min)
   - Grupos até 30 estudantes
   - Inclui tudo do Digital
   - Tiers: 1-200 (R$200), 201-500 (R$179), 501+ (R$159)

3. **TEACH Premium** - Ensino personalizado
   - Grupos até 10 estudantes
   - Aulas personalizadas
   - Múltiplos encontros presenciais
   - Recursos extras configuráveis
   - Tiers: 1-50 (R$350), 51-100 (R$320), 101+ (R$300)

### ⚡ Recursos

- ✅ **Cálculo Automático** - Preços ajustados por faixa de alunos
- ✅ **Recursos Extras** - Add-ons personalizáveis (Premium)
- ✅ **Geração de Proposta** - Download em Markdown
- ✅ **Interface Responsiva** - Otimizada para mobile
- ✅ **Dados do Cliente** - Formulário completo para propostas
- ✅ **Branding Better Tech** - Identidade visual profissional

## 🚀 Como Usar

1. **Selecione o Modelo** - Escolha entre Digital, Interativo ou Premium
2. **Defina Quantidade** - Use o slider ou input para número de professores
3. **Configure Extras** - Adicione recursos extras (se Premium)
4. **Preencha Dados** - Informações do cliente para a proposta
5. **Gere Proposta** - Download automático em formato Markdown

## 🛠️ Desenvolvimento

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
git clone <repository-url>
cd teach-pricing-calculator
npm install
```

### Executar Localmente
```bash
npm run dev
```

Acesse: http://localhost:3000

### Build para Produção
```bash
npm run build
npm start
```

## 🌐 Deploy

O projeto está configurado para deploy automático no Vercel.

### Deploy Manual
```bash
vercel --prod
```

## 📋 Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones
- **Vercel** - Deploy e hosting

## 🎨 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/
│   ├── ui/                # Componentes base (Radix)
│   └── PricingCalculator.tsx  # Componente principal
└── lib/
    ├── pricing-models.ts  # Lógica dos modelos de preço
    └── utils.ts           # Utilitários
```

## 💰 Modelos de Preço

### Faixas por Modalidade

| Professores | Digital | Interativo | Premium |
|-------------|---------|-----------|---------|
| 1-200       | R$ 120  | R$ 200    | R$ 350  |
| 201-500     | R$ 105  | R$ 179    | R$ 320  |
| 501-1000    | R$ 95   | R$ 159    | R$ 300  |
| 1001+       | R$ 89   | R$ 159    | R$ 300  |

### Recursos Extras (Premium)

- **Horas Extras/Semana**: +R$ 25/professor
- **Workshops Adicionais**: +R$ 15/professor
- **Encontros Presenciais**: +R$ 45/professor

## 📄 Geração de Propostas

A ferramenta gera propostas profissionais em Markdown incluindo:

- Dados do cliente e projeto
- Detalhamento da modalidade selecionada
- Breakdown financeiro completo
- Recursos adicionais (se aplicável)
- Próximos passos
- Informações da Better Tech
- Validade da proposta (30 dias)

## 🏢 Better Tech

Produto desenvolvido pela Better Tech, especializada em soluções educacionais inovadoras com foco em IA para educação.

---

**Versão**: 1.0.0  
**Última Atualização**: Outubro 2024