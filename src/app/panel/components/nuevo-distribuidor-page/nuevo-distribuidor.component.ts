import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../../shared/validators/email-validator.service';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { CodeService } from 'src/app/shared/services/code.service';

@Component({
  selector: 'app-nuevo-distribuidor',
  templateUrl: './nuevo-distribuidor.component.html',
  styleUrls: ['./nuevo-distribuidor.component.scss']
})
export class NuevoDistribuidorComponent implements OnInit {
  isPartnerRoute!: boolean;
  public myForm: FormGroup = this.fb.group({
    phone: ['', [Validators.maxLength(9)]],
    employees: [0, []],
    billing: [],
    nuevoCodigo: ['', [Validators.required, Validators.minLength(1)]],
    warningEmails: [],
    type: [],
    margin: [0, [Validators.required, Validators.min(0), Validators.max(100)], []],
    companyName: [],
    nif: [],
    code: [],
    admin: [],
    name: [],
    surname: [],
    dni: [],
    version: [],
    // mail: ['', [Validators.required, Validators.email]],
    email: ['', [Validators.required, Validators.pattern(this.validatorsService.emailPattern)], [this.emailValidator]],
    password: ['', [Validators.required, Validators.minLength(1)]],
    password2: ['', [Validators.required]],
  },
    {
      validators: [
        this.validatorsService.isFieldOneEqualFieldTwo('password', 'password2')
      ]
    });



