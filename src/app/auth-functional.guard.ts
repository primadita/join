import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';


export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isLoggedIn = await authService.isLoggedIn();

  if (isLoggedIn) {
    return true;
  } else {
    // Umleitung zur Login-Seite, wenn nicht eingeloggt
    return router.createUrlTree(['login']);
  }
};