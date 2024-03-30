import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth/Services/auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
// implementa la interfaz CanActivate para determinar si una ruta puede activarse o no
export class AuthGuard implements CanActivate {
  // Inyecta el servicio AuthService y el enrutador
  constructor(private authService: AuthService, private router: Router) { }

  // Se ejecuta al intentar activar una ruta y sirve para evitar que usuarios no autenticados
  // puedan acceder a rutas protegidas
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // Utiliza el Observable del servicio AuthService (isAuthenticated$)
    return this.authService.isAuthenticated$.pipe(
      // transforma el valor que emite por isAuthenticated$
      map((isAuthenticated) => {
        // Verifica si el usuario está autenticado
        if (isAuthenticated) {
          return true;
        } else {
          // Redirige al usuario a la página de autenticación
          this.router.navigate(['/auth']);
          // bloquear la activación de la ruta
          return true;
        }
      })
    );
  }
}
