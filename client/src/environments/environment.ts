// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiURL: `https://lite-services.dataspire.io`,
  apaleoAPI: 'https://api.apaleo.com',
  authSetting: {
    scope: 'offline_access openid profile setup.manage',
    redirectUrl: 'http://localhost:4200/callback',
    clientId: null,
    issuer: 'https://identity.apaleo.com',
    responseType: 'code',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
