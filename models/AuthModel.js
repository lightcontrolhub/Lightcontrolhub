class AuthModel {
  constructor() {
    this.apiUrl = 'api/auth.php';
    this.token = localStorage.getItem('authToken');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }
}

export default AuthModel;