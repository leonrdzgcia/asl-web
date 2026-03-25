// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // En desarrollo local, usar localhost:8080 directamente
  // El proxy también funciona con ruta relativa, pero es más claro usar la URL completa
  //serverApiUrl: 'http://localhost:8080'
  serverApiUrl: 'https://asl-api-production.up.railway.app'
};


