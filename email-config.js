// Configuração do EmailJS
export const EMAIL_CONFIG = {
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY',        
  SERVICE_ID: 'YOUR_SERVICE_ID',        
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID'       
};

// Como configurar:
// 1. Acesse https://www.emailjs.com/
// 2. Crie uma conta gratuita  
// 3. Configure um serviço de email (Gmail recomendado)
// 4. Crie um template com as variáveis:
//    - {{to_email}} - Email do destinatário
//    - {{to_name}} - Nome do usuário  
//    - {{verification_code}} - Código de verificação
// 5. Substitua os valores acima pelos seus dados reais