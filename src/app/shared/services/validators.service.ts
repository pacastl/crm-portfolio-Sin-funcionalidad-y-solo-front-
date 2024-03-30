import { Injectable } from '@angular/core';
import { FormControl, ValidationErrors, FormGroup, AbstractControl } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ValidatorsService {

  public firstNameAndLastnamePattern: string = '([a-zA-Z]+) ([a-zA-Z]+)';
  public emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public codigoDistribuidorPattern: string = '^[a-zA-Z0-9]+$'; // Add a pattern for the codigoDistribuidor field
  public telefonoPattern: string = '^[0-9]{9,12}$'; // Add a pattern for the telefono field
  public dniPattern: string = '^[0-9]{8}[A-Z]|[XYZ][0-9]{7}[A-Z]$'; // Add a pattern for the DNI/NIE field

  // para verificar si un campo en un formulario tiene errores y ha sido tocado por el usuario
  public isValidField( form: FormGroup, field: string ) {
    return form.controls[field].errors && form.controls[field].touched;
  }


  // devuelve un validador personalizado que verifica si dos campos tienen el mismo valor
  // Lo uso para la contraseña del usuario (nuevoPartner)
  public isFieldOneEqualFieldTwo( field1: string, field2: string ) {

    return ( formGroup: AbstractControl ): ValidationErrors | null => {


      const fieldValue1 = formGroup.get(field1)?.value;
      const fieldValue2 = formGroup.get(field2)?.value;

      if ( fieldValue1 !== fieldValue2 ) {
        formGroup.get(field2)?.setErrors({ notEqual: true });
        // Devuelve un objeto de errores
        return { notEqual: true }
      }
      // Si los valores son iguales, limpiar los errore
      formGroup.get(field2)?.setErrors(null);
      return null;
    }

  }


}
