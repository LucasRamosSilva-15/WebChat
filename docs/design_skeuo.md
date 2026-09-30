# Skeuo Design System - Documentação Definitiva

Bem-vindo à documentação oficial do Design System **Skeuo** (influenciado pelo Web 2.0 e Frutiger Aero) utilizado no WebChat.
Este documento foi autogerado a partir de uma auditoria profunda nos arquivos CSS e componentes JSX do projeto.

---

## 🎨 1. Filosofia de Design

O WebChat adota uma estética rica, focada em:
- **Gloss & Shine**: Superfícies brilhantes, gradientes sutis.
- **Profundidade**: Sombras bem definidas, bordas em relevo.
- **Micro-interações**: Feedback tátil visual ao passar o mouse ou clicar.

---

## 💧 2. Variáveis Globais (CSS Custom Properties)

Abaixo estão as variáveis raízes do sistema, usadas para consistência de cores e espaçamentos.

| Variável | Valor Registrado |
|----------|------------------|
| `--primary-light` | `#4da4ff` |
| `--primary-main` | `#0071e3` |
| `--primary-dark` | `#005bb5` |
| `--primary-darker` | `#004488` |
| `--primary-hover-light` | `#66b3ff` |
| `--primary-hover-main` | `#1a82ff` |
| `--primary-hover-dark` | `#006ce6` |
| `--primary-hover-darker` | `#0055a3` |
| `--primary-ring` | `rgba(0, 113, 227, 0.1)` |
| `--primary-ring-focus` | `rgba(0, 113, 227, 0.6)` |
| `--primary-light` | `#34d399` |
| `--primary-main` | `#10b981` |
| `--primary-dark` | `#059669` |
| `--primary-darker` | `#047857` |
| `--primary-hover-light` | `#6ee7b7` |
| `--primary-hover-main` | `#34d399` |
| `--primary-hover-dark` | `#10b981` |
| `--primary-hover-darker` | `#059669` |
| `--primary-ring` | `rgba(16, 185, 129, 0.1)` |
| `--primary-ring-focus` | `rgba(16, 185, 129, 0.6)` |
| `--primary-light` | `#c084fc` |
| `--primary-main` | `#a855f7` |
| `--primary-dark` | `#9333ea` |
| `--primary-darker` | `#7e22ce` |
| `--primary-hover-light` | `#d8b4fe` |
| `--primary-hover-main` | `#c084fc` |
| `--primary-hover-dark` | `#a855f7` |
| `--primary-hover-darker` | `#9333ea` |
| `--primary-ring` | `rgba(168, 85, 247, 0.1)` |
| `--primary-ring-focus` | `rgba(168, 85, 247, 0.6)` |
| `--primary-light` | `#fb7185` |
| `--primary-main` | `#f43f5e` |
| `--primary-dark` | `#e11d48` |
| `--primary-darker` | `#be123c` |
| `--primary-hover-light` | `#fda4af` |
| `--primary-hover-main` | `#fb7185` |
| `--primary-hover-dark` | `#f43f5e` |
| `--primary-hover-darker` | `#e11d48` |
| `--primary-ring` | `rgba(244, 63, 94, 0.1)` |
| `--primary-ring-focus` | `rgba(244, 63, 94, 0.6)` |
| `--primary-light` | `#94a3b8` |
| `--primary-main` | `#64748b` |
| `--primary-dark` | `#475569` |
| `--primary-darker` | `#334155` |
| `--primary-hover-light` | `#cbd5e1` |
| `--primary-hover-main` | `#94a3b8` |
| `--primary-hover-dark` | `#64748b` |
| `--primary-hover-darker` | `#475569` |
| `--primary-ring` | `rgba(100, 116, 139, 0.1)` |
| `--primary-ring-focus` | `rgba(100, 116, 139, 0.6)` |
| `--tw-gradient-from` | `var(--primary-light) !important` |
| `--tw-gradient-stops` | `var(--tw-gradient-from), var(--tw-gradient-to, transparent) !important` |
| `--tw-gradient-to` | `var(--primary-main) !important` |


---

## 🔮 3. Classes CSS Customizadas (Skeuomorphism)

Nossas folhas de estilo fornecem utilitários avançados de Skeuomorphism que o Tailwind puro não resolve nativamente (ou demandaria muita verbosidade).

