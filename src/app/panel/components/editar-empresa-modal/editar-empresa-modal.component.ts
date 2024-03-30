import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from 'src/app/shared/services/validators.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-editar-empresa-modal',
  templateUrl: './editar-empresa-modal.component.html',
  styleUrls: ['./editar-empresa-modal.component.scss']
})
export class EditarEmpresaModalComponent implements OnInit {

  nombreEmpresa: string = '';
  nif: string = '';
  // Declaración del form
  public myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required], []],
    nif: [, [Validators.required,], []],
  })
  constructor(
    private fb: FormBuilder,
    private validatorsService: ValidatorsService,
    private breakpointObserver: BreakpointObserver,
    private http: HttpClient,
    // Referencia al modal
    @Inject(MAT_DIALOG_DATA) public data: { id: number; name: string; nif: string },

    public dialogRef: MatDialogRef<EditarEmpresaModalComponent>
  ) { }


  ngOnInit(): void {
     // Inicialización del formulario
    this.myForm = this.fb.group({
      name: [this.data.name, [Validators.required]],
      nif: [this.data.nif, [Validators.required]],
    });
  }

  // cierra el modal y por eso reinica los valores del formulario
  close(): void {
    this.nombreEmpresa = '';
    this.nif = '';
  }
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field);
  }

  //Devuelve los errores para hacerr los mensajes de error de cad campo
  getFieldError(field: string): string | null {

    if (!this.myForm.controls[field]) return null;

    const errors = this.myForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) { // Se verifica el tipo de error
        case 'required':
          return 'Este campo es obligatorio';

        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres.`;
      }
    }

    return null;
  }

  // Para guardar los cambios del modal
  onSave(): void {
    if (this.myForm.valid) {
      // Se construye un objeto con los datos actualizados de la empresa
      const updatedCliente = {
        id: this.data.id,
        name: this.myForm.value.name,
        nif: this.myForm.value.nif,
      };
      // Se cierra el modal y se envían los datos actualizados
      this.dialogRef.close(updatedCliente);
    }
  }
}
