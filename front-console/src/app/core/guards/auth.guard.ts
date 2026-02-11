import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

// Guard d'authentification pour protéger les routes de l'application en utilisant Keycloak
@Injectable({
    providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {
    constructor(
        protected override router: Router,
        protected readonly keycloak: KeycloakService
    ) {
        super(router, keycloak);
    }

    // Méthode pour vérifier si l'accès à une route est autorisé en fonction de l'état d'authentification de l'utilisateur
    public async isAccessAllowed(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean> {
        // Si pas connecté, on force le login
        if (!this.authenticated) {
            await this.keycloak.login({
                redirectUri: window.location.origin + state.url
            });
            return false;
        }
        return true;
    }
}