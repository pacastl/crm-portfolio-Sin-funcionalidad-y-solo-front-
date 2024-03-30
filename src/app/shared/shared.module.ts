import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { NavigationComponent } from '../panel/components/navigation/navigation.component';


@NgModule({
  declarations: [
    ErrorPageComponent,
    // NavigationComponent

  ],
  imports: [
    CommonModule
  ],
  exports: [
    ErrorPageComponent,
    // NavigationComponent

  ]

})
export class SharedModule { }
