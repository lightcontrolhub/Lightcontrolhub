# LightControlHub - MVC Version

Sistema inteligente de controle de iluminação com arquitetura MVC, desenvolvido com tecnologias web modernas e Firebase.

## 🚀 Características

- **Arquitetura MVC**: Código organizado e escalável
- **Interface Moderna**: Design responsivo e elegante
- **Tempo Real**: Sincronização instantânea via Firebase
- **Controle Remoto**: Acesse de qualquer lugar
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