// import { COMMA, ENTER } from '@angular/cdk/keycodes';
// import { Component, Inject, Input, OnInit } from '@angular/core';
// import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { NgModule } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { EmailValidator } from '../../../shared/validators/email-validator.service';
// import { ValidatorsService } from '../../../shared/services/validators.service';
// import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
// import { MatSelectChange } from '@angular/material/select';
// import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
// import { ReactiveFormsModule } from '@angular/forms';
// import { DistribuidorElement, TableComponent } from '../table/table.component';
// import { MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { HttpClient } from '@angular/common/http';



// export interface CodigoDistribuidor {
//   id: number;
//   code: string;
// }

// export interface EmailDistribuidor {
//   id: number;
//   email: string;
// }

// @Component({
//   selector: 'app-asignar-distribuidor-modal',
//   templateUrl: './asignar-distribuidor-modal.component.html',
//   styleUrls: ['./asignar-distribuidor-modal.component.scss']
// })
// export class AsignarDistribuidorModalComponent implements OnInit {
//   distribuidor!: DistribuidorElement;
//   tableComponent!: TableComponent;
//   selectedFile: File | null = null;
//   isSmallScreen: boolean = false;
//   readonly separatorKeysCodes = [ENTER, COMMA] as const;
//   deletedCodigos: CodigoDistribuidor[] = [];
//   editedCodigos: CodigoDistribuidor[] = [];

//   public myForm: FormGroup = this.fb.group({
//     name: ['', [Validators.required, Validators.minLength(3)]],
//     codes: this.fb.array([]),
//     margin: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
//     active: [''],
//     type: [],
//   });

//   constructor(
//     private fb: FormBuilder,
//     private validatorsService: ValidatorsService,
//     private breakpointObserver: BreakpointObserver,
//     private http: HttpClient,
//     @Inject(MAT_DIALOG_DATA) public data: { distribuidor: DistribuidorElement; allDistribuidors: DistribuidorElement[]; tableComponent: TableComponent }) {
//       this.distribuidor = data.distribuidor;
//       this.tableComponent = data.tableComponent;
//   }



//   codes: CodigoDistribuidor[] = this.data.distribuidor.codes;
//   newCodes: CodigoDistribuidor[] = [];



//   onFileSelected(file: File): void {
//     this.selectedFile = file;
//   }

//   add(event: MatChipInputEvent): void {
//     const value = (event.value || '').trim();

//     // Add new code
//     if (value) {
//       const newCodigo: CodigoDistribuidor = {
//         id: 0, // Set a temporary id for the new chip
//         code: value,
//       };
//       this.codes.push(newCodigo);
//       this.newCodes.push(newCodigo);
//     }

//     // Reset the input value
//     if (event.input) {
//       event.input.value = '';
//     }
//   }

//   remove(code: CodigoDistribuidor): void {
//     const index = this.codes.indexOf(code);

//     if (index >= 0) {
//       this.codes.splice(index, 1);

//       // Remove the deleted chip from the newCodes array
//       const newCodigosIndex = this.newCodes.findIndex(newCodigo => newCodigo.code === code.code);
//       if (newCodigosIndex >= 0) {
//         this.newCodes.splice(newCodigosIndex, 1);
//       }
//       this.deletedCodigos.push(code);

//     }
//   }

//   removeDeletedCodigos(): void {
//     this.codes = this.codes.filter(code => !this.deletedCodigos.includes(code));
//   }


//   async deleteRemovedCodigos(): Promise<void> {
//     for (const code of this.deletedCodigos) {
//       await this.http.delete(`http://localhost:8080/public/partnerCode/${code.id}`).toPromise();
//     }
//   }

//   edit(code: CodigoDistribuidor, event: MatChipEditedEvent) {
//     const value = event.value.trim();

//     // Remove code if it no longer has a value
//     if (!value) {
//       this.remove(code);
//       return;
//     }

//     // Edit existing code
//     const index = this.codes.indexOf(code);
//     if (index >= 0) {
//       this.codes[index].code = value;
//       this.editedCodigos.push(this.codes[index]); // Add the edited chip to the editedCodigos array
//     }
//   }