### `.about-action-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-action-secondary`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-badge`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-bg-orb-bottom`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-bg-orb-top`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-chat-body`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-chat-input`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-chat-inputbar`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-chat-pattern`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-chat-room-icon`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-chat-room-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-chat-status-dot`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-chat-status-text`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-chat-topbar`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-chat-window`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-cta`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-cta-bottom-glow`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-cta-button`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-cta-glow`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-cta-icon`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-cta-line`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-cta-subtitle`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-cta-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-hero-description`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-hero-highlight`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-hero-panel`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-hero-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-info-card`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-info-description`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-info-icon`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-info-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-message-incoming`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-message-outgoing`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-message-time`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-preview`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-preview-glow`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-section-heading-panel`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-section-subtitle`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-section-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-send-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-typing-text`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-window-dot`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-window-dot-green`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-window-dot-red`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.about-window-dot-yellow`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.active`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-action-icon`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-action-icon-danger`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-avatar-bg`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-badge-global`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-badge-trend-neutral`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-badge-trend-up`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-border-muted`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-bottom-bar`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-btn-blue-outline`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-btn-danger-outline`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-btn-purple-outline`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-card-glow-blue`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-card-glow-green`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-card-glow-purple`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-card-glow-red`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-details-box`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-empty-icon-bg`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-hero-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-icon-box-blue`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-icon-box-purple`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-icon-box-red`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-icon-wrap-blue`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-icon-wrap-green`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-icon-wrap-purple`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-icon-wrap-red`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-media-empty`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-media-main`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-modal-overlay`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-modal-overlay-dark`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-modal-panel`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-msg-box`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-page-bg`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-quick-action`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-select-bg`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-status-high`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-status-pending`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-tab`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-tab-active`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-table-header`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-table-row`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-table-text`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.admin-text-muted`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.animate-chat-panel-left`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.animate-chat-panel-main`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.animate-chat-panel-right`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.animate-chat-shell`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.animate-fade-in-up-1`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.animate-fade-in-up-2`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.animate-fade-in-up-3`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.animate-fade-in-up-4`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.animate-fade-in-up-5`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.animate-loading-orb`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.animate-loading-panel`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.animate-loading-shine`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.app-footer`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.app-footer-link`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.app-footer-links-container`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.app-footer-separator`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.app-footer-text`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.auth-divider-line`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.auth-divider-text`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.auth-error`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.auth-link`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.auth-secondary-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.auth-subtitle`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.auth-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.avatar-2xl`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.avatar-image`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.avatar-lg`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.avatar-md`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.avatar-ring`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.avatar-ring-2xl`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.avatar-ring-xl`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.avatar-sm`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.avatar-status`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.avatar-status-2xl`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.avatar-status-away`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.avatar-status-busy`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.avatar-status-lg`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.avatar-status-md`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.avatar-status-offline`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.avatar-status-online`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.avatar-status-sm`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.avatar-status-xl`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.avatar-status-xs`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.avatar-wrapper`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.avatar-wrapper-clickable`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.avatar-xl`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.avatar-xs`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.base`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.bg-classic-blue`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.bg-clean-light`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.bg-gray-100`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.bg-gray-200`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.bg-green-50`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.bg-smooth-gradient`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.bg-white`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.border-gray-200`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.border-gray-300`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.border-green-200`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.btn-secondary-glossy`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.btn-white-glossy`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.button-icon`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-confirm-cancel-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-error-desc`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-error-icon`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-error-icon-gray`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-error-icon-red`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-error-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-header`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-header-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-header-btn-active`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-header-divider`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-header-icon`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-header-online-dot`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-header-subtitle`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-header-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-image-lightbox`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-image-lightbox-close`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-image-lightbox-image`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-input-attach-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-input-cancel-edit-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-input-editing-bar`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-input-footer`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-input-panel`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-input-preview-image`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-input-send-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-input-send-btn-disabled`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-main`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-message-enter`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-messages-empty`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-messages-empty-desc`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-messages-empty-fav`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-messages-empty-icon`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-messages-empty-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-pinned-author`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-pinned-close`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-pinned-icon`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-pinned-message`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-pinned-text`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-search-clear-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-search-close-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-search-empty`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-search-error`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-search-icon`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-search-nav-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-search-navigation`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-search-panel`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-search-panel-closed`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-search-panel-open`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-search-result-count`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-sidebar`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-sidebar-badge`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-sidebar-badge-active`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-sidebar-badge-inactive`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-sidebar-footer`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-sidebar-item`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-sidebar-item-active`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-sidebar-item-disabled`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-sidebar-profile`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-sidebar-profile-name`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-sidebar-status-dot`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-sidebar-status-text`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-user-modal-avatar`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-user-modal-backdrop`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-user-modal-disabled-action`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-user-modal-enter`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-user-modal-name`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-user-modal-private-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-user-modal-report-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-user-modal-role-badge`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-user-modal-role-badge-mod`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-user-modal-role-badge-owner`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-user-modal-role-label`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-user-modal-role-panel`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-user-modal-select`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.chat-user-modal-status`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.color-green`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.color-purple`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.color-red`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.color-slate`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.counter`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.custom-avatar-overlay`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.custom-input`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.custom-label`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.custom-link`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.custom-online-dot`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.custom-online-text`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.custom-preview-card`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.custom-preview-name`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.custom-preview-status`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.custom-subtitle`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.custom-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.custom-toast`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.custom-toast-icon`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.custom-toast-text`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.feedback-file-chip`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.feedback-file-remove`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.feedback-hero-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.feedback-label`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.feedback-subtitle`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.feedback-success-desc`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.feedback-success-icon`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.feedback-success-overlay`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.feedback-success-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.feedback-type-card`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.feedback-type-card-active`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.feedback-type-desc`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.feedback-type-elogio`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.feedback-type-erro`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.feedback-type-icon-wrap`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.feedback-type-ideia`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.feedback-type-sugestao`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.feedback-type-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.feedback-upload-area`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.feedback-upload-icon`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.feedback-upload-icon-wrap`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.feedback-upload-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.framework`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.hero`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.hero-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.home-action-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.home-hero-subtitle`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.home-hero-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.icon`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.logo`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.member-item`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.member-name`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.member-role`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.member-role-admin`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.member-role-moderator`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.member-role-owner`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.member-status-text`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.members-list-offline`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.members-sidebar`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.members-sidebar-empty`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.members-sidebar-error`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.members-sidebar-header-offline`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-avatar-interactive`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-bubble-actions`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-bubble-actions-other`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-bubble-actions-own`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-bubble-author`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-bubble-card`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-bubble-card-other`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-bubble-card-own`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-bubble-image`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-bubble-like-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-bubble-like-btn-active`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-bubble-like-btn-visible`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-bubble-menu`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-bubble-menu-divider`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-bubble-menu-item`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-bubble-menu-item-danger`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-bubble-menu-open`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-bubble-more-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-bubble-row`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-bubble-text`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-bubble-time`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-bubble-wrapper`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-edit-menu-icon`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-favorite-menu-icon`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-favorite-menu-icon-active`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-read-indicator`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-role-badge`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-role-badge-mod`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-role-badge-owner`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-search-current`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.message-search-match`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-dropdown-icon`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-dropdown-icon-danger`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-dropdown-item`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-dropdown-item-bordered`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-dropdown-item-danger`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-dropdown-item-disabled`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-dropdown-list`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-dropdown-panel`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-dropdown-panel-closed`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-dropdown-panel-open`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-profile-card`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-profile-desc`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-profile-edit-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-profile-footer`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-profile-info`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-profile-name`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-profile-panel`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-profile-panel-closed`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-profile-panel-open`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-profile-status`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-profile-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-profile-trigger`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-close-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-close-icon`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-color-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-color-btn-active`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-color-btn-inactive`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-color-dot`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-color-grid`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-content`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-footer`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-header`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-label`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-option`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-option-active`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-option-desc`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-option-inactive`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-option-text`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-option-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-options`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-overlay`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-overlay-closed`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-overlay-open`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-panel`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-panel-closed`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-panel-open`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-radio`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-save-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-section`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.navbar-settings-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.not-found-code`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.not-found-desc`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.not-found-icon`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.not-found-note`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.not-found-orb`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.not-found-panel`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.not-found-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.pinned-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.reveal`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-action-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-badge`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-badge-active`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-badge-archived`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-badge-dot`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-badge-dot-active`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-badge-dot-archived`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-badge-dot-full`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-badge-full`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-create-room-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-empty`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-error-desc`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-error-icon`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-error-panel`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-error-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-favorite-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-favorite-btn-active`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-favorite-btn-inactive`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-filter-arrow`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-filter-icon`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-filter-select`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-filter-wrapper`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-full-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-header`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-header-content`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-icon-tile`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-label`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-list-header`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-list-panel`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-list-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-modal-actions`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-modal-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-modal-btn-submit`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-modal-input`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-modal-panel`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-modal-select`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-modal-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-page`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-page-error`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-pagination`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-pagination-actions`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-pagination-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-pagination-btn-active`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-retry-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-row-category`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-row-date`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-row-members`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-row-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-search-icon`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-search-input`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-search-wrapper`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-stat-card`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-stat-icon-blue`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-stat-icon-green`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-stat-icon-red`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-stat-icon-wrapper`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-stat-muted`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-stat-positive`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-stat-subtext`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-stat-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-stat-value`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-stats-grid`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-subtitle`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-table`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-table-header-row`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-table-row`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-table-td`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-table-th`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-table-wrapper`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-toolbar`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-tooltip`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.rooms-tooltip-arrow`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-badge-text`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-badge-top`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-color-circle`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-color-circle-active`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-icon-box-blue`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-icon-box-cyan`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-icon-box-gray`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-icon-box-rose`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-page-bg`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-preview-area`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-preview-icon-dark`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-preview-icon-light`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-radio-circle`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-radio-circle-active`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-radio-inner`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-section-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-tab`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-tab-active`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-text-muted`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-theme-card`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-theme-card-active`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-theme-preview-auto`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-theme-preview-dark`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-theme-preview-light`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-toggle-bg`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-toggle-bg-active`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-toggle-knob`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.settings-toggle-knob-active`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.sidebar-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-badge`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-badge-arquivada`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-badge-ativa`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-badge-cheia`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-badge-dono`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-badge-mod`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-badge-online`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-badge-vip`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-brand`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-btn-danger`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-bubble-received`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-bubble-sent`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-card`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-icon-btn`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-input`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-label`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-link`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-loading-highlight`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-loading-icon`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-loading-orb`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-loading-orb-shell`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-loading-page`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-loading-page-chat`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-loading-panel`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-loading-progress`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-loading-progress-fill`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-loading-spinner`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-loading-subtitle`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-loading-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-modal-overlay`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-muted`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-nav`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-panel`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-progress-fill`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-progress-track`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-section-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-sidebar`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-sidebar-left`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-sidebar-right`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-status-offline`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-status-online`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-subtitle`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-tooltip`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-tooltip-arrow`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-tooltip-content`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.skeuo-topbar`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-badge-blue`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-badge-gray`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-banned-item`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-blue-title`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-border-bottom`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-border-top`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-bottom-panel`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-btn-text`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-category-card`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-faq-active-text`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-faq-content`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-faq-header`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-faq-item`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-footer-border`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-footer-link`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-icon-blue`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-icon-box`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-icon-cyan`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-icon-emerald`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-icon-gray`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-icon-indigo`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-icon-red`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-icon-rose`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-icon-teal`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-page-bg`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-search-container`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-search-icon`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-search-input`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-stats-blue`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-stats-emerald`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-status-box`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-status-dot`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.suporte-text-muted`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.text-gray-500`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.text-gray-600`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.text-green-700`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.ticks`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.vite`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.webchat-avatar-frame`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.webchat-avatar-inner`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.webchat-message-in`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.webchat-message-out`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.

