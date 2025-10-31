

class LightModel {
  constructor(authModel) {
    this.firebaseUrl = 'https://teste-9142b-default-rtdb.firebaseio.com';
    this.deviceId = 'dispositivo-do-breno';
    this.authModel = authModel;
    this.pollInterval = null;
    this.currentCallback = null;
  }


  getDeviceId() {
    return this.deviceId;
  }

  getFirebaseUrl() {
    return this.firebaseUrl;
  }
}

export default LightModel;