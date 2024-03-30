import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { LayoutPageComponent } from "./pages/layout-page/layout-page.component";
import { NuevoDistribuidorComponent } from "./components/nuevo-distribuidor-page/nuevo-distribuidor.component";

//localhost:4200/admin/distribuidores
// const routes: Routes = [
//   { path: 'crearPartner', component: NuevoDistribuidorComponent },
//   { path: 'crearEmpresa', component: NuevoDistribuidorComponent },
//   { path: 'crearUsuario', component: NuevoDistribuidorComponent },
//   { path: 'nuevoPartner', component: CrearDistribuidorPageComponent },
//   { path: 'list', component: LayoutPageComponent },

//   // { path: 'partner/:username', component: LayoutPageComponent },
//   { path: '', redirectTo: 'list', pathMatch: 'full' }, // Default route when no child route is specified
//   { path: '**', redirectTo: 'list' } // Wildcard route
// ];
const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [

      //http://localhost:4200/panel/admin/nuevoPartner
      {
        path: 'nuevoPartner',
        component: NuevoDistribuidorComponent,
      },
      // {
      //   path: 'nuevoUsuario',
      //   component: NuevoDistribuidorComponent,
      // },

      // http://localhost:4200/panel/partner/nuevaEmpresa
      {
        path: 'nuevaEmpresa',
        component: NuevoDistribuidorComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'list',
  },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
}
)
export class PanelRoutingModule { }