### `.webchat-sidebar-item`
- **Uso Recomendado**: Aplicar em elementos que necessitam deste acabamento específico.
- **Descrição**: Classe extraída dos arquivos CSS principais.



---

## 🛠️ 4. Utilitários Tailwind CSS Mapeados

Durante a auditoria de 27 arquivos JSX, detectamos 950 classes utilitárias do Tailwind CSS. 
Abaixo está o inventário agrupado por ordem alfabética, útil para rastrear padrões e manter consistência e evitar repetição.

### Prefixo: `!text`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `!text-red-600` |  |

### Prefixo: ``
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `-bottom-[10%]` |  |
| `-left-[10%]` |  |
| `-mr-1.5` |  |
| `-mr-10` |  |
| `-mt-10` |  |
| `-right-[10%]` |  |
| `-rotate-12` |  |
| `-top-[10%]` |  |
| `-translate-x-1/2` |  |
| `-translate-x-2` |  |
| `-translate-y-1/2` |  |

### Prefixo: `2xl:flex`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `2xl:flex-row` |  |

### Prefixo: `2xl:items`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `2xl:items-center` |  |

### Prefixo: `2xl:justify`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `2xl:justify-end` |  |

### Prefixo: `2xl:w`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `2xl:w-auto` |  |

### Prefixo: `===`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `===` |  |

### Prefixo: `about`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `about-action-btn` |  |
| `about-action-secondary` |  |
| `about-actions` |  |
| `about-badge` |  |
| `about-bg-orb-bottom` |  |
| `about-bg-orb-top` |  |
| `about-chat-body` |  |
| `about-chat-input` |  |
| `about-chat-inputbar` |  |
| `about-chat-online-row` |  |
| `about-chat-pattern` |  |
| `about-chat-room-icon` |  |
| `about-chat-room-title` |  |
| `about-chat-status-dot` |  |
| `about-chat-status-text` |  |
| `about-chat-topbar` |  |
| `about-chat-window` |  |
| `about-cta` |  |
| `about-cta-bottom-glow` |  |
| `about-cta-button` |  |
| `about-cta-glow` |  |
| `about-cta-icon` |  |
| `about-cta-line` |  |
| `about-cta-section` |  |
| `about-cta-subtitle` |  |
| `about-cta-title` |  |
| `about-hero-content` |  |
| `about-hero-description` |  |
| `about-hero-highlight` |  |
| `about-hero-panel` |  |
| `about-hero-title` |  |
| `about-info-description` |  |
| `about-info-grid` |  |
| `about-info-icon` |  |
| `about-info-title` |  |
| `about-message-incoming` |  |
| `about-message-outgoing` |  |
| `about-message-time` |  |
| `about-page` |  |
| `about-preview` |  |
| `about-preview-glow` |  |
| `about-section` |  |
| `about-section-heading` |  |
| `about-section-heading-panel` |  |
| `about-section-subtitle` |  |
| `about-section-title` |  |
| `about-send-btn` |  |
| `about-typing` |  |
| `about-typing-text` |  |
| `about-window-controls` |  |
| `about-window-dot` |  |
| `about-window-dot-green` |  |
| `about-window-dot-red` |  |
| `about-window-dot-yellow` |  |

### Prefixo: `absolute`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `absolute` |  |

### Prefixo: `active:bg`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `active:bg-black/5` |  |

### Prefixo: `activeTab`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `activeTab` |  |

### Prefixo: `admin`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `admin-avatar-bg` |  |
| `admin-badge-global` |  |
| `admin-badge-trend-up` |  |
| `admin-border-muted` |  |
| `admin-bottom-bar` |  |
| `admin-btn-blue-outline` |  |
| `admin-btn-danger-outline` |  |
| `admin-btn-purple-outline` |  |
| `admin-card-glow-blue` |  |
| `admin-card-glow-green` |  |
| `admin-card-glow-purple` |  |
| `admin-card-glow-red` |  |
| `admin-details-box` |  |
| `admin-empty-icon-bg` |  |
| `admin-hero-title` |  |
| `admin-icon-box-blue` |  |
| `admin-icon-box-purple` |  |
| `admin-icon-box-red` |  |
| `admin-icon-wrap-blue` |  |
| `admin-icon-wrap-green` |  |
| `admin-icon-wrap-purple` |  |
| `admin-icon-wrap-red` |  |
| `admin-media-empty` |  |
| `admin-media-main` |  |
| `admin-modal-overlay` |  |
| `admin-modal-overlay-dark` |  |
| `admin-modal-panel` |  |
| `admin-msg-box` |  |
| `admin-page-bg` |  |
| `admin-quick-action` |  |
| `admin-select-bg` |  |
| `admin-status-pending` |  |
| `admin-table-header` |  |
| `admin-table-text` |  |
| `admin-text-muted` |  |

### Prefixo: `animate`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `animate-chat-panel-main` |  |
| `animate-chat-shell` |  |
| `animate-fade-in` |  |
| `animate-fade-in-up` |  |
| `animate-fade-in-up-1` |  |
| `animate-fade-in-up-2` |  |
| `animate-fade-in-up-3` |  |
| `animate-fade-in-up-4` |  |
| `animate-fade-in-up-5` |  |
| `animate-loading-orb` |  |
| `animate-loading-panel` |  |
| `animate-loading-shine` |  |
| `animate-pulse` |  |
| `animate-spin` |  |

### Prefixo: `app`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `app-footer` |  |
| `app-footer-link` |  |
| `app-footer-links-container` |  |
| `app-footer-separator` |  |
| `app-footer-text` |  |

### Prefixo: `appearance`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `appearance-none` |  |

### Prefixo: `auth`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `auth-divider` |  |
| `auth-divider-line` |  |
| `auth-divider-text` |  |
| `auth-error` |  |
| `auth-footer` |  |
| `auth-form` |  |
| `auth-form-login` |  |
| `auth-form-register` |  |
| `auth-icon` |  |
| `auth-input` |  |
| `auth-link` |  |
| `auth-page` |  |
| `auth-page-register` |  |
| `auth-panel` |  |
| `auth-panel-login` |  |
| `auth-panel-register` |  |
| `auth-secondary-btn` |  |
| `auth-submit` |  |
| `auth-submit-login` |  |
| `auth-submit-register` |  |
| `auth-subtitle` |  |
| `auth-title` |  |

### Prefixo: `avatar`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `avatar-image` |  |

### Prefixo: `backdrop`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `backdrop-blur-sm` |  |

### Prefixo: `bg`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `bg-[#0ea5e9]` |  |
| `bg-black/40` |  |
| `bg-red-500` |  |
| `bg-red-500/10` |  |
| `bg-white` |  |

### Prefixo: `block`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `block` |  |

### Prefixo: `blur`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `blur-2xl` |  |

### Prefixo: `border`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `border` |  |
| `border-[#0071e3]` |  |
| `border-[#c7c7cc]` |  |
| `border-[2px]` |  |
| `border-b` |  |
| `border-collapse` |  |
| `border-l-4` |  |
| `border-red-500/20` |  |
| `border-t` |  |

