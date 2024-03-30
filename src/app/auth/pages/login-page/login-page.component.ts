import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EmailValidator } from '../../../shared/validators/email-validator.service';
import { ValidatorsService } from '../../../shared/services/validators.service';



import { filter, Subject, take, takeUntil } from 'rxjs';
import { AuthService } from '../../Services/auth.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  public loginValid = true;
  public email = '';
  public password = '';

  private _destroySub$ = new Subject<void>();
  // private readonly returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // this.returnUrl = '/panel/admin';
  }

  public ngOnInit(): void {
    this.authService.isAuthenticated$.pipe(
      // Filtra los valores que no sean verdaderos (es decir, el usuario no está autenticado)
      filter((isAuthenticated: boolean) => isAuthenticated),
      // Cancela el observable
      takeUntil(this._destroySub$)
      // Escuchamos los valores que emiten el observable
    ).subscribe(() => {
      // Obtiene los roles del usuario
      const userRoles = this.authService.getUserRoles();

      // Tiene el rol de admin
      if (userRoles && userRoles.includes('ROLE_ADMIN')) {
        this.router.navigate(['/panel/admin']);
      // Tiene el rol de partner
      } else if (userRoles && userRoles.includes('ROLE_PARTNER')) {
        this.router.navigate(['/panel/partner']);
      }
    });
  }


  public ngOnDestroy(): void {
    this._destroySub$.next();
  }


  onSubmit(): void {
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        const userRoles = this.authService.getUserRoles();
        // Si es admin redirige a la pantalla de admin
        if (userRoles && userRoles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/panel/admin']);
          // Si es partner redirige a la pantalla de partner
        } else if (userRoles && userRoles.includes('ROLE_PARTNER')) {
          this.router.navigate(['/panel/partner']);
        }
      },
      (error) => {
        console.log('Login failed :', error);
        this.loginValid = false;
      }
    );
  }

}
