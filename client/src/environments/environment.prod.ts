export const environment = {
  production: true,
  apiURL: `https://lite-services.dataspire.io`,
  apaleoAPI: 'https://api.apaleo.com',
  authSetting: {
    scope: 'offline_access openid profile setup.manage',
    redirectUrl: 'https://lite.dataspire.io/callback',
    clientId: null,
    issuer: 'https://identity.apaleo.com',
    responseType: 'code',
  }
};