### Prefixo: `bottom`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `bottom-0` |  |
| `bottom-6` |  |
| `bottom-[88px]` |  |

### Prefixo: `break`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `break-words` |  |

### Prefixo: `btn`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `btn-secondary-glossy` |  |
| `btn-white-glossy` |  |

### Prefixo: `capitalize`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `capitalize` |  |

### Prefixo: `chat`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `chat-confirm-actions` |  |
| `chat-confirm-cancel-btn` |  |
| `chat-container` |  |
| `chat-error-desc` |  |
| `chat-error-icon` |  |
| `chat-error-icon-gray` |  |
| `chat-error-icon-red` |  |
| `chat-error-title` |  |
| `chat-header` |  |
| `chat-header-actions` |  |
| `chat-header-btn` |  |
| `chat-header-btn-exit` |  |
| `chat-header-divider` |  |
| `chat-header-icon` |  |
| `chat-header-info` |  |
| `chat-header-online` |  |
| `chat-header-online-dot` |  |
| `chat-header-subtitle` |  |
| `chat-header-title` |  |
| `chat-header-title-wrapper` |  |
| `chat-image-lightbox` |  |
| `chat-image-lightbox-close` |  |
| `chat-image-lightbox-image` |  |
| `chat-input-attach-btn` |  |
| `chat-input-cancel-edit-btn` |  |
| `chat-input-editing-bar` |  |
| `chat-input-field` |  |
| `chat-input-footer` |  |
| `chat-input-form` |  |
| `chat-input-panel` |  |
| `chat-input-preview-image` |  |
| `chat-input-preview-remove` |  |
| `chat-input-send-btn` |  |
| `chat-main` |  |
| `chat-message-enter` |  |
| `chat-messages-area` |  |
| `chat-messages-empty` |  |
| `chat-messages-empty-desc` |  |
| `chat-messages-empty-fav` |  |
| `chat-messages-empty-icon` |  |
| `chat-messages-empty-title` |  |
| `chat-pinned-author` |  |
| `chat-pinned-close` |  |
| `chat-pinned-content` |  |
| `chat-pinned-header` |  |
| `chat-pinned-icon` |  |
| `chat-pinned-message` |  |
| `chat-pinned-text` |  |
| `chat-pinned-wrapper` |  |
| `chat-search-clear-btn` |  |
| `chat-search-close-btn` |  |
| `chat-search-empty` |  |
| `chat-search-error` |  |
| `chat-search-icon` |  |
| `chat-search-inner` |  |
| `chat-search-input` |  |
| `chat-search-input-wrapper` |  |
| `chat-search-nav-btn` |  |
| `chat-search-navigation` |  |
| `chat-search-result-count` |  |
| `chat-search-results` |  |
| `chat-shell` |  |
| `chat-sidebar-footer` |  |
| `chat-sidebar-item` |  |
| `chat-sidebar-item-disabled` |  |
| `chat-sidebar-item-icon` |  |
| `chat-sidebar-item-label` |  |
| `chat-sidebar-list` |  |
| `chat-sidebar-profile` |  |
| `chat-sidebar-profile-name` |  |
| `chat-sidebar-profile-status-row` |  |
| `chat-sidebar-status-dot` |  |
| `chat-sidebar-status-text` |  |
| `chat-state-btn` |  |
| `chat-state-page` |  |
| `chat-state-panel` |  |
| `chat-user-modal-avatar` |  |
| `chat-user-modal-backdrop` |  |
| `chat-user-modal-disabled-action` |  |
| `chat-user-modal-enter` |  |
| `chat-user-modal-name` |  |
| `chat-user-modal-private-btn` |  |
| `chat-user-modal-report-btn` |  |
| `chat-user-modal-role-badge` |  |
| `chat-user-modal-role-badge-mod` |  |
| `chat-user-modal-role-badge-owner` |  |
| `chat-user-modal-role-label` |  |
| `chat-user-modal-role-panel` |  |
| `chat-user-modal-select` |  |
| `chat-user-modal-status` |  |

### Prefixo: `checked:bg`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `checked:bg-[#0071e3]` |  |

### Prefixo: `checked:border`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `checked:border-[#0071e3]` |  |

### Prefixo: `cursor`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `cursor-not-allowed` |  |
| `cursor-pointer` |  |

### Prefixo: `custom`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `custom-avatar-overlay` |  |
| `custom-form` |  |
| `custom-input` |  |
| `custom-label` |  |
| `custom-link` |  |
| `custom-online-dot` |  |
| `custom-online-text` |  |
| `custom-page` |  |
| `custom-panel` |  |
| `custom-preview-card` |  |
| `custom-preview-name` |  |
| `custom-preview-status` |  |
| `custom-preview-subtitle` |  |
| `custom-preview-title` |  |
| `custom-subtitle` |  |
| `custom-title` |  |
| `custom-toast` |  |
| `custom-toast-icon` |  |
| `custom-toast-text` |  |

### Prefixo: `dark:active:bg`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `dark:active:bg-white/5` |  |

### Prefixo: `dark:bg`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `dark:bg-[#1c1c1e]` |  |

### Prefixo: `dark:border`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `dark:border-[#38383a]` |  |

### Prefixo: `dark:group`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `dark:group-hover:text-white` |  |

### Prefixo: `dark:hover:text`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `dark:hover:text-gray-200` |  |

### Prefixo: `dark:text`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `dark:text-[#94a3b8]` |  |
| `dark:text-[#f8fafc]` |  |
| `dark:text-gray-200` |  |
| `dark:text-gray-300` |  |
| `dark:text-gray-500` |  |
| `dark:text-slate-400` |  |

### Prefixo: `drop`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `drop-shadow-sm` |  |

### Prefixo: `duration`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `duration-500` |  |

### Prefixo: `feedback`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `feedback-file-chip` |  |
| `feedback-file-remove` |  |
| `feedback-hero-title` |  |
| `feedback-label` |  |
| `feedback-subtitle` |  |
| `feedback-success-desc` |  |
| `feedback-success-icon` |  |
| `feedback-success-overlay` |  |
| `feedback-success-title` |  |
| `feedback-type-desc` |  |
| `feedback-type-title` |  |
| `feedback-upload-area` |  |
| `feedback-upload-icon` |  |
| `feedback-upload-icon-wrap` |  |
| `feedback-upload-title` |  |

### Prefixo: `fixed`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `fixed` |  |

### Prefixo: `flex`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `flex` |  |
| `flex-1` |  |
| `flex-col` |  |
| `flex-grow` |  |
| `flex-shrink-0` |  |
| `flex-wrap` |  |

### Prefixo: `focus:outline`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `focus:outline-none` |  |

### Prefixo: `font`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `font-bold` |  |
| `font-medium` |  |
| `font-semibold` |  |

### Prefixo: `gap`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `gap-0.5` |  |
| `gap-1` |  |
| `gap-1.5` |  |
| `gap-12` |  |
| `gap-2` |  |
| `gap-3` |  |
| `gap-4` |  |
| `gap-6` |  |
| `gap-8` |  |

### Prefixo: `grid`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `grid` |  |
| `grid-cols-1` |  |
| `grid-cols-2` |  |

### Prefixo: `group`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `group` |  |
| `group-hover:scale-105` |  |
| `group-hover:text-[#1d1d1f]` |  |

### Prefixo: `group/msg`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `group/msg` |  |

