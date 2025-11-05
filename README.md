# 💡 LightControlHub – MVC Version

Sistema inteligente de controle de iluminação com arquitetura **MVC**, desenvolvido com tecnologias web modernas e **Firebase**.

---

## 🚀 Características

- **Arquitetura MVC:** código organizado e escalável  
- **Interface moderna:** design responsivo e elegante  
- **Tempo real:** sincronização instantânea via Firebase  
- **Controle remoto:** acesso de qualquer lugar  
- **Compatível com IoT:** integração com dispositivos Arduino/ESP  

---

## 📁 Estrutura do Projeto

```
LightControlHub-MVC/
├── models/
│   └── LightModel.js          # Modelo de dados (Firebase)
├── views/
│   ├── LightView.js           # Interface do usuário
│   ├── about.html             # Página "Sobre"
│   └── contact.html           # Página "Contato"
├── controllers/
│   └── LightController.js     # Lógica de controle
├── assets/
│   ├── css/
│   │   └── main.css           # Estilos principais
│   └── js/
│       └── app.js             # Aplicação principal
├── config/
│   └── firebase.js            # Configuração do Firebase
└── index.html                 # Página principal
```

---

## 🛠️ Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript ES6+  
- **Backend:** Firebase Realtime Database  
- **Arquitetura:** Model–View–Controller (MVC)  
- **Estilo:** CSS Grid, Flexbox, gradientes modernos  

---

## ⚙️ Casos de Uso

### 1. Autenticação (AuthService / AuthAPI)
1. Registrar novo usuário  
2. Fazer login  
3. Enviar código de verificação  
4. Verificar código  
5. Verificar token  
6. Fazer logout  
7. Resetar senha  

### 2. Controle de Luz (LightController / LightService)
8. Ligar luz  
9. Desligar luz  
10. Verificar estado atual  
11. Monitorar mudanças de estado (polling)  

### 3. Operações com Filtros
12. Validar operação antes de executar  
13. Cachear resultados de operações  
14. Verificar autenticação para operações  
15. Registrar log de operações  

---

## 📱 Como Usar

1. Acesse a página principal  
2. O sistema conecta-se automaticamente ao Firebase  
3. Use o botão para ligar/desligar a luz  
4. O estado é sincronizado em tempo real  

---

## 🔌 Integração com IoT

O sistema espera os dados no Firebase no formato:

```
devices/
  └── {deviceId}/
      └── config/
          └── led13Mode: "on" | "off"
```

---

## 🎨 Interface

- **Design responsivo:** compatível com desktop e mobile  
- **Feedback visual:** indicadores de status em tempo real  
- **Animações suaves:** transições elegantes  
- **Notificações:** alertas de erro e sucesso  

---

## 🔒 Segurança

- **API backend:** credenciais Firebase protegidas no servidor  
- **Configuração segura:** arquivo `config.js` não versionado  
- **Validação:** estados e requisições autenticadas  
- **CORS:** controle de origem das requisições  
- **Tratamento de erros:** robusto e seguro  

---

## 📈 Melhorias Implementadas

- Arquitetura MVC organizada  
- Código modular e reutilizável  
- Interface moderna e intuitiva  
- Tratamento robusto de erros  
- Responsividade completa  
- Performance otimizada  

---

## 👥 Equipe

- Alice Cristina Silva  
- Anna Flávia Rosa Araújo  
- André Borsato Pimenta  
- André Filipe Gomes Vieira  
- Breno Sales Drumond  
- Pedro Arthur Silva Senra  

---

## 🧩 Licença

Este projeto é distribuído sob a licença MIT.  
Sinta-se livre para usar, modificar e distribuir.

---