  constructor(
    private fb: FormBuilder,
    private validatorsService: ValidatorsService,
    private emailValidator: EmailValidator,
    private http: HttpClient,
    private router: Router,
    private codeService: CodeService
    //**********CAMBIARLO por el mío */
    //private paisesService: PaisesService
  ) { }
  public codes: any[] = [];
  ngOnInit(): void {
    this.isPartnerRoute = this.router.url.includes('partner');
    this.fetchCodigos();
  }
  fetchCodigos(): void {
    this.codeService.fetchCodigos().subscribe(
      (response) => {
        this.codes = response;
      },
      (error) => {
        console.error(error);
        console.log('Error fetching active codes');
      }
    );
  }


  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field);
  }
  

  //Devuelve los errores para hacerr los mensajes de error de cad campo
  getFieldError(field: string): string | null {

    if (!this.myForm.controls[field]) return null;

    const errors = this.myForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es obligatorio';

        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres.`;
      }
    }

    return null;
  }


  onSubmitClient(): void {
    const formData = this.myForm.value;
    const codigoDistribuidorId = `/public/api/partner_codes/${formData.code.id}`;
    const clienteData = {
      name: formData.companyName,
      nif: formData.nif,
      phone: formData.phone,
      code: codigoDistribuidorId,
      active: true,
      employees: formData.employees,
      roles: formData.admin ? ['ROLE_ADMIN'] : ['ROLE_PARTNER'],
      joinDate: new Date().toLocaleDateString('en-GB'),
      currentVersion: formData.version,
      // billing: ,
    };


    this.http.post('http://localhost:8080/public/clients', clienteData).pipe(
      switchMap((cliente: any) => {
        const clienteId = `/public/api/clients/${cliente.id}`;
        // Create a new VersionCliente
        const versionClienteData = {
          joinDate: new Date().toLocaleDateString('en-GB'),
          client: clienteId,
          version: formData.version
        };
       
        return this.http.post('http://localhost:8080/public/clientVersion', versionClienteData).pipe(
          map((versionCliente: any) => ({ cliente, versionCliente }))
        );
      })
    ).subscribe(({ cliente, versionCliente }) => {
      // Update the Cliente with the VersionCliente ID
      const updatedClienteData = {
        // ...cliente,
        clientVersions: [`/public/api/client_versions/${versionCliente.id}`],
      };

      this.http.patch(`http://localhost:8080/public/clients/${cliente.id}`, updatedClienteData).subscribe(
        (updatedCliente: any) => {
          // Handle success, e.g., show a success message or navigate to another page
        },
        (error) => {
          console.error(error);
          console.log('Error updating Cliente with VersionCliente ID');
        }
      );
    });
  }


  onSubmit(): void {
    // if (this.myForm.invalid) {
    //   return;
    // }

    const headers = new HttpHeaders({
      'Content-Type': 'application/merge-patch+json'
    });

    const requestOptions = {
      headers,
      withCredentials: true
    };

    const formData = this.myForm.value;

    // Create a new Distribuidor
    const distribuidorData = {
      type: formData.type,
      margin: Number(formData.margin),
      name: formData.companyName,
      nif: formData.nif,
      phone: formData.phone,
      active: true,
      companies: 0
    };
    this.http.post('http://localhost:8080/public/partners', distribuidorData).pipe(
      switchMap((distribuidor: any) => {
        const distribuidorId = `/public/api/partners/${distribuidor.id}`;

        const codigoDistribuidorData = {
          partner: distribuidorId,
          code: formData.nuevoCodigo,
        };

        return this.http.post('http://localhost:8080/public/partnerCode', codigoDistribuidorData).pipe(
          switchMap((codigoDistribuidor: any) => {
            const codigoDistribuidorId = `/public/api/partner_codes/${codigoDistribuidor.id}`;

            const emailDistribuidorData = {
              code: [codigoDistribuidorId],
              email: formData.warningEmails,
              clients: [],
              partnerEmails: []
            };

            return this.http.post('http://localhost:8080/public/partnerEmail', emailDistribuidorData).pipe(
              switchMap((emailDistribuidor: any) => {
                const usuarioData = {
                  name: formData.name,
                  surname: formData.surname,
                  email: formData.email,
                  password: formData.password,
                  partner: distribuidorId,
                  roles: formData.admin ? ['ROLE_ADMIN'] : ['ROLE_PARTNER'],
                  dni:formData.dni,
                };

                return this.http.post('http://localhost:8080/public/user', usuarioData).pipe(
                  switchMap((usuario: any) => {
                    const clienteData = {
                      name: formData.companyName,
                      nif: formData.nif,
                      phone: formData.phone,
                      code: codigoDistribuidorId,
                      active: true,
                      employees: formData.employees,
                      roles: formData.admin ? ['ROLE_ADMIN'] : ['ROLE_PARTNER'],
                      joinDate: new Date().toLocaleDateString('en-GB'),
                      currentVersion: formData.version,
                    };

                    return this.http.post('http://localhost:8080/public/clients', clienteData).pipe(
                      switchMap((cliente: any) => {
                        const clienteId = `/public/api/clients/${cliente.id}`;

                        const versionClienteData = {
                          joinDate: new Date().toLocaleDateString('en-GB'),
                          client: clienteId,
                          version: formData.version
                        };

                        return this.http.post('http://localhost:8080/public/clientVersion', versionClienteData).pipe(
                          map((versionCliente: any) => ({ cliente, versionCliente, usuario, emailDistribuidor, codigoDistribuidor, distribuidor }))
                        );
                      })
                    );
                  })
                );
              })
            );
          })
        );
      })
    ).subscribe(({ cliente, versionCliente, usuario, emailDistribuidor, codigoDistribuidor, distribuidor }) => {
      // Update the Cliente with the VersionCliente ID



      const updatedClienteData = {
        clientVersions: [`/public/api/client_versions/${versionCliente.id}`],
      };

      this.http.patch(`http://localhost:8080/public/clients/${cliente.id}`, updatedClienteData, requestOptions).subscribe(
        (updatedCliente: any) => {
        },
        (error) => {
          console.error(error);
          console.log('Error updating Cliente with VersionCliente ID');
        }
      );

      const updatedCodigoDistribuidorData = {
        partnerEmails: [`/public/api/partner_emails/${emailDistribuidor.id}`],
      };

      this.http.patch(`http://localhost:8080/public/partnerCode/${codigoDistribuidor.id}`, updatedCodigoDistribuidorData, requestOptions).subscribe(
        (updatedCodigoDistribuidor: any) => {
          // Handle success, e.g., show a success message or navigate to another page
        },
        (error) => {
          console.error(error);
          console.log('Error updating CodigoDistribuidor with EmailDistribuidor ID');
        }
      );

      const updatedDistribuidorData = {
        users: [`/public/api/users/${usuario.id}`],
      };

      this.http.patch(`http://localhost:8080/public/partners/${distribuidor.id}`, updatedDistribuidorData, requestOptions).subscribe(
        (updatedDistribuidor: any) => {
        },
        (error) => {
          console.error(error);
          console.log('Error updating Distribuidor with Usuario ID');
        }
      );
    });
  }


}