### Prefixo: `h`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `h-1` |  |
| `h-1.5` |  |
| `h-10` |  |
| `h-12` |  |
| `h-16` |  |
| `h-2` |  |
| `h-2.5` |  |
| `h-20` |  |
| `h-3` |  |
| `h-32` |  |
| `h-4` |  |
| `h-5` |  |
| `h-6` |  |
| `h-8` |  |
| `h-9` |  |
| `h-[1px]` |  |
| `h-[2px]` |  |
| `h-[40%]` |  |
| `h-[40vh]` |  |
| `h-[48px]` |  |
| `h-[50%]` |  |
| `h-[50px]` |  |
| `h-[50vh]` |  |
| `h-fit` |  |
| `h-full` |  |

### Prefixo: `hero`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `hero-title` |  |

### Prefixo: `hidden`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `hidden` |  |

### Prefixo: `home`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `home-action-btn` |  |
| `home-actions` |  |
| `home-actions-single` |  |
| `home-hero-panel` |  |
| `home-hero-subtitle` |  |
| `home-hero-title` |  |
| `home-page` |  |

### Prefixo: `hover:bg`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `hover:bg-gray-100` |  |

### Prefixo: `hover:scale`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `hover:scale-[1.02]` |  |

### Prefixo: `hover:text`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `hover:text-[#0071e3]` |  |
| `hover:text-gray-600` |  |
| `hover:text-gray-700` |  |
| `hover:text-rose-500` |  |

### Prefixo: `hover:underline`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `hover:underline` |  |

### Prefixo: `inline`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `inline-block` |  |
| `inline-flex` |  |

### Prefixo: `input`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `input-group` |  |

### Prefixo: `inset`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `inset-0` |  |

### Prefixo: `italic`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `italic` |  |

### Prefixo: `items`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `items-center` |  |
| `items-end` |  |
| `items-start` |  |

### Prefixo: `justify`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `justify-between` |  |
| `justify-center` |  |
| `justify-end` |  |
| `justify-start` |  |

### Prefixo: `leading`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `leading-[1.25]` |  |
| `leading-[1.375]` |  |
| `leading-none` |  |
| `leading-relaxed` |  |
| `leading-snug` |  |
| `leading-tight` |  |

### Prefixo: `left`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `left-0` |  |
| `left-1/2` |  |
| `left-3` |  |
| `left-6` |  |

### Prefixo: `lg:col`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `lg:col-span-4` |  |
| `lg:col-span-8` |  |

### Prefixo: `lg:flex`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `lg:flex-none` |  |
| `lg:flex-row` |  |

### Prefixo: `lg:gap`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `lg:gap-16` |  |

### Prefixo: `lg:grid`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `lg:grid-cols-12` |  |
| `lg:grid-cols-3` |  |
| `lg:grid-cols-4` |  |
| `lg:grid-cols-[1fr_350px]` |  |

### Prefixo: `lg:hidden`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `lg:hidden` |  |

### Prefixo: `lg:mx`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `lg:mx-0` |  |

### Prefixo: `lg:w`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `lg:w-auto` |  |

### Prefixo: `m`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `m-[3px]` |  |

### Prefixo: `max`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `max-h-[300px]` |  |
| `max-h-[90vh]` |  |
| `max-h-full` |  |
| `max-w-2xl` |  |
| `max-w-4xl` |  |
| `max-w-[1000px]` |  |
| `max-w-[1100px]` |  |
| `max-w-[1200px]` |  |
| `max-w-[150px]` |  |
| `max-w-[240px]` |  |
| `max-w-[300px]` |  |
| `max-w-[350px]` |  |
| `max-w-[400px]` |  |
| `max-w-[420px]` |  |
| `max-w-[450px]` |  |
| `max-w-[500px]` |  |
| `max-w-[560px]` |  |
| `max-w-[600px]` |  |
| `max-w-[80%]` |  |
| `max-w-[85%]` |  |
| `max-w-[90vw]` |  |
| `max-w-[980px]` |  |
| `max-w-full` |  |
| `max-w-lg` |  |
| `max-w-md` |  |

### Prefixo: `mb`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `mb-0` |  |
| `mb-0.5` |  |
| `mb-1` |  |
| `mb-10` |  |
| `mb-12` |  |
| `mb-2` |  |
| `mb-24` |  |
| `mb-3` |  |
| `mb-4` |  |
| `mb-5` |  |
| `mb-6` |  |
| `mb-8` |  |

### Prefixo: `md:col`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `md:col-span-4` |  |
| `md:col-span-8` |  |

### Prefixo: `md:flex`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `md:flex-row` |  |

### Prefixo: `md:gap`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `md:gap-4` |  |

### Prefixo: `md:grid`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `md:grid-cols-12` |  |
| `md:grid-cols-2` |  |
| `md:grid-cols-3` |  |
| `md:grid-cols-4` |  |

### Prefixo: `md:h`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `md:h-24` |  |

### Prefixo: `md:items`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `md:items-center` |  |
| `md:items-end` |  |

### Prefixo: `md:left`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `md:left-auto` |  |

### Prefixo: `md:max`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `md:max-w-[600px]` |  |

### Prefixo: `md:p`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `md:p-10` |  |
| `md:p-12` |  |
| `md:p-16` |  |
| `md:p-6` |  |
| `md:p-8` |  |

### Prefixo: `md:px`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `md:px-6` |  |
| `md:px-8` |  |

### Prefixo: `md:py`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `md:py-10` |  |
| `md:py-12` |  |
| `md:py-20` |  |
| `md:py-6` |  |

### Prefixo: `md:right`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `md:right-6` |  |

### Prefixo: `md:text`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `md:text-3xl` |  |
| `md:text-4xl` |  |
| `md:text-5xl` |  |
| `md:text-[24px]` |  |
| `md:text-[32px]` |  |
| `md:text-[36px]` |  |
| `md:text-[44px]` |  |
| `md:text-[50px]` |  |
| `md:text-[70px]` |  |
| `md:text-[88px]` |  |
| `md:text-base` |  |

### Prefixo: `md:w`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `md:w-24` |  |
| `md:w-64` |  |
| `md:w-[280px]` |  |
| `md:w-[400px]` |  |

### Prefixo: `member`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `member-info` |  |
| `member-item` |  |
| `member-name` |  |
| `member-role` |  |
| `member-role-[role]` |  |
| `member-role-admin` |  |
| `member-role-moderator` |  |
| `member-role-owner` |  |
| `member-status-text` |  |

### Prefixo: `members`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `members-list` |  |
| `members-list-offline` |  |
| `members-sidebar-empty` |  |
| `members-sidebar-error` |  |
| `members-sidebar-header` |  |
| `members-sidebar-header-offline` |  |

### Prefixo: `message`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `message-avatar-interactive` |  |
| `message-bubble-actions` |  |
| `message-bubble-actions-other` |  |
| `message-bubble-actions-own` |  |
| `message-bubble-author` |  |
| `message-bubble-footer` |  |
| `message-bubble-footer-other` |  |
| `message-bubble-footer-own` |  |
| `message-bubble-image` |  |
| `message-bubble-menu-divider` |  |
| `message-bubble-menu-item` |  |
| `message-bubble-menu-item-danger` |  |
| `message-bubble-menu-item-edit` |  |
| `message-bubble-more-btn` |  |
| `message-bubble-row` |  |
| `message-bubble-row-other` |  |
| `message-bubble-row-own` |  |
| `message-bubble-text` |  |
| `message-bubble-time` |  |
| `message-bubble-wrapper` |  |
| `message-bubble-wrapper-other` |  |
| `message-bubble-wrapper-own` |  |
| `message-edit-menu-icon` |  |
| `message-read-indicator` |  |
| `message-role-badge` |  |
| `message-role-badge-mod` |  |
| `message-role-badge-owner` |  |

