import { ApplicationConfig, APP_INITIALIZER, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';

import { routes } from './app.routes';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { cacheInterceptor } from './core/interceptors/cache.interceptor';

import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

// Fonction d'initialisation de Keycloak pour configurer l'authentification avant le démarrage de l'application
function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:9090', // URL de Keycloak
        realm: 'cybershield',
        clientId: 'front-console'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
      },
      enableBearerInterceptor: true,
      bearerPrefix: 'Bearer',
    });
}

// Configuration de l'application avec les providers nécessaires pour le routage, les requêtes HTTP et l'authentification Keycloak
export const appConfig: ApplicationConfig = {
  providers: [
    provideCharts(withDefaultRegisterables()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes
    ),
    provideHttpClient(
      withInterceptors([apiInterceptor, cacheInterceptor])
    ),
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }
  ]
};