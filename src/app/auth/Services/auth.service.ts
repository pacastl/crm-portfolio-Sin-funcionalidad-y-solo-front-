import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import jwt_decode from 'jwt-decode'; // Importa la función jwt_decode que se usa para decodificar tokens JWT

// Estructura de un token decodificado
interface DecodedToken {
    roles: string[];
    id: number;
    email: string;
    name: string;
    surname: string;
    partnerId: number;
  }
  // Decorador que permite la inyección de dependencias (para poder usar este servicio en otras clases)
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/public/login';
  // Almacena el estado de autenticación
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  // Observable que emite el estado del BehaviorSubject para suscribirse a cambios en la autenticación
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  // partnerIdClick!:number;
  constructor(private http: HttpClient) {}

  // Verifica si hay un token de acceso en el almacenamiento local del navegador
  private hasToken(): boolean {
    // Devuelve verdadero si hay un token de acceso, falso sino
    return !!localStorage.getItem('access_token');
  }

  login(email: string, password: string): Observable<any> {
    // Return a successful response regardless of the email and password
    return new Observable(observer => {
        const fakeToken = 'fake-token'; // You can generate a random token or use any value
        observer.next({ token: fakeToken }); // Simulate successful login
        observer.complete();
    }).pipe(
        // perform side-effects
        tap((response) => {
            // Store user information in local storage
            localStorage.setItem('access_token', response.token);
            localStorage.setItem('user_id', '240');
            localStorage.setItem('user_partner_id', '229');
            localStorage.setItem('user_name', 'Terence');
            localStorage.setItem('user_email', 'fahey.newell@example.org');
            localStorage.setItem('user_surname', 'Nikolaus');
            localStorage.setItem('user_roles', '["ROLE_ADMIN","ROLE_PARTNER"]');
            // Notify that the user is authenticated
            this.isAuthenticatedSubject.next(true);
        })
    );
}


  // Métodos para obtener los valores almacenados en el localStorage relacioandos con el token
  // Puede devolver null en algunos porque soin campos opciones en la BD
  getToken(): string | null {
  return localStorage.getItem('access_token');
}

  getUserId(): number | null {
    const userId = localStorage.getItem('user_id');
    return userId ? parseInt(userId, 10) : null; // Convierte el ID a número entero o devuelve nulo si no está definido
  }
  getUserPartnerId(): number | null {
    const userId = localStorage.getItem('user_partner_id');
    return userId ? parseInt(userId, 10) : null;
  }

  getUserEmail(): string | null {
    return localStorage.getItem('user_email');
  }

  getUserRoles(): string[] | null {
    const roles = localStorage.getItem('user_roles');
    return roles ? JSON.parse(roles) : null;
  }

  getUserName(): string | null {
    return localStorage.getItem('user_name');
  }

  getUserSurname(): string | null {
    return localStorage.getItem('user_surname');
  }
  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    // Si se encuentran los roles y el rol específico proporcionado, devuelve true
    return roles ? roles.includes(role) : false;
  }
}