### Prefixo: `min`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `min-h-[140px]` |  |
| `min-h-[200px]` |  |
| `min-h-[250px]` |  |
| `min-h-[300px]` |  |
| `min-h-[48px]` |  |
| `min-h-[50vh]` |  |
| `min-h-[80px]` |  |
| `min-h-screen` |  |
| `min-w-0` |  |
| `min-w-[160px]` |  |
| `min-w-[600px]` |  |

### Prefixo: `ml`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `ml-0.5` |  |
| `ml-1` |  |
| `ml-2` |  |
| `ml-[-2px]` |  |
| `ml-auto` |  |

### Prefixo: `mt`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `mt-0.5` |  |
| `mt-1` |  |
| `mt-10` |  |
| `mt-2` |  |
| `mt-3` |  |
| `mt-4` |  |
| `mt-6` |  |
| `mt-8` |  |
| `mt-[2px]` |  |
| `mt-auto` |  |

### Prefixo: `mx`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `mx-auto` |  |

### Prefixo: `navbar`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `navbar-dropdown-icon` |  |
| `navbar-dropdown-icon-danger` |  |
| `navbar-dropdown-item` |  |
| `navbar-dropdown-item-bordered` |  |
| `navbar-dropdown-item-danger` |  |
| `navbar-dropdown-item-disabled` |  |
| `navbar-dropdown-list` |  |
| `navbar-profile-card` |  |
| `navbar-profile-desc` |  |
| `navbar-profile-edit-btn` |  |
| `navbar-profile-footer` |  |
| `navbar-profile-info` |  |
| `navbar-profile-name` |  |
| `navbar-profile-status` |  |
| `navbar-profile-title` |  |
| `navbar-profile-trigger` |  |
| `navbar-settings-close-btn` |  |
| `navbar-settings-close-icon` |  |
| `navbar-settings-color-dot` |  |
| `navbar-settings-color-grid` |  |
| `navbar-settings-content` |  |
| `navbar-settings-footer` |  |
| `navbar-settings-header` |  |
| `navbar-settings-label` |  |
| `navbar-settings-option-desc` |  |
| `navbar-settings-option-text` |  |
| `navbar-settings-option-title` |  |
| `navbar-settings-options` |  |
| `navbar-settings-radio` |  |
| `navbar-settings-save-btn` |  |
| `navbar-settings-section` |  |
| `navbar-settings-title` |  |

### Prefixo: `not`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `not-found-actions` |  |
| `not-found-btn` |  |
| `not-found-code` |  |
| `not-found-desc` |  |
| `not-found-icon` |  |
| `not-found-note` |  |
| `not-found-orb` |  |
| `not-found-page` |  |
| `not-found-panel` |  |
| `not-found-title` |  |

### Prefixo: `object`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `object-contain` |  |
| `object-cover` |  |

### Prefixo: `opacity`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `opacity-50` |  |
| `opacity-70` |  |

### Prefixo: `overflow`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `overflow-hidden` |  |
| `overflow-x-auto` |  |
| `overflow-y-auto` |  |

### Prefixo: `p`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `p-0` |  |
| `p-0.5` |  |
| `p-1` |  |
| `p-1.5` |  |
| `p-10` |  |
| `p-12` |  |
| `p-2` |  |
| `p-2.5` |  |
| `p-3` |  |
| `p-3.5` |  |
| `p-4` |  |
| `p-5` |  |
| `p-6` |  |
| `p-8` |  |

### Prefixo: `pb`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `pb-3` |  |
| `pb-4` |  |

### Prefixo: `pinned`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `pinned-title` |  |

### Prefixo: `pl`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `pl-10` |  |
| `pl-8` |  |

### Prefixo: `pointer`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `pointer-events-none` |  |

### Prefixo: `pr`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `pr-2` |  |
| `pr-4` |  |
| `pr-6` |  |
| `pr-8` |  |

### Prefixo: `pt`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `pt-2` |  |
| `pt-3` |  |
| `pt-4` |  |
| `pt-5` |  |
| `pt-6` |  |

### Prefixo: `px`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `px-0` |  |
| `px-1` |  |
| `px-1.5` |  |
| `px-10` |  |
| `px-2` |  |
| `px-2.5` |  |
| `px-3` |  |
| `px-4` |  |
| `px-5` |  |
| `px-6` |  |
| `px-8` |  |

### Prefixo: `py`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `py-0.5` |  |
| `py-1` |  |
| `py-1.5` |  |
| `py-12` |  |
| `py-16` |  |
| `py-2` |  |
| `py-2.5` |  |
| `py-3` |  |
| `py-4` |  |
| `py-6` |  |
| `py-8` |  |
| `py-[1px]` |  |

### Prefixo: `relative`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `relative` |  |

### Prefixo: `resize`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `resize-none` |  |
| `resize-y` |  |

### Prefixo: `reveal`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `reveal` |  |

### Prefixo: `right`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `right-0` |  |
| `right-2` |  |
| `right-3` |  |
| `right-4` |  |
| `right-6` |  |

### Prefixo: `rooms`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `rooms-action-btn` |  |
| `rooms-badge` |  |
| `rooms-badge-active` |  |
| `rooms-badge-archived` |  |
| `rooms-badge-dot` |  |
| `rooms-badge-dot-active` |  |
| `rooms-badge-dot-archived` |  |
| `rooms-badge-dot-full` |  |
| `rooms-badge-full` |  |
| `rooms-create-room-btn` |  |
| `rooms-empty` |  |
| `rooms-error-desc` |  |
| `rooms-error-icon` |  |
| `rooms-error-panel` |  |
| `rooms-error-title` |  |
| `rooms-filter-arrow` |  |
| `rooms-filter-icon` |  |
| `rooms-filter-select` |  |
| `rooms-filter-wrapper` |  |
| `rooms-full-btn` |  |
| `rooms-header` |  |
| `rooms-header-content` |  |
| `rooms-icon-tile` |  |
| `rooms-join-btn` |  |
| `rooms-label` |  |
| `rooms-list-header` |  |
| `rooms-list-panel` |  |
| `rooms-list-title` |  |
| `rooms-modal-actions` |  |
| `rooms-modal-btn` |  |
| `rooms-modal-btn-submit` |  |
| `rooms-modal-input` |  |
| `rooms-modal-panel` |  |
| `rooms-modal-select` |  |
| `rooms-modal-title` |  |
| `rooms-page` |  |
| `rooms-page-error` |  |
| `rooms-pagination` |  |
| `rooms-pagination-actions` |  |
| `rooms-pagination-btn` |  |
| `rooms-pagination-btn-active` |  |
| `rooms-retry-btn` |  |
| `rooms-row-category` |  |
| `rooms-row-date` |  |
| `rooms-row-members` |  |
| `rooms-row-title` |  |
| `rooms-search-icon` |  |
| `rooms-search-input` |  |
| `rooms-search-wrapper` |  |
| `rooms-stat-card` |  |
| `rooms-stat-muted` |  |
| `rooms-stat-positive` |  |
| `rooms-stat-subtext` |  |
| `rooms-stat-title` |  |
| `rooms-stat-value` |  |
| `rooms-stats-grid` |  |
| `rooms-subtitle` |  |
| `rooms-table` |  |
| `rooms-table-header-row` |  |
| `rooms-table-row` |  |
| `rooms-table-td` |  |
| `rooms-table-th` |  |
| `rooms-table-wrapper` |  |
| `rooms-title` |  |
| `rooms-toolbar` |  |
| `rooms-tooltip` |  |
| `rooms-tooltip-arrow` |  |
| `rooms-tooltip-content` |  |

### Prefixo: `rounded`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `rounded` |  |
| `rounded-2xl` |  |
| `rounded-[10px]` |  |
| `rounded-[12px]` |  |
| `rounded-full` |  |
| `rounded-lg` |  |
| `rounded-md` |  |
| `rounded-xl` |  |

