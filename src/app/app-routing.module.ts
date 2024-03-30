import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './shared/pages/error-page/error-page.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';


const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'panel',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'admin',
        //Solo un admin puede acceder
        canActivate: [RoleGuard],
        // el rol que espera encontrar para dar acceso
        data: { expectedRoles: ['ROLE_ADMIN'] },
        // Lazy load para que solo se cargue cuando la ruta se activa
        loadChildren: () => import('./panel/panel.module').then(m => m.PanelModule),
      },
      {
        path: 'partner',
        //debes ser un  partner para acceder
        canActivate: [RoleGuard],
        data: { expectedRoles: ['ROLE_PARTNER'] },
        loadChildren: () => import('./panel/panel.module').then(m => m.PanelModule),
      },
    ],
  },
  // página de error
  {
    path: 'error',
    component: ErrorPageComponent
  },
  // regirige al login
  {

    path: '',
    redirectTo: 'auth',
    // importante ponerlo porque siempre entraría en este caso sin él
    pathMatch: 'full'
  },
  // comodín, si coincide con nada de lo de arriba lleva la página de error
  {
    path: '**',
    redirectTo: 'error'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
