import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloak = inject(KeycloakService);
  
  // Clé API statique (à remplacer par une solution plus sécurisée en production)
  const apiKey = 'Yo-7E-shield-Secret-v1-super-$Ecure-!c!';
  
  // Récupération du token d'authentification depuis Keycloak
  const authToken = keycloak.getKeycloakInstance().token;

  // Clonage de la requête pour ajouter les en-têtes d'authentification et d'API key
  const authReq = req.clone({
    setHeaders: {
      'Authorization': `Bearer ${authToken}`,
      'x-api-key': apiKey,
      'X-Tenant-ID': 'client-free' // pour le moment, on utilise une valeur statique, à adapter selon les besoins
    }
  });

  return next(authReq);
};