# 📧 Configuração do EmailJS

## 1. Criar Conta no EmailJS

1. Acesse [https://www.emailjs.com/](https://www.emailjs.com/)
2. Clique em "Sign Up" e crie uma conta gratuita
3. Confirme seu email

## 2. Configurar Serviço de Email

1. No dashboard, clique em "Email Services"
2. Clique em "Add New Service"
3. Escolha "Gmail" (recomendado)
4. Conecte sua conta Gmail
5. Anote o **Service ID** gerado

## 3. Criar Template de Email

1. Clique em "Email Templates"
2. Clique em "Create New Template"
3. Configure o template:

**Subject:** `Código de Verificação - LightControlHub`

**Content:**
```
Olá {{to_name}},

Seu código de verificação é: **{{verification_code}}**

Este código expira em 5 minutos.

Atenciosamente,
LightControlHub
```

4. Anote o **Template ID** gerado

## 4. Obter Chave Pública

1. Vá em "Account" → "General"
2. Copie sua **Public Key**

## 5. Configurar no Projeto

Edite o arquivo `email-config.js`:

```javascript
export const EMAIL_CONFIG = {
  PUBLIC_KEY: 'sua_public_key_aqui',
  SERVICE_ID: 'seu_service_id_aqui', 
  TEMPLATE_ID: 'seu_template_id_aqui'
};
```

## 6. Testar

1. Execute o projeto
2. Tente fazer login com um email real
3. Verifique se o código chegou no email

## ⚠️ Importante

- **Limite gratuito**: 200 emails/mês
- **Não commite** as chaves reais no GitHub
- Use emails reais para teste