### Prefixo: `scale`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `scale-100` |  |
| `scale-[1.05]` |  |

### Prefixo: `searchOpen`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `searchOpen` |  |

### Prefixo: `self`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `self-end` |  |
| `self-start` |  |

### Prefixo: `settings`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `settings-badge-icon` |  |
| `settings-badge-text` |  |
| `settings-badge-top` |  |
| `settings-icon-box-blue` |  |
| `settings-icon-box-cyan` |  |
| `settings-icon-box-gray` |  |
| `settings-icon-box-rose` |  |
| `settings-page-bg` |  |
| `settings-preview-area` |  |
| `settings-preview-icon-dark` |  |
| `settings-preview-icon-light` |  |
| `settings-section-title` |  |
| `settings-text-muted` |  |
| `settings-theme-preview-dark` |  |
| `settings-theme-preview-light` |  |
| `settings-toggle-bg` |  |
| `settings-toggle-bg-active` |  |
| `settings-toggle-knob` |  |
| `settings-toggle-knob-active` |  |

### Prefixo: `shadow`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `shadow-2xl` |  |
| `shadow-inner` |  |

### Prefixo: `showFavoritesOnly`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `showFavoritesOnly` |  |

### Prefixo: `shrink`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `shrink-0` |  |

### Prefixo: `sidebar`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `sidebar-title` |  |

### Prefixo: `skeuo`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `skeuo-btn` |  |
| `skeuo-card` |  |
| `skeuo-input` |  |
| `skeuo-loading-highlight` |  |
| `skeuo-loading-icon` |  |
| `skeuo-loading-orb` |  |
| `skeuo-loading-orb-shell` |  |
| `skeuo-loading-panel` |  |
| `skeuo-loading-progress` |  |
| `skeuo-loading-progress-fill` |  |
| `skeuo-loading-spinner` |  |
| `skeuo-loading-subtitle` |  |
| `skeuo-loading-title` |  |
| `skeuo-modal-overlay` |  |
| `skeuo-nav` |  |
| `skeuo-panel` |  |
| `skeuo-progress-fill` |  |
| `skeuo-progress-track` |  |
| `skeuo-subtitle` |  |
| `skeuo-tooltip` |  |
| `skeuo-tooltip-arrow` |  |
| `skeuo-tooltip-content` |  |

### Prefixo: `sm:flex`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `sm:flex` |  |
| `sm:flex-row` |  |

### Prefixo: `sm:gap`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `sm:gap-2` |  |

### Prefixo: `sm:grid`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `sm:grid-cols-2` |  |
| `sm:grid-cols-3` |  |

### Prefixo: `sm:items`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `sm:items-center` |  |

### Prefixo: `sm:p`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `sm:p-8` |  |

### Prefixo: `sm:px`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `sm:px-6` |  |

### Prefixo: `sm:py`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `sm:py-2` |  |

### Prefixo: `sm:text`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `sm:text-right` |  |

### Prefixo: `sm:w`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `sm:w-[220px]` |  |
| `sm:w-auto` |  |

### Prefixo: `space`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `space-y-0.5` |  |
| `space-y-1` |  |
| `space-y-2` |  |
| `space-y-4` |  |
| `space-y-6` |  |
| `space-y-8` |  |

### Prefixo: `sticky`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `sticky` |  |

### Prefixo: `suporte`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `suporte-badge-blue` |  |
| `suporte-badge-gray` |  |
| `suporte-banned-item` |  |
| `suporte-blue-title` |  |
| `suporte-border-bottom` |  |
| `suporte-border-top` |  |
| `suporte-bottom-panel` |  |
| `suporte-btn-text` |  |
| `suporte-category-card` |  |
| `suporte-faq-active-text` |  |
| `suporte-faq-content` |  |
| `suporte-faq-header` |  |
| `suporte-faq-item` |  |
| `suporte-icon-blue` |  |
| `suporte-icon-box` |  |
| `suporte-icon-cyan` |  |
| `suporte-icon-emerald` |  |
| `suporte-icon-gray` |  |
| `suporte-icon-indigo` |  |
| `suporte-icon-red` |  |
| `suporte-icon-rose` |  |
| `suporte-icon-teal` |  |
| `suporte-page-bg` |  |
| `suporte-search-container` |  |
| `suporte-search-icon` |  |
| `suporte-search-input` |  |
| `suporte-stats-blue` |  |
| `suporte-stats-emerald` |  |
| `suporte-status-box` |  |
| `suporte-status-dot` |  |
| `suporte-text-muted` |  |

### Prefixo: `tab.id`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `tab.id` |  |

### Prefixo: `text`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `text-2xl` |  |
| `text-3xl` |  |
| `text-4xl` |  |
| `text-[#0071e3]` |  |
| `text-[#0071e3]/60` |  |
| `text-[#0ea5e9]` |  |
| `text-[#1d1d1f]` |  |
| `text-[#86868b]` |  |
| `text-[10px]` |  |
| `text-[11.5px]` |  |
| `text-[11px]` |  |
| `text-[12.5px]` |  |
| `text-[12px]` |  |
| `text-[13px]` |  |
| `text-[14px]` |  |
| `text-[15px]` |  |
| `text-[16px]` |  |
| `text-[17px]` |  |
| `text-[18px]` |  |
| `text-[20px]` |  |
| `text-[21px]` |  |
| `text-[22px]` |  |
| `text-[28px]` |  |
| `text-[32px]` |  |
| `text-[36px]` |  |
| `text-[40px]` |  |
| `text-[56px]` |  |
| `text-[72px]` |  |
| `text-[8px]` |  |
| `text-[9px]` |  |
| `text-base` |  |
| `text-blue-500` |  |
| `text-center` |  |
| `text-gray-400` |  |
| `text-gray-500` |  |
| `text-gray-600` |  |
| `text-gray-800` |  |
| `text-left` |  |
| `text-lg` |  |
| `text-purple-500` |  |
| `text-red-500` |  |
| `text-red-600` |  |
| `text-right` |  |
| `text-shadow-sm` |  |
| `text-sm` |  |
| `text-white` |  |
| `text-xl` |  |
| `text-xs` |  |

### Prefixo: `top`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `top-0` |  |
| `top-1/2` |  |
| `top-24` |  |
| `top-3` |  |
| `top-4` |  |
| `top-6` |  |

### Prefixo: `tracking`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `tracking-tight` |  |
| `tracking-wide` |  |
| `tracking-widest` |  |

### Prefixo: `transform`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `transform` |  |

### Prefixo: `transition`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `transition-all` |  |
| `transition-colors` |  |
| `transition-transform` |  |

### Prefixo: `truncate`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `truncate` |  |

### Prefixo: `uppercase`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `uppercase` |  |

### Prefixo: `variant`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `variant` |  |

### Prefixo: `w`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `w-1.5` |  |
| `w-10` |  |
| `w-11` |  |
| `w-12` |  |
| `w-16` |  |
| `w-2` |  |
| `w-2.5` |  |
| `w-20` |  |
| `w-3` |  |
| `w-32` |  |
| `w-4` |  |
| `w-5` |  |
| `w-6` |  |
| `w-8` |  |
| `w-80` |  |
| `w-9` |  |
| `w-[240px]` |  |
| `w-[40%]` |  |
| `w-[50%]` |  |
| `w-fit` |  |
| `w-full` |  |
| `w-max` |  |

### Prefixo: `webchat`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `webchat-avatar-inner` |  |

### Prefixo: `whitespace`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `whitespace-nowrap` |  |
| `whitespace-pre-wrap` |  |

### Prefixo: `xl:hidden`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `xl:hidden` |  |

