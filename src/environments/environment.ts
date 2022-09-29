// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,
  apiURL: 'http://192.168.1.4:8000/',
  nacFEURL:'http://10.91.20.15:81/',
  redirect_TO_NAC: false,
  isSkipLocationChange:true,
  TimeoutGreen:2700,
  TimeoutYellow:900,
  TimeoutRed:300,
  NACURL: 'http://192.168.1.4:8001/',
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 * Test
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.