//   clear() {
//     this.myForm.get('name')!.setValue(null);
//   }


//   handleButtonClick() {
//     console.log(this.myForm.value);
//   }




//   isValidField(field: string): boolean | null {
//     return this.validatorsService.isValidField(this.myForm, field);
//     // return true;
//   }

//   isValidFieldInArray(formArray: FormArray, index: number) {
//     return formArray.controls[index].errors
//       && formArray.controls[index].touched;
//   }


//   getFieldError(field: string): string | null {

//     if (!this.myForm.controls[field]) return null;

//     const errors = this.myForm.controls[field].errors || {};

//     for (const key of Object.keys(errors)) {
//       switch (key) {
//         case 'required':
//           return 'Este campo es requerido';

//         case 'minlength':
//           return `Mínimo ${errors['minlength'].requiredLength} caracters.`;
//       }
//     }

//     return null;
//   }


//   responseToDistribuidorElement(responseData: any): DistribuidorElement {
//     return {
//       id: responseData.id,
//       name: responseData.name,
//       active: responseData.active,
//       companies: responseData.companies,
//       margin: responseData.margin,
//       nif: responseData.nif,
//       type: responseData.type,
//       phone: responseData.phone,
//       contract: responseData.contract,
//       codes: [],
//       emails: [],
//     };
//   }

//   async onSubmit(): Promise<void> {
//     // Update the Distribuidor data and send a PATCH request to the backend
//     const updatedDistribuidor = {
//       ...this.data.distribuidor,
//       ...this.myForm.value,
//     };

//     // Create a new object with only the fields you want to send in the PATCH request
//     const patchData = {
//       name: updatedDistribuidor.name,
//       margin: Number(updatedDistribuidor.margin),
//       active: updatedDistribuidor.active,
//       type: updatedDistribuidor.type,
//       // TODO: quitarlo hizo que al hacer asignar distribuidor al tener un contracto ya vaya bien
//       // contract: updatedDistribuidor.contract,
//     };

//     //TODO: api platform endpoint
//     this.http.patch(`http://localhost:8080/public/api/partners/${updatedDistribuidor.id}`, patchData, {
//       headers: {
//         'Content-Type': 'application/merge-patch+json',
//       },
//       withCredentials: true,
//     }).subscribe(
//       (response: any) => {
//         console.log('Distribuidor updated successfully');
//         const updatedDistribuidorElement = {
//           id: response.id,
//           name: updatedDistribuidor.name,
//           margin: Number(updatedDistribuidor.margin),
//           active: updatedDistribuidor.active,
//           type: updatedDistribuidor.type,
//           companies: updatedDistribuidor.companies,
//           nif: updatedDistribuidor.nif,
//           phone: updatedDistribuidor.phone,
//           codes: this.data.distribuidor.codes,
//           emails: this.data.distribuidor.emails,
//           contract: updatedDistribuidor.contract,
//         };
//         this.tableComponent.updateDistribuidor(updatedDistribuidorElement);
//       },
//       (error) => {
//         console.log('Error updating Distribuidor');
//       }
//     );



//   this.newCodes.forEach(code => {
//  //TODO: api platform endpoint
//     this.http.post(`http://localhost:8080/public/partnerCode`, { code: code.code, partner: `/public/api/partners/${updatedDistribuidor.id}` }).subscribe(
//       (response: any) => {
//         console.log(`CodigoDistribuidor ${response.id} created successfully`);
//       },
//       (error) => {
//         console.log(`Error creating new CodigoDistribuidor`);
//       }
//     );
//   });
//   this.editedCodigos.forEach(code => {
//     this.http.patch(`http://localhost:8080/public/partnerCode/${code.id}`, { code: code.code }).subscribe(
//       () => {
//         console.log(`CodigoDistribuidor ${code.id} updated successfully`);
//       },
//       (error) => {
//         console.log(`Error updating CodigoDistribuidor ${code.id}`);
//       }
//     );
//   });
//   this.deletedCodigos.forEach(code => {
//     this.http.delete(`http://localhost:8080/public/partnerCode/${code.id}`).subscribe(
//       () => {
//         console.log(`CodigoDistribuidor ${code.id} deleted successfully`);
//       },
//       (error) => {
//         console.log(`Error deleting CodigoDistribuidor ${code.id}`);
//       }
//     );
//   });


