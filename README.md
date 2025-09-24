# 💡 LightControlHub - Sistema Completo

Sistema inteligente de controle de iluminação com arquitetura avançada, histórico completo e padrões de projeto profissionais.

## 🏗️ Arquitetura do Sistema

### 📁 Estrutura de Arquivos

```
/
├── index.html                              # Landing page com autenticação
├── test-api.html                           # Sistema básico MVC
├── sistema-com-historico.html              # Sistema avançado com histórico
├── README.md                               # Esta documentação
├── 
├── api/                                    # Backend PHP
│   ├── auth.php                           # Autenticação
│   ├── config.example.php                 # Configurações
│   ├── debug.php                          # Ferramentas de debug
│   └── index.php                          # API principal
├── 
├── assets/                                # Recursos estáticos
│   ├── css/
│   │   └── main.css                       # Estilos globais
│   └── js/
│       └── app.js                         # JavaScript principal
├── 
├── controllers/                           # Camada de Controle
│   ├── AppController.js                   # Controle principal (MVC simples)
│   ├── LightController.js                 # Controle de lâmpadas (MVC simples)
│   └── LightControllerWithHistory.js      # Controle avançado (Repository Pattern)
├── 
├── models/                                # Camada de Modelo
│   ├── AuthModel.js                       # Modelo de autenticação
│   ├── EmailAuthModel.js                  # Autenticação por email
│   ├── LightModel.js                      # Modelo básico de lâmpada
│   └── MockAuthModel.js                   # Mock para testes
├── 
├── repositories/                          # Camada de Repositório
│   ├── interfaces/
│   │   └── ILightRepository.js            # Interface do repositório
│   └── FirebaseLightRepository.js         # Implementação Firebase
├── 
├── services/                             # Camada de Serviço
│   └── LightService.js                   # Lógica de negócio
└── 
└── views/                               # Camada de Visualização
    ├── about.html                       # Página sobre
    ├── contact.html                     # Página contato
    ├── AuthView.js                      # View de autenticação
    └── LightView.js                     # View de lâmpadas
```
- **Compatível IoT**: Funciona com dispositivos Arduino/ESP

## 📁 Estrutura do Projeto

```
LightControlHub-MVC/
├── models/
│   └── LightModel.js          # Modelo de dados (Firebase)
├── views/
│   ├── LightView.js           # Interface do usuário
│   ├── about.html             # Página sobre
│   └── contact.html           # Página de contato
├── controllers/
│   └── LightController.js     # Lógica de controle
├── assets/
│   ├── css/
│   │   └── main.css           # Estilos principais
│   └── js/
│       └── app.js             # Aplicação principal
├── config/
│   └── firebase.js            # Configuração Firebase
└── index.html                 # Página principal
```

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Firebase Realtime Database
- **Arquitetura**: Model-View-Controller (MVC)
- **Estilo**: CSS Grid, Flexbox, Gradientes

## 🔧 Configuração

1. **Clone o projeto**
2. **Configure a API Backend**:
   - Copie `api/config.example.php` para `api/config.php`
   - Edite `api/config.php` com suas credenciais Firebase
   - Configure o Realtime Database no Firebase
3. **Execute em servidor web** com suporte PHP
   - XAMPP, WAMP, ou servidor Apache/Nginx
   - **IMPORTANTE**: Nunca commite o arquivo `config.php`!

## 📱 Como Usar

1. Acesse a página principal
2. O sistema conecta automaticamente ao Firebase
3. Use o botão para ligar/desligar a luz
4. O estado é sincronizado em tempo real

## 🔌 Integração IoT

O sistema espera os dados no Firebase no formato:
```
devices/
  └── {deviceId}/
      └── config/
          └── led13Mode: "on" | "off"
```

## 🎨 Interface

- **Design Responsivo**: Funciona em desktop e mobile
- **Feedback Visual**: Indicadores de status em tempo real
- **Animações Suaves**: Transições elegantes
- **Notificações**: Alertas de erro e sucesso

## 🔒 Segurança

- **API Backend**: Credenciais Firebase protegidas no servidor
- **Configuração Segura**: Arquivo config.php não versionado
- **Validação**: Estados e requisições validadas
- **CORS**: Controle de origem das requisições
- **Tratamento de Erros**: Robusto e seguro

## 📈 Melhorias Implementadas

- Arquitetura MVC organizada
- Código modular e reutilizável
- Interface moderna e intuitiva
- Tratamento robusto de erros
- Responsividade completa
- Performance otimizada

## 🚀 Deploy

Para produção:
1. Configure as regras do Firebase
2. Otimize os assets
3. Configure HTTPS
4. Teste em diferentes dispositivos

---

**Desenvolvido com ❤️ para controle inteligente de iluminação**