import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  private keycloak = inject(KeycloakService);

  logout() {
    this.keycloak.logout();
  }
}