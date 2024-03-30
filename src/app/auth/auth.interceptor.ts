import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './Services/auth.service';


@Injectable()
//Intercepta todas las peticiones HTTP salientes y agrega el token de acceso en la cabecera
export class AuthInterceptor {
  constructor(private authService: AuthService) { }

   // Método que intercepta  las peticiones HTTP salientes y agrega el token de acceso a la cabecera
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtiene el token
    const token = this.authService.getToken();

    // Si hay un token
    if (token) {
      // Clona la petición HTTP para realizar modificaciones porque la petición HTTP original una vez creada no se puede modificar
      // y para poder modificar la cabecera clonamos el original y lo modificamos
      request = request.clone({
        setHeaders: {
        // Agrega el token de acceso a la cabecera Authorization
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request); // Envía la solicitud HTTP con la cabecera modificada y devuelve un Observable para manejar la respuesta
  }
}
