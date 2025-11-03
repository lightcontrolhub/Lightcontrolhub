class EmailAuthModel {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    this.users = JSON.parse(localStorage.getItem('mockUsers') || '{}');

    // Configure EmailJS (substitua pelos seus IDs)
    this.emailjsConfig = {
      serviceId: 'YOUR_SERVICE_ID',
      templateId: 'YOUR_TEMPLATE_ID',
      publicKey: 'YOUR_PUBLIC_KEY'
    };
  }
}

export default EmailAuthModel;