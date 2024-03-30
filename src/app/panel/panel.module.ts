import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { PanelRoutingModule } from './panel-routing.module';
import { MaterialModule } from '../material/material.module';
import { NavigationComponent } from './components/navigation/navigation.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditarEmpresaModalComponent } from './components/editar-empresa-modal/editar-empresa-modal.component';
import { TableComponent } from './components/table/table.component';
// import { CrearDistribuidorPageComponent } from './pages/crear-distribuidor-page/crear-distribuidor-page.component';
import { AsignarDistribuidorModalComponent } from './components/asignar-distribuidor-modal/asignar-distribuidor-modal.component';
import { NuevoDistribuidorComponent } from './components/nuevo-distribuidor-page/nuevo-distribuidor.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginatorIntl } from './components/custom-paginator-intl/custom-paginator-intl.component';
import { CustomFileInputComponent } from './components/custom-file-input/custom-file-input.component';
import { EditarCodigoModalComponent } from './components/editar-codigo-modal/editar-codigo-modal.component';
import { TableFileInputComponent } from './components/table-file-input/table-file-input.component';


@NgModule({
  declarations: [
    LayoutPageComponent,
    NavigationComponent,
    DashboardComponent,
    EditarEmpresaModalComponent,
    TableComponent,
    AsignarDistribuidorModalComponent,
    NuevoDistribuidorComponent,
    CustomFileInputComponent,
    EditarCodigoModalComponent,
    TableFileInputComponent,


  ],
  imports: [
    CommonModule,
    PanelRoutingModule,
    MaterialModule,
    ReactiveFormsModule,

  ],
  exports: [
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ],

})
export class PanelModule { }
