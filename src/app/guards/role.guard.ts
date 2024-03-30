import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles = route.data['expectedRoles'];
    const userRoles = this.authService.getUserRoles();

    // Comprueba si el usuario tiene al menos uno de los roles esperados para acceder a la ruta
    if (userRoles && expectedRoles.some((role: string) => userRoles.includes(role))) {
      return true;
    } else {
      // Redirige al usuario a la página de error
      this.router.navigate(['/error']);
      return true;
    }
  }

}