//     if (this.selectedFile) {
//       const formData = new FormData();
//       formData.append('contract', this.selectedFile);

//       this.http.post(`http://localhost:8080/public/uploadContract/${updatedDistribuidor.id}`, formData, {
//         withCredentials: true,
//       }).subscribe(
//         (response: any) => {
//           console.log('Contract uploaded successfully');
//         },
//         (error) => {
//           console.log('Error uploading contract');
//           console.log(error);
//         }
//       );
//     }
//   }

//   updateDistribuidor(id: number, patchData: any): void {
//      //TODO: api platform endpoint
//     this.http.patch(`http://localhost:8080/public/api/partners/${id}`, patchData, {
//       headers: {
//         'Content-Type': 'application/merge-patch+json',
//       },
//       withCredentials: true,
//     }).subscribe(
//       (response: any) => {
//         console.log('Distribuidor updated successfully');
//         // Update the table component with the updated Distribuidor data
//         const updatedDistribuidorElement = {
//           id: response.id,
//           name: patchData.nombre,
//           margin: Number(patchData.margin),
//           active: patchData.active,
//           type: patchData.type,
//           companies: this.data.distribuidor.companies,
//           nif: this.data.distribuidor.nif,
//           phone: this.data.distribuidor.phone,
//           codes: this.data.distribuidor.codes,
//           emails: this.data.distribuidor.emails,
//           contract: response.contract,
//         };
//         this.tableComponent.updateDistribuidor(updatedDistribuidorElement);
//       },
//       (error) => {
//         console.log('Error updating Distribuidor');
//       }
//     );
//   }


//   ngOnInit(): void {
//     this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe(result => {
//       this.isSmallScreen = result.matches;
//     });

//     // Set the initial values of the form controls
//     if (this.data && this.data.distribuidor) {
//       this.myForm.patchValue({
//         name: this.data.distribuidor.name,
//         margin: this.data.distribuidor.margin,
//         active: this.data.distribuidor.active,
//         type: this.data.distribuidor.type,
//       });

//       this.myForm.setControl('codes', this.fb.array(this.data.distribuidor.codes.map(code => this.fb.group({
//         id: [code.id],
//         code: [code.code]
//       }))));
//     }
//   }

// }

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmailValidator } from '../../../shared/validators/email-validator.service';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { MatSelectChange } from '@angular/material/select';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ReactiveFormsModule } from '@angular/forms';
import { DistribuidorElement, TableComponent } from '../table/table.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { BackendService } from 'src/app/shared/services/backend.service';


// nterfaces para los códigos de distribuidor y correos de distribuidor
export interface CodigoDistribuidor {
  id: number;
  code: string;
}

export interface EmailDistribuidor {
  id: number;
  email: string;
}

@Component({
  selector: 'app-asignar-distribuidor-modal',
  templateUrl: './asignar-distribuidor-modal.component.html',
  styleUrls: ['./asignar-distribuidor-modal.component.scss']
})
export class AsignarDistribuidorModalComponent implements OnInit {
  distribuidor!: DistribuidorElement;// Distribuidor seleccionado
  tableComponent!: TableComponent; // Componente de tabla
  selectedFile: File | null = null; // Archivo seleccionado
  // Indicador de pantalla pequeña para el breakPoint y poner la tabla por filas
  isSmallScreen: boolean = false;
  readonly separatorKeysCodes = [ENTER, COMMA] as const; //Separadores en chips
  deletedCodigos: CodigoDistribuidor[] = []; // Array de códigos eliminados dentro de los chips
  editedCodigos: CodigoDistribuidor[] = []; // Array de códigos editados dentro de los chips

