// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: false,
//   host: 'http://localhost:3000/',
//   //host: 'https://nkwen21.balaanz.com/',
//   //momoHost: 'https://developer.folelogix.com/',
//   captchKey: "6LeNMmYpAAAAAAPdFoxZ-A0hFuhdJOHJENo6N0uP",
//   paymentUser: "bitsvalley",
//   paymentPass: "bitsvalley",
//   org: 0,
//   currency: 'EUR'
// };

export const environment = {
  production: true,
  //host: 'http://localhost:3000/',
  host: 'https://nkwen21.balaanz.com/',
  // host: 'https://nkwen22.balaanz.com/',
  //momoHost: 'https://developer.folepay.com/',
  captchKey: "6LeNMmYpAAAAAAPdFoxZ-A0hFuhdJOHJENo6N0uP",
  // restApiHost: "https://test.balaanz.com/",
  restApiHost: "https://balaanz.com/",
  paymentUser: "bitsvalley",
  paymentPass: "b@lanz4lifE202!",
  org: 20,
  //org: 0,
  currency: 'FRS',
  momoCurrency: 'XAF'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
