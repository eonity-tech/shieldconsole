import { HttpInterceptorFn } from '@angular/common/http';

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Pour les requêtes vers l'API, on ajoute des headers pour éviter la mise en cache des réponses par le navigateur
  if (req.url.includes('/api/')) {
    
    // On ajoute des headers pour éviter la mise en cache des réponses API par le navigateur, 
    // ce qui peut causer des problèmes de données obsolètes lorsque l'utilisateur navigue dans l'application.
    const noCacheReq = req.clone({
      setHeaders: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    return next(noCacheReq);
  }

  return next(req);
};