# 🏥 PAT.HOSP - Sistema de Gestão de Patrimônio Hospitalar

**Versão:** 3.0  
**Status:** ✅ Completo e Funcional  
**Última Atualização:** Junho 2026

---

## 📋 Visão Geral

PAT.HOSP é um sistema web completo para gestão de patrimônio hospitalar, desenvolvido para o **Hospital Regional de Ponta Porã**. O sistema permite:

- ✅ **Importação em lote** de patrimônios com geração automática de IDs
- ✅ **CRUD completo** (adicionar, editar, remover, ativar/inativar)
- ✅ **Movimentações** entre centros de custo com histórico
- ✅ **Relatórios** em PDF e Excel com filtros customizáveis
- ✅ **Etiquetas** com QR Code para impressão
- ✅ **Visualização dinâmica** de patrimônios via QR Code

---

## 🚀 Começar a Usar

### 1. Acessar o Sistema
👉 **https://gestaodecustohrdjsn.github.io/pat-hosp/**

### 2. Configurar a API
1. Vá em **⚙️ Configurações**
2. Cole a URL do seu Google Apps Script
3. Clique em **Testar Conexão**

### 3. Importar Patrimônios
1. Vá em **📥 Importar**
2. Selecione seu arquivo CSV
3. Clique em **Importar**

### 4. Usar o Sistema
- **Patrimônios:** Visualizar, adicionar, editar, remover
- **Relatórios:** Gerar PDF/Excel
- **Etiquetas:** Imprimir com QR Code
- **Visualização:** Escanear QR Code para ver detalhes

---

## 🏗️ Arquitetura

### Frontend (React + TypeScript)
- **Páginas:** Home, Configurações, Patrimônios, Importação, Relatórios, Etiquetas, Visualização
- **Componentes:** LoadingSpinner, ErrorBoundary, etc.
- **Utilitários:** Validações, API client, helpers

### Backend (Google Apps Script)
- **Tabelas:** Patrimônios, Histórico, Movimentações, Inativos, Contadores
- **Endpoints:** 12 operações CRUD e de relatório
- **Gerador de IDs:** Automático e único por tipo/centro

### Banco de Dados
- **Google Sheets** com 5 abas
- **Sincronização em tempo real**
- **Backup automático**

---

## 📊 Funcionalidades Principais

### 1. Gestão de Patrimônios
```
✓ Adicionar novo patrimônio (ID gerado automaticamente)
✓ Editar informações
✓ Remover patrimônio
✓ Ativar/Inativar
✓ Movimentar entre centros de custo
```

### 2. Importação em Lote
```
✓ Upload de arquivo CSV
✓ Preview dos dados
✓ Geração automática de IDs
✓ Validação de entrada
```

### 3. Relatórios
```
✓ Filtros por centro, status, tipo
✓ Seleção de colunas
✓ Exportar para Excel
✓ Exportar para PDF
✓ Preview antes de exportar
```

### 4. Etiquetas com QR Code
```
✓ Seleção múltipla
✓ Preview de etiqueta
✓ QR Code dinâmico
✓ Template 200mm × 100mm
✓ Impressão direta
```

### 5. Visualização Dinâmica
```
✓ Acesso via QR Code
✓ Design vinho/dourado
✓ Campos customizáveis
✓ Responsiva
```

---

## 🎨 Design

- **Cores Principais:** Vinho (#990033) + Dourado (#D4AF37)
- **Tipografia:** IBM Plex Sans (profissional e clara)
- **Layout:** Responsivo, minimalista e elegante
- **Acessibilidade:** WCAG 2.1 AA

---

## 📱 Compatibilidade

- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile (iOS/Android)

---

## 🔐 Segurança

- ✅ Validação de entrada
- ✅ Sanitização de dados
- ✅ HTTPS (GitHub Pages)
- ✅ localStorage para dados locais
- ✅ Sem armazenamento de dados sensíveis

---

## 📝 Estrutura de Pastas

```
pat-hosp/
├── client/
│   ├── src/
│   │   ├── pages/          # Páginas principais
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── lib/            # Utilitários e API
│   │   ├── App.tsx         # Roteamento
│   │   ├── main.tsx        # Entry point
│   │   └── index.css       # Estilos globais
│   └── index.html          # HTML template
├── CODIGO_APPS_SCRIPT.gs   # Backend Google Apps Script
├── package.json            # Dependências
├── vite.config.ts          # Configuração Vite
└── README.md               # Este arquivo
```

---

## 🛠️ Desenvolvimento

### Instalar Dependências
```bash
pnpm install
```

### Rodar Localmente
```bash
pnpm dev
```

### Build para Produção
```bash
pnpm build
```

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se a API está configurada em **Configurações**
2. Teste a conexão com **Testar Conexão**
3. Verifique o console do navegador (F12) para erros

---

## 📜 Licença

Desenvolvido para Hospital Regional de Ponta Porã - 2026

---

**Última Atualização:** Junho 2026  
**Versão:** 3.0  
**Status:** ✅ Pronto para Produção