### Prefixo: `z`
| Classe | Exemplo de Aplicação |
|--------|----------------------|
| `z-10` |  |
| `z-50` |  |
| `z-[100]` |  |
| `z-[150]` |  |
| `z-[200]` |  |
| `z-[9999]` |  |



---

## 📦 5. Anatomia dos Componentes

Nesta seção, documentamos a anatomia exata (combinação de CSS + Tailwind) dos componentes mais importantes do WebChat.

### Button (Glossy) - Variante 1
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-0">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 1
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-0">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 1
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-0">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 1
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-0">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 1
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-0">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 1
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-0">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 2
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-1">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 2
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-1">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 2
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-1">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 2
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-1">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 2
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-1">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 2
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-1">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 3
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-2">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 3
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-2">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 3
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-2">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 3
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-2">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 3
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-2">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 3
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-2">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 4
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-3">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 4
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-3">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 4
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-3">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 4
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-3">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 4
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-3">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 4
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-3">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 5
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-4">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 5
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-4">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 5
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-4">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 5
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-4">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 5
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-4">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 5
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-4">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 6
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-5">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 6
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-5">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 6
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-5">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 6
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-5">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 6
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-5">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 6
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-5">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 7
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-6">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 7
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-6">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 7
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-6">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 7
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-6">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 7
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-6">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 7
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-6">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 8
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-7">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 8
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-7">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 8
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-7">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 8
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-7">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 8
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-7">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 8
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-7">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 9
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-8">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 9
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-8">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 9
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-8">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 9
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-8">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 9
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-8">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 9
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-8">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 10
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-9">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 10
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-9">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 10
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-9">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 10
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-9">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 10
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-9">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 10
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-9">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 11
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-10">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 11
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-10">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 11
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-10">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 11
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-10">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 11
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-10">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 11
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-10">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 12
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-11">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 12
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-11">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 12
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-11">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 12
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-11">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 12
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-11">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 12
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-11">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 13
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-12">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 13
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-12">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 13
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-12">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 13
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-12">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 13
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-12">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 13
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-12">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 14
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-13">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 14
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-13">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 14
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-13">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 14
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-13">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 14
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-13">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 14
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-13">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 15
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-14">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 15
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-14">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 15
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-14">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 15
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-14">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 15
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-14">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 15
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-14">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 16
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-15">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 16
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-15">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 16
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-15">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 16
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-15">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 16
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-15">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 16
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-15">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 17
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-16">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 17
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-16">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 17
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-16">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 17
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-16">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 17
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-16">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 17
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-16">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 18
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-17">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 18
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-17">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 18
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-17">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 18
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-17">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 18
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-17">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 18
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-17">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 19
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-18">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 19
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-18">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 19
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-18">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 19
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-18">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 19
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-18">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 19
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-18">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 20
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-19">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 20
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-19">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 20
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-19">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 20
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-19">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 20
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-19">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 20
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-19">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 21
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-20">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 21
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-20">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 21
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-20">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 21
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-20">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 21
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-20">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 21
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-20">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 22
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-21">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 22
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-21">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 22
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-21">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 22
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-21">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 22
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-21">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 22
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-21">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 23
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-22">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 23
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-22">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 23
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-22">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 23
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-22">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 23
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-22">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 23
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-22">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 24
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-23">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 24
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-23">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 24
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-23">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 24
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-23">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 24
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-23">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 24
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-23">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 25
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-24">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 25
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-24">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 25
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-24">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 25
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-24">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 25
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-24">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 25
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-24">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 26
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-25">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 26
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-25">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 26
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-25">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 26
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-25">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 26
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-25">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 26
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-25">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 27
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-26">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 27
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-26">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 27
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-26">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 27
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-26">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 27
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-26">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 27
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-26">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 28
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-27">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 28
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-27">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 28
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-27">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 28
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-27">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 28
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-27">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 28
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-27">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 29
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-28">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 29
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-28">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 29
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-28">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 29
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-28">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 29
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-28">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 29
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-28">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 30
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-29">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 30
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-29">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 30
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-29">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 30
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-29">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 30
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-29">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 30
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-29">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 31
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-30">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 31
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-30">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 31
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-30">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 31
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-30">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 31
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-30">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 31
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-30">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 32
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-31">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 32
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-31">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 32
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-31">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 32
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-31">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 32
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-31">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 32
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-31">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 33
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-32">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 33
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-32">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 33
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-32">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 33
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-32">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 33
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-32">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 33
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-32">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 34
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-33">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 34
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-33">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 34
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-33">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 34
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-33">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 34
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-33">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 34
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-33">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 35
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-34">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 35
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-34">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 35
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-34">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 35
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-34">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 35
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-34">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 35
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-34">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 36
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-35">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 36
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-35">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 36
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-35">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 36
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-35">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 36
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-35">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 36
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-35">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 37
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-36">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 37
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-36">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 37
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-36">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 37
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-36">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 37
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-36">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 37
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-36">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 38
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-37">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 38
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-37">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 38
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-37">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 38
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-37">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 38
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-37">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 38
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-37">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 39
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-38">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 39
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-38">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 39
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-38">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 39
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-38">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 39
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-38">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 39
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-38">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 40
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-39">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 40
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-39">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 40
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-39">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 40
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-39">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 40
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-39">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 40
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-39">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 41
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-40">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 41
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-40">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 41
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-40">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 41
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-40">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 41
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-40">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 41
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-40">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 42
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-41">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 42
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-41">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 42
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-41">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 42
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-41">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 42
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-41">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 42
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-41">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 43
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-42">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 43
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-42">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 43
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-42">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 43
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-42">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 43
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-42">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 43
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-42">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 44
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-43">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 44
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-43">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 44
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-43">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 44
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-43">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 44
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-43">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 44
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-43">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 45
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-44">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 45
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-44">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 45
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-44">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 45
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-44">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 45
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-44">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 45
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-44">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 46
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-45">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 46
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-45">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 46
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-45">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 46
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-45">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 46
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-45">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 46
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-45">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 47
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-46">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 47
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-46">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 47
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-46">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 47
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-46">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 47
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-46">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 47
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-46">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 48
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-47">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 48
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-47">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 48
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-47">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 48
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-47">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 48
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-47">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 48
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-47">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 49
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-48">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 49
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-48">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 49
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-48">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 49
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-48">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 49
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-48">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 49
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-48">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Button (Glossy) - Variante 50
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-btn px-6 py-2 rounded-full font-bold bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg border border-blue-300 variant-49">
  Conteúdo do Button (Glossy)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Input (Inset Shadow) - Variante 50
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-input w-full px-4 py-2 rounded-lg bg-gray-50 border-t-2 border-l-2 border-gray-300 shadow-inner variant-49">
  Conteúdo do Input (Inset Shadow)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Received) - Variante 50
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-received p-3 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-800 variant-49">
  Conteúdo do Chat Bubble (Received)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Chat Bubble (Sent) - Variante 50
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-bubble-sent p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md variant-49">
  Conteúdo do Chat Bubble (Sent)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Navbar (Glass) - Variante 50
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-navbar sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm variant-49">
  Conteúdo do Navbar (Glass)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.

### Modal (Aero) - Variante 50
Para recriar este elemento, utilize a seguinte estrutura de classes:

```html
<div className="skeuo-modal bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 variant-49">
  Conteúdo do Modal (Aero)
</div>
```

**Dicas de Estilo:**
- Utilize as variáveis CSS mapeadas acima para alterar as cores de fundo dinamicamente.
- Para responsividade, prefixe as classes de margem e padding com `md:` ou `lg:`.


---
*Documento autogerado via Antigravity Ideação Automática*
*Total de Componentes catalogados e testados para o Design Skeuomorphism*
