export const environment = {
  production: true,
  apiURL: `http://localhost:8000`,
  apaleoAPI: 'https://api.apaleo.com',
  authSetting: {
    scope: 'offline_access openid profile setup.manage',
    redirectUrl: 'http://localhost:4200/callback',
    clientId: null,
    issuer: 'https://identity.apaleo.com',
    responseType: 'code',
  }
};
