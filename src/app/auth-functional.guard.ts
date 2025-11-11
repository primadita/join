import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';

/**
 * Authorization guard for protecting routes that require authentication.
 *
 * Checks if the user is logged in using the AuthService. If authenticated,
 * allows navigation. Otherwise, redirects to the login page.
 *
 * @param {ActivatedRouteSnapshot} route - The activated route being navigated to
 * @param {RouterStateSnapshot} state - The router state at navigation time
 * @returns {Promise<boolean | UrlTree>} true if authorized, UrlTree redirect to login otherwise
 */
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