import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, fromEvent, Subscription } from 'rxjs';
import { map, shareReplay, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/shared/services/backend.service';
import { AuthService } from 'src/app/auth/Services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnDestroy,OnInit {
  @Input() username: string = '';
  @Input() role: string = '';
  data: any;
  router: Router;
  isExpanded = false;
  isSidenavOpened = true;
  userEmail!: string;
  userName!: string;
  surname!:string;

  // oculta/desplica el menu lateral
  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
    this.isSidenavOpened = this.isExpanded;
  }

   // Observable para confirmar si la pantalla es pequeña
  isHandset$: Observable<boolean> = this.breakpointObserver.observe('(min-width: 768px)')
    .pipe(
      map(result => !result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, router: Router, private backend: BackendService,
    private authService: AuthService) {
    this.router = router;
  }

  //se ejecuta cuando se destruye el componente
  ngOnDestroy() {
  }

  // abre la página de privacidad de SDI
  openPrivacyPage() {
    const privacyUrl = 'https://hrlog.es/privacidad/';
    window.open(privacyUrl, '_blank');
  }
  // abre la página de SDI
  openSDIPage() {
    const privacyUrl = 'https://www.sdi.es/';
    window.open(privacyUrl, '_blank');
  }
  // abre la página  de HRLOG
  openHRLOGPage() {
    const privacyUrl = 'https://hrlog.es/';
    window.open(privacyUrl, '_blank');
  }
  // Obtiene los valores del usuario para mostrarlos en la barra lateral
  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail() || '';
    this.userName = this.authService.getUserName() || '';
    this.surname = this.authService.getUserSurname() || '';
  }

}
