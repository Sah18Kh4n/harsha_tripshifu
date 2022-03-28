// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  version: 'v1.3.2-alpha',
  baseUrl: 'https://devdashboard.tripshifu.com/',
  apiBase: 'https://apidev.funstay.in/api/v1/',
  funstayWebBase: 'http://localhost:4000/',
  storefrontBase: 'https://dev.tripshifu.com/',
  instaApiBaseUrl: 'https://api.instagram.com/',
  instaAppId: 2780724805350287,
  facebookAppId: '299873630718646',
  googleAppId: '135571067784-07672ed21jk07lqudg8lnj7t299r71vk.apps.googleusercontent.com',
  siblings: [
    'localhost'
  ],
  sessionExpiryDays: 1,
  consentExpiryDays: 365,
  secureCookie: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