  // para el formulario reactivo, añade validadores e inicializa los campos del form
  public myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    codes: this.fb.array([]),
    margin: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
    active: [''],
    type: [],
  });

  constructor(
    private fb: FormBuilder,
    private validatorsService: ValidatorsService,
    private breakpointObserver: BreakpointObserver,
    private http: HttpClient,
    private backendService:BackendService,
    @Inject(MAT_DIALOG_DATA) public data: { distribuidor: DistribuidorElement; allDistribuidors: DistribuidorElement[]; tableComponent: TableComponent }) {
      this.distribuidor = data.distribuidor;
      this.tableComponent = data.tableComponent;
  }



  codes: CodigoDistribuidor[] = this.data.distribuidor.codes; //Códigos actuales
  newCodes: CodigoDistribuidor[] = []; //Codigos añadidos


  // Para manejar la selección del archivo pdf
  onFileSelected(file: File): void {
    this.selectedFile = file;
  }

    // agrega un nuevo código de distribuidor

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add new code
    if (value) {
      const newCodigo: CodigoDistribuidor = {
        id: 0, // Set a temporary id for the new chip
        code: value,
      };
      this.codes.push(newCodigo);
      this.newCodes.push(newCodigo);
    }

    // Reset the input value
    if (event.input) {
      event.input.value = '';
    }
  }

  // eliminar un código de distribuidor
  remove(code: CodigoDistribuidor): void {
    const index = this.codes.indexOf(code);

    if (index >= 0) {
      this.codes.splice(index, 1);

      // Remove the deleted chip from the newCodes array
      const newCodigosIndex = this.newCodes.findIndex(newCodigo => newCodigo.code === code.code);
      if (newCodigosIndex >= 0) {
        this.newCodes.splice(newCodigosIndex, 1);
      }
      this.deletedCodigos.push(code);

    }
  }

  // Los códigos eliminados se guardan en un array para borrarlos cuandos se confirme con guardar
  removeDeletedCodigos(): void {
    this.codes = this.codes.filter(code => !this.deletedCodigos.includes(code));
  }

  // Método asíncrono para eliminar códigos de distribuidor eliminados en el backend
  async deleteRemovedCodigos(): Promise<void> {
    for (const code of this.deletedCodigos) {
      await this.http.delete(`http://localhost:8080/public/partnerCode/${code.id}`).toPromise();
    }
  }

  // edita un código de distribuidor
  edit(code: CodigoDistribuidor, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Si está vácio se debe borrar
    if (!value) {
      this.remove(code);
      return;
    }

    // Edita el código
    const index = this.codes.indexOf(code);
    if (index >= 0) {
      this.codes[index].code = value;
      this.editedCodigos.push(this.codes[index]); // Add the edited chip to the editedCodigos array
    }
  }

  //  limpia el campo formulario (es la x del input)
  clear() {
    this.myForm.get('name')!.setValue(null);
  }


  // handleButtonClick() {
  //   console.log(this.myForm.value);
  // }



  // valida un campo del formulario
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field);
    // return true;
  }

  // valida un campo de un formulario en un array
  isValidFieldInArray(formArray: FormArray, index: number) {
    return formArray.controls[index].errors
      && formArray.controls[index].touched;
  }


  // obteniene el error de un campo
  getFieldError(field: string): string | null {

    if (!this.myForm.controls[field]) return null;

    const errors = this.myForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracters.`;
      }
    }

    return null;
  }


  //  converte una respuesta en un elemento de distribuidor
  responseToDistribuidorElement(responseData: any): DistribuidorElement {
    return {
      id: responseData.id,
      name: responseData.name,
      active: responseData.active,
      companies: responseData.companies,
      margin: responseData.margin,
      nif: responseData.nif,
      type: responseData.type,
      phone: responseData.phone,
      contract: responseData.contract,
      codes: [],
      emails: [],
    };
  }

  // Método asíncrono para enviar el formulario cuadno el damos a guardar
  async onSubmit(): Promise<void> {
    // Update the Distribuidor data and send a PATCH request to the backend
    const updatedDistribuidor = {
      ...this.data.distribuidor,
      ...this.myForm.value,
    };

    const patchData = {
      name: updatedDistribuidor.name,
      margin: Number(updatedDistribuidor.margin),
      active: updatedDistribuidor.active,
      type: updatedDistribuidor.type,
    };

    this.backendService.updateDistribuidor(updatedDistribuidor.id, patchData).subscribe(
      (response: any) => {
        console.log('Distribuidor updated successfully');
        const updatedDistribuidorElement = {
          id: response.id,
          name: updatedDistribuidor.name,
          margin: Number(updatedDistribuidor.margin),
          active: updatedDistribuidor.active,
          type: updatedDistribuidor.type,
          companies: updatedDistribuidor.companies,
          nif: updatedDistribuidor.nif,
          phone: updatedDistribuidor.phone,
          codes: this.data.distribuidor.codes,
          emails: this.data.distribuidor.emails,
          contract: updatedDistribuidor.contract,
        };
        this.tableComponent.updateDistribuidor(updatedDistribuidorElement);
      },
      (error) => {
        console.log('Error updating Distribuidor');
      }
    );

    // Code for creating, updating, and deleting partner codes
    this.newCodes.forEach(code => {
      this.backendService.createPartnerCode(code.code, updatedDistribuidor.id).subscribe(
        (response: any) => {
          console.log(`Partner code ${response.id} created successfully`);
        },
        (error) => {
          console.log('Error creating partner code');
        }
      );
    });

    this.editedCodigos.forEach(code => {
      this.backendService.updatePartnerCode(code.id, code.code).subscribe(
        () => {
          console.log(`Partner code ${code.id} updated successfully`);
        },
        (error) => {
          console.log(`Error updating partner code ${code.id}`);
        }
      );
    });

    this.deletedCodigos.forEach(code => {
      this.backendService.deletePartnerCode(code.id).subscribe(
        () => {
          console.log(`Partner code ${code.id} deleted successfully`);
        },
        (error) => {
          console.log(`Error deleting partner code ${code.id}`);
        }
      );
    });

    // Upload contract if selected
    if (this.selectedFile) {
      this.backendService.uploadContract(updatedDistribuidor.id, this.selectedFile).subscribe(
        () => {
          console.log('Contract uploaded successfully');
        },
        (error) => {
          console.log('Error uploading contract');
          console.log(error);
        }
      );
    }
    console.log('Soy el async');

  }

  // TODO: borrar si no es necesario
  updateDistribuidor(id: number, patchData: any): void {
    this.backendService.updateDistribuidor(id, patchData).subscribe(
      (response: any) => {
        console.log('Distribuidor updated successfully');
        // Update the table component with the updated Distribuidor data
        const updatedDistribuidorElement = {
          id: response.id,
          name: patchData.nombre,
          margin: Number(patchData.margin),
          active: patchData.active,
          type: patchData.type,
          companies: this.data.distribuidor.companies,
          nif: this.data.distribuidor.nif,
          phone: this.data.distribuidor.phone,
          codes: this.data.distribuidor.codes,
          emails: this.data.distribuidor.emails,
          contract: response.contract,
        };
        this.tableComponent.updateDistribuidor(updatedDistribuidorElement);
      },
      (error) => {
        console.log('Soy el updateDistribuidor');

        console.log('Error updating Distribuidor');
      }
    );
  }


  ngOnInit(): void {
    // Determina si la pantlla es pequeña
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe(result => {
      this.isSmallScreen = result.matches;
    });

    // Estabelce el valor inicial de los campos del formualrio
    if (this.data && this.data.distribuidor) {
      this.myForm.patchValue({
        name: this.data.distribuidor.name,
        margin: this.data.distribuidor.margin,
        active: this.data.distribuidor.active,
        type: this.data.distribuidor.type,
      });

      // Inicializa cada codigo de distribuidor con su id y codigo correspondiente
      this.myForm.setControl('codes', this.fb.array(this.data.distribuidor.codes.map(code => this.fb.group({
        id: [code.id],
        code: [code.code]
      }))));
    }
  }

}
