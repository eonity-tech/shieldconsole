import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

import { environment } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloak = inject(KeycloakService);
  
  // Clé API statique (à remplacer par une solution plus sécurisée en production)
  const apiKey = environment.apiKey;
  
  // Récupération du token d'authentification depuis Keycloak
  const authToken = keycloak.getKeycloakInstance()?.token || '';

  // Vérification si la requête est en lecture seule (GET) ou modifie des données (POST, PUT, DELETE)
  const isReadOnly = req.method === 'GET';

  // Clonage de la requête pour ajouter les en-têtes d'authentification et d'API key
  const authReq = req.clone({
    setHeaders: {
      'Authorization': `Bearer ${authToken}`,
      'x-api-key': apiKey,
      'X-Tenant-ID': 'client-free' // TODO: le moment, on utilise une valeur statique, à adapter selon les besoins
    }
  });

  return next(authReq);
};