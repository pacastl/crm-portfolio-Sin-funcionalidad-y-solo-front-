
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatTableDataSource } from '@angular/material/table';
// import { Router } from '@angular/router';
// import { Observable, forkJoin, of } from 'rxjs';
// import { PartnerService } from 'src/app/shared/services/Partner.service';
// import { ClientService } from 'src/app/shared/services/client.service';
// import { AsignarDistribuidorModalComponent } from '../asignar-distribuidor-modal/asignar-distribuidor-modal.component';
// import { EditarEmpresaModalComponent } from '../editar-empresa-modal/editar-empresa-modal.component';
// import { ChangeDetectorRef } from '@angular/core';
// import { EditarCodigoModalComponent } from '../editar-codigo-modal/editar-codigo-modal.component';
// import { AuthService } from 'src/app/auth/Services/auth.service';
// import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
// import { BackendService } from '../../../shared/services/backend.service';


// export interface ClienteElement {
//   id: number;
//   name: string;
//   currentVersion: string;
//   active: boolean;
//   joinDate: string;
//   // codigoPromocional: string;
//   nif: string;
//   billing: string;
//   employees: number;
//   leaveDate: string;
//   referenceId: string;
//   phone: string;
//   code: CodigoDistribuidor;
//   contract: string;
// }
// export interface CodigoDistribuidor {
//   id: number;
//   code: string;
//   partnerEmails: EmailDistribuidor[];
// }
// export interface EmailDistribuidor {
//   id: number;
//   email: string;
// }


// // export interface DistribuidorElement {
// //   id: number;
// //   name: string;
// //   nif: string;
// //   tipo: string;
// //   active: boolean;
// //   empresas: number;
// //   margen: number;
// //   phone: string;
// // }
// export interface DistribuidorElement {
//   id: number;
//   // dni:string;
//   name: string;
//   active: boolean;
//   companies: number;
//   margin: number;
//   nif: string;
//   type: string;
//   phone: string;
//   codes: CodigoDistribuidor[];
//   emails: EmailDistribuidor[];
//   contract: string;
// }
// @Component({
//   selector: 'app-table',
//   templateUrl: './table.component.html',
//   styleUrls: ['./table.component.scss'],
// })


// export class TableComponent implements OnInit {
//   displayedColumns: string[] = ['nombre', 'codigo', 'email_aviso', 'activo', 'margen', 'empresas', 'acciones'];
//   displayedColumnsClient: string[] = ['nombre', 'version', 'activo', 'fecha', 'codigo', 'facturacion', 'empleados', 'acciones'];
//   isPartnerRoute!: boolean;
//   isXSmallScreen!: boolean;
//   selectedFile!: File;
//   element: DistribuidorElement | null = null; // Define the element property and initialize it as null
//   partnerIdClick!: number;
//   clientes: any[] = [];
//   distribuidores: any[] = [];
//   currentPage: number = 1;
//   pageSize: number = 50;
//   dataSource: MatTableDataSource<ClienteElement | DistribuidorElement>;

//   dataSourceCliente: MatTableDataSource<ClienteElement>;
//   private _filterValue: string = '';
//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @Input()

//   set filterValue(value: string) {
//     this._filterValue = value;

//     if (this.isPartnerRoute) {
//       this.applyFilterClient();
//     } else if (this.router.url.includes('admin')) {
//       this.applyFilter();
//     }


//   }
//   constructor(private clienteService: ClientService,
//     private distribuidorService: PartnerService,
//     private http: HttpClient,
//     private auth: AuthService,
//     private router: Router,
//     private dialog: MatDialog,
//     private breakpointObserver: BreakpointObserver,

//     private BackendService:BackendService,

//     // private changeDetectorRef: ChangeDetectorRef

//   ) {
//     this.dataSource = new MatTableDataSource();
//     this.dataSourceCliente = new MatTableDataSource();
//     this.breakpointObserver.observe([
//       Breakpoints.XSmall
//     ]).subscribe(result => {
//       this.isXSmallScreen = result.matches;
//     });

//   }
//   onNameClick(partnerId: number): void {
//     localStorage.setItem('partnerIdClick', partnerId.toString());
//     console.log(partnerId);
//     this.router.navigate(['/panel/partner']);

//   }
//   changePage(increment: boolean): void {
//     if (increment) {
//       this.currentPage++;
//     } else {
//       this.currentPage--;
//     }
//     this.fetchDistribuidores();
//   }

//   changePageClientes(increment: boolean): void {
//     if (increment) {
//       this.currentPage++;
//     } else {
//       this.currentPage--;
//     }
//     this.fetchClientes();
//   }
//   onDataUpdated(): void {
//     this.fetchDistribuidores();
//   }
//   redirectToNewDistributor() {
//     // this.router.navigate(['/admin/addDistri']);
//     this.router.navigate(['/panel/partner']);
//   }

//   ngOnInit() {
//     this.isPartnerRoute = this.router.url.includes('partner');
//     if (this.isPartnerRoute) {
//       this.fetchClientes();
//     } else if (this.router.url.includes('admin')) {
//       this.fetchDistribuidores();
//     }
//   }

//   ngAfterViewInit() {
//     this.dataSource.paginator = this.paginator;
//   }
//   isRouteAdmin(): boolean {
//     return this.router.url.includes('admin');
//   }

//   updateDistribuidor(updatedDistribuidor: DistribuidorElement): void {
//     // console.log(updatedDistribuidor);
//     const index = this.dataSource.data.findIndex(distribuidor => distribuidor.id === updatedDistribuidor.id);
//     // console.log(updatedDistribuidor);

//     if (index !== -1) {
//       this.dataSource.data[index] = updatedDistribuidor;


//       this.dataSource._updateChangeSubscription(); // Refresh the table data
//     }
//   }





//   openAsignarDistribuidorModal(distribuidor: DistribuidorElement): void {
//     const dialogRef = this.dialog.open(AsignarDistribuidorModalComponent, {
//       width: '600px',
//       data: {
//         distribuidor: distribuidor,
//         tableComponent: this, // Pass the reference of the TableComponent
//         allDistribuidors: this.dataSource.data
//       },
//     });
//     console.log(distribuidor);


//   }
//   openEditCodigoDistribuidorModal(code: CodigoDistribuidor, partner: DistribuidorElement): void {
//     const dialogRef = this.dialog.open(EditarCodigoModalComponent, {
//       width: '600px',
//       data: {
//         codigoDistribuidor: code,
//         distribuidor: partner,
//         // tableComponent: this,
//       },
//     });



//     dialogRef.componentInstance.dataUpdated.subscribe(() => {
//       this.onDataUpdated();
//     });

//   }
//   toggleClienteActive(cliente: ClienteElement): void {
//     const updatedCliente = {
//       ...cliente,
//       active: !cliente.active,
//     };

//       //TODO: api platform endpoint
//     const url = `http://localhost:8080/public/api/clients/${updatedCliente.id}`;
//     const payload = {
//       active: updatedCliente.active,
//     };

//     const httpOptions = {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/merge-patch+json',
//       }),
//     };

//     this.http.patch(url, payload, httpOptions).subscribe(
//       (response) => {
//         console.log('Cliente active field toggled successfully');
//         this.updateDataSourceactive(updatedCliente); // Update the dataSource
//         cliente.active = !cliente.active; // Update the icon
//       },
//       (error) => {
//         console.error(error);
//         console.log('Error toggling Cliente active field');
//       }
//     );
//   }
//   openEditarEmpresaModal(cliente: ClienteElement): void {
//     const dialogRef = this.dialog.open(EditarEmpresaModalComponent, {
//       data: {
//         id: cliente.id,
//         name: cliente.name,
//         nif: cliente.nif,
//       },
//     });

//     dialogRef.afterClosed().subscribe((result) => {
//       if (result) {
//         this.updateCliente(result);
//       }
//     });
//   }

//   updateCliente(updatedCliente: { id: number; name: string; nif: string }): void {
//       //TODO: api platform endpoint
//     const url = `http://localhost:8080/public/api/clients/${updatedCliente.id}`;
//     const payload = {
//       nif: updatedCliente.nif,
//       name: updatedCliente.name,
//     };

//     const httpOptions = {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/merge-patch+json',
//       }),
//     };

//     this.http.patch(url, payload, httpOptions).subscribe(
//       (response) => {
//         console.log('Cliente updated successfully');
//         this.updateDataSource(updatedCliente);
//       },
//       (error) => {
//         console.error(error);
//         console.log('Error updating Cliente');
//       }
//     );
//   }

//   updateDataSource(updatedCliente: { id: number; name: string; nif: string }): void {
//     const index = this.dataSource.data.findIndex((cliente) => cliente.id === updatedCliente.id);
//     if (index !== -1) {
//       this.dataSource.data[index].name = updatedCliente.name;
//       this.dataSource.data[index].nif = updatedCliente.nif;
//       this.dataSource._updateChangeSubscription(); // Refresh the table
//     }
//   }
//   updateDataSourceactive(updatedCliente: ClienteElement): void {
//     const index = this.dataSourceCliente.data.findIndex(c => c.id === updatedCliente.id);
//     if (index >= 0) {
//       const newData = [...this.dataSourceCliente.data]; // Create a new array with the current data
//       newData[index] = updatedCliente; // Update the element in the new array
//       this.dataSourceCliente.data = newData; // Assign the new array to the dataSource.data property
//       this.dataSourceCliente._updateChangeSubscription(); // Refresh the table
//     }
//   }


//   onFileSelected(file: File, element: DistribuidorElement): void {
//     this.selectedFile = file;
//     this.uploadFile(element);
//   }


//   openPdf(id: number): void {
//     this.http.get(`http://localhost:8080/public/getContract/${id}`).subscribe(
//       (response: any) => {
//         const base64Data = response.contractData;
//         const byteArray = atob(base64Data).split('').map(char => char.charCodeAt(0));
//         const blob = new Blob([new Uint8Array(byteArray)], { type: 'application/pdf' });
//         const fileURL = URL.createObjectURL(blob);
//         window.open(fileURL, '_blank');
//       },
//       (error) => {
//         console.error('Error fetching contract data:', error);
//       }
//     );
//   }
//   uploadFile(element: DistribuidorElement): void {
//     const formData = new FormData();
//     formData.append('contract', this.selectedFile);

//     this.http.post(`http://localhost:8080/public/uploadContract/${element.id}`, formData).subscribe(
//       (response: any) => {
//         console.log('File uploaded successfully');
//         element.contract = response.url; // Store the PDF URL in the element.contract field
//       },
//       (error) => {
//         console.error('Error uploading file:', error);
//       }
//     );
//   }

//   applyFilter() {
//     this.dataSource.filterPredicate = (data: any, filter: string) => {
//       const distribuidorData = data as DistribuidorElement;
//       const searchString = filter.trim().toLowerCase();
//       const codigoMatch = distribuidorData.codes.some((codigoDistribuidor: CodigoDistribuidor) => codigoDistribuidor.code.toLowerCase().includes(searchString));
//       const emailMatch = distribuidorData.emails.some((emailDistribuidor: EmailDistribuidor) => emailDistribuidor.email.toLowerCase().includes(searchString));
//       const margenMatch = distribuidorData.margin.toString().startsWith(searchString);
//       const empresasMatch = distribuidorData.companies.toString().startsWith(searchString);

//       return distribuidorData.name.toLowerCase().includes(searchString)
//         ||

//         codigoMatch ||
//         emailMatch ||
//         margenMatch ||
//         empresasMatch;
//     };

//     this.dataSource.filter = this._filterValue;


//   }



//   applyFilterClient() {
//     this.dataSource.filterPredicate = (data: any, filter: string) => {
//       if (!filter) {
//         return true;
//       }
//       const clienteData = data as ClienteElement;
//       const searchString = filter.trim().toLowerCase();

//       const nameMatch = clienteData.name.toLowerCase().includes(searchString);
//       const versionMatch = clienteData.currentVersion.toLowerCase().includes(searchString);


//       const activeMatch = clienteData.active.toString().startsWith(searchString);
//       const joinDateMatch = clienteData.joinDate && clienteData.joinDate.toLowerCase().includes(searchString);
//       //  console.log(clienteData.employees);
//       const codigoPromocionalMatch = clienteData.code.code.toLowerCase().includes(searchString);
//       const billingMatch = clienteData.billing && clienteData.billing.toLowerCase().includes(searchString);

//       const employeesMatch = clienteData.employees.toString().includes(searchString);

//       return nameMatch ||
//         versionMatch ||
//         activeMatch ||
//         joinDateMatch ||
//         codigoPromocionalMatch ||
//         billingMatch ||
//         employeesMatch ||
//         false;
//     };

//     this.dataSource.filter = this._filterValue;

//     if (this.dataSource.paginator) {
//       this.dataSource.paginator.firstPage();
//     }

//   }
// // TODO: funciona bien
//   fetchClientes(): void {
//     const distribuidorId = this.auth.getUserPartnerId();
//     const clickedDistribuidorId = localStorage.getItem('partnerIdClick');

//     console.log(clickedDistribuidorId);
//     const actualDistribuidorId = clickedDistribuidorId ? parseInt(clickedDistribuidorId, 10) : distribuidorId;

//     if (actualDistribuidorId) {
//       this.clienteService.getClientesByDistribuidor(actualDistribuidorId, this.currentPage).subscribe((response: any) => {
//         const clientes = response;

//         const codigoDistribuidorRequests: Observable<any>[] = clientes.map((cliente: any) => {
//           return this.clienteService.getCodigoDistribuidorsByCliente(cliente.id);
//         });

//         forkJoin(codigoDistribuidorRequests).subscribe((codigoDistribuidorResponses: any[]) => {
//           this.dataSource.data = clientes.map((cliente: any, index: number) => {
//             const codigoDistribuidor = codigoDistribuidorResponses[index];

//             return {
//               id: cliente.id,
//               name: cliente.name,
//               currentVersion: cliente.currentVersion,
//               active: cliente.active,
//               joinDate: cliente.joinDate,
//               nif: cliente.nif,
//               billing: cliente.billing,
//               employees: cliente.employees,
//               leaveDate: cliente.leaveDate,
//               referenceId: cliente.referenceId,
//               phone: cliente.phone,
//               code: codigoDistribuidor
//             };


//           });
//         });
//       });
//     }
//   }

// fetchDistribuidores(): void {
//   this.distribuidorService.getDistribuidoresWithCodesAndEmails(this.currentPage, this.pageSize)
//     .subscribe((response: any) => {
//       const distribuidores = response;

//       if (Array.isArray(distribuidores) && distribuidores.length > 0) {
//         console.log('Distribuidores:', distribuidores);

//         this.dataSource.data = distribuidores.map((distribuidor: any) => {
//           console.log('Current distribuidor:', distribuidor);
//           console.log('Codes:', distribuidor.codes);

//           // Extract all email addresses from the 'partnerEmails' array within the 'codes' array
//           const allEmails = distribuidor.codes.flatMap((code: any) => {
//             console.log('Partner Code:', code.code);
//             console.log('Partner Emails:', code.partnerEmails);

//             return code.partnerEmails.map((partnerEmail: any) => {
//               console.log('Email:', partnerEmail.email);
//               return { id: partnerEmail.id, email: partnerEmail.email }; // Return an object with email and id
//             });
//           });

//           console.log('All Emails:', allEmails);

//           return {
//             id: distribuidor.id,
//             dni: distribuidor.dni,
//             name: distribuidor.name,
//             margin: distribuidor.margin,
//             companies: distribuidor.companies,
//             active: distribuidor.active,
//             nif: distribuidor.nif,
//             type: distribuidor.type,
//             phone: distribuidor.phone,
//             contract: distribuidor.contract,
//             codes: (distribuidor.codes || []).map((partnerCode: any) => ({
//               id: partnerCode.id,
//               code: partnerCode.code,
//               partnerEmails: (partnerCode.partnerEmails || []).map((partnerEmail: any) => ({
//                 id: partnerEmail.id,
//                 email: partnerEmail.email
//               }))
//             })),
//             emails: allEmails || [] // Populate the 'emails' array with extracted email addresses
//           };
//         });
//       }
//     });
// }

// }


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { PartnerService } from 'src/app/shared/services/Partner.service';
import { ClientService } from 'src/app/shared/services/client.service';
import { AsignarDistribuidorModalComponent } from '../asignar-distribuidor-modal/asignar-distribuidor-modal.component';
import { EditarEmpresaModalComponent } from '../editar-empresa-modal/editar-empresa-modal.component';
import { ChangeDetectorRef } from '@angular/core';
import { EditarCodigoModalComponent } from '../editar-codigo-modal/editar-codigo-modal.component';
import { AuthService } from 'src/app/auth/Services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BackendService } from '../../../shared/services/backend.service';


export interface ClienteElement {
  id: number;
  name: string;
  currentVersion: string;
  active: boolean;
  joinDate: string;
  // codigoPromocional: string;
  nif: string;
  billing: string;
  employees: number;
  leaveDate: string;
  referenceId: string;
  phone: string;
  code: CodigoDistribuidor;
  contract: string;
}
export interface CodigoDistribuidor {
  id: number;
  code: string;
  partnerEmails: EmailDistribuidor[];
}
export interface EmailDistribuidor {
  id: number;
  email: string;
}


// export interface DistribuidorElement {
//   id: number;
//   name: string;
//   nif: string;
//   tipo: string;
//   active: boolean;
//   empresas: number;
//   margen: number;
//   phone: string;
// }

// estrcutura de un distribuidor
export interface DistribuidorElement {
  id: number;
  // dni:string;
  name: string;
  active: boolean;
  companies: number;
  margin: number;
  nif: string;
  type: string;
  phone: string;
  codes: CodigoDistribuidor[];
  emails: EmailDistribuidor[];
  contract: string;
}
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})


export class TableComponent implements OnInit {
   // Columnas que se muestran en la tabla (vista admin)
  displayedColumns: string[] = ['nombre', 'codigo', 'email_aviso', 'activo', 'margen', 'empresas', 'acciones'];

  // Columnas que se muestran en la tabla (vista partner)
  displayedColumnsClient: string[] = ['nombre', 'version', 'activo', 'fecha', 'codigo', 'facturacion', 'empleados', 'acciones'];
  isPartnerRoute!: boolean;
  isXSmallScreen!: boolean;
  selectedFile!: File;
  // Elemento actual en la tabla
  element: DistribuidorElement | null = null; // Define the element property and initialize it as null
  // ID del partner seleccionado, lo uso para saber
  // el partner al quese ha hecho click y mostrar sus datos
  partnerIdClick!: number;
  clientes: any[] = [];
  distribuidores: any[] = [];
  currentPage: number = 1;
  pageSize: number = 50;
  //datos de la tabla para mostrar los distribuidores
  dataSource: MatTableDataSource<ClienteElement | DistribuidorElement>;
  //datos de la tabla para mostrar los clientes
  dataSourceCliente: MatTableDataSource<ClienteElement>;

  // valor del término de búsqueda
  private _filterValue: string = '';
  public tableData= [{
    "id": 229,
    "dni": "11176390Y",
    "name": "Thompson-Schuster",
    "margin": 43,
    "companies": 1,
    "active": true,
    "nif": "11176390Y",
    "type": "Partner",
    "phone": "313301588",
    "contract": null,
    "codes": [
        {
            "id": 134,
            "code": "est",
            "partnerEmails": [
                {
                    "id": 68,
                    "email": "celia51@example.org"
                },
                {
                    "id": 69,
                    "email": "lhowell@example.org"
                },
                {
                    "id": 70,
                    "email": "yleannon@example.net"
                },
                {
                    "id": 71,
                    "email": "ondricka.anita@example.org"
                },
                {
                    "id": 72,
                    "email": "dakota06@example.org"
                }
            ]
        }
    ],
    "emails": [
        {
            "id": 68,
            "email": "celia51@example.org"
        },
        {
            "id": 69,
            "email": "lhowell@example.org"
        },
        {
            "id": 70,
            "email": "yleannon@example.net"
        },
        {
            "id": 71,
            "email": "ondricka.anita@example.org"
        },
        {
            "id": 72,
            "email": "dakota06@example.org"
        }
    ]
},
{
    "id": 230,
    "dni": "71599521K",
    "name": "Kovacek and Sons",
    "margin": 3,
    "companies": 8,
    "active": true,
    "nif": "71599521K",
    "type": "Partner Supra",
    "phone": "168492701",
    "contract": null,
    "codes": [
        {
            "id": 125,
            "code": "aut",
            "partnerEmails": [
                {
                    "id": 68,
                    "email": "celia51@example.org"
                }
            ]
        }
    ],
    "emails": [
        {
            "id": 68,
            "email": "celia51@example.org"
        }
    ]
},
{
  "id": 229,
  "dni": "11176390Y",
  "name": "Thompson-Schuster",
  "margin": 43,
  "companies": 1,
  "active": true,
  "nif": "11176390Y",
  "type": "Partner",
  "phone": "313301588",
  "contract": null,
  "codes": [
      {
          "id": 134,
          "code": "est",
          "partnerEmails": [
              {
                  "id": 68,
                  "email": "celia51@example.org"
              },
              {
                  "id": 69,
                  "email": "lhowell@example.org"
              },
              {
                  "id": 70,
                  "email": "yleannon@example.net"
              },
              {
                  "id": 71,
                  "email": "ondricka.anita@example.org"
              },
              {
                  "id": 72,
                  "email": "dakota06@example.org"
              }
          ]
      }
  ],
  "emails": [
      {
          "id": 68,
          "email": "celia51@example.org"
      },
      {
          "id": 69,
          "email": "lhowell@example.org"
      },
      {
          "id": 70,
          "email": "yleannon@example.net"
      },
      {
          "id": 71,
          "email": "ondricka.anita@example.org"
      },
      {
          "id": 72,
          "email": "dakota06@example.org"
      }
  ]
},
{
  "id": 230,
  "dni": "71599521K",
  "name": "Kovacek and Sons",
  "margin": 3,
  "companies": 8,
  "active": true,
  "nif": "71599521K",
  "type": "Partner Supra",
  "phone": "168492701",
  "contract": null,
  "codes": [
      {
          "id": 125,
          "code": "aut",
          "partnerEmails": [
              {
                  "id": 68,
                  "email": "celia51@example.org"
              }
          ]
      }
  ],
  "emails": [
      {
          "id": 68,
          "email": "celia51@example.org"
      }
  ]
},
{
  "id": 231,
  "dni": "92581994B",
  "name": "Schaefer-Considine",
  "margin": 88,
  "companies": 3,
  "active": true,
  "nif": "92581994B",
  "type": "Referenciador",
  "phone": "181111248",
  "contract": null,
  "codes": [
      {
          "id": 126,
          "code": "facere",
          "partnerEmails": [
              {
                  "id": 68,
                  "email": "celia51@example.org"
              }
          ]
      }
  ],
  "emails": [
      {
          "id": 68,
          "email": "celia51@example.org"
      }
  ]
},
{
  "id": 232,
  "dni": "39943814X",
  "name": "Gusikowski Ltd",
  "margin": 69,
  "companies": 6,
  "active": true,
  "nif": "39943814X",
  "type": "Referenciador",
  "phone": "934857321",
  "contract": null,
  "codes": [
      {
          "id": 127,
          "code": "dignissimos",
          "partnerEmails": [
              {
                  "id": 69,
                  "email": "lhowell@example.org"
              }
          ]
      }
  ],
  "emails": [
      {
          "id": 69,
          "email": "lhowell@example.org"
      }
  ]
},
{
  "id": 233,
  "dni": "43694770R",
  "name": "Wilkinson-Cruickshank",
  "margin": 24,
  "companies": 3,
  "active": false,
  "nif": "43694770R",
  "type": "Referenciador",
  "phone": "000324574",
  "contract": null,
  "codes": [
      {
          "id": 128,
          "code": "eaque",
          "partnerEmails": [
              {
                  "id": 70,
                  "email": "yleannon@example.net"
              }
          ]
      }
  ],
  "emails": [
      {
          "id": 70,
          "email": "yleannon@example.net"
      }
  ]
},
{
  "id": 234,
  "dni": "22927468R",
  "name": "Hirthe LLC",
  "margin": 38,
  "companies": 10,
  "active": true,
  "nif": "22927468R",
  "type": "Partner Supra",
  "phone": "484940074",
  "contract": null,
  "codes": [
      {
          "id": 129,
          "code": "adipisci",
          "partnerEmails": [
              {
                  "id": 70,
                  "email": "yleannon@example.net"
              }
          ]
      }
  ],
  "emails": [
      {
          "id": 70,
          "email": "yleannon@example.net"
      }
  ]
},
{
  "id": 235,
  "dni": "94534212V",
  "name": "Sanford Group",
  "margin": 67,
  "companies": 3,
  "active": true,
  "nif": "94534212V",
  "type": "Referenciador",
  "phone": "692088858",
  "contract": null,
  "codes": [
      {
          "id": 130,
          "code": "voluptate",
          "partnerEmails": [
              {
                  "id": 71,
                  "email": "ondricka.anita@example.org"
              }
          ]
      }
  ],
  "emails": [
      {
          "id": 71,
          "email": "ondricka.anita@example.org"
      }
  ]
},
{
  "id": 236,
  "dni": "75001335E",
  "name": "Heaney LLC",
  "margin": 48,
  "companies": 2,
  "active": false,
  "nif": "75001335E",
  "type": "Partner",
  "phone": "973205511",
  "contract": null,
  "codes": [
      {
          "id": 131,
          "code": "impedit",
          "partnerEmails": [
              {
                  "id": 71,
                  "email": "ondricka.anita@example.org"
              }
          ]
      }
  ],
  "emails": [
      {
          "id": 71,
          "email": "ondricka.anita@example.org"
      }
  ]
},
{
  "id": 237,
  "dni": "70588855U",
  "name": "Bergnaum Ltd",
  "margin": 97,
  "companies": 2,
  "active": false,
  "nif": "70588855U",
  "type": "Partner",
  "phone": "900723400",
  "contract": null,
  "codes": [
      {
          "id": 132,
          "code": "consectetur",
          "partnerEmails": [
              {
                  "id": 72,
                  "email": "dakota06@example.org"
              }
          ]
      }
  ],
  "emails": [
      {
          "id": 72,
          "email": "dakota06@example.org"
      }
  ]
},
{
  "id": 238,
  "dni": "59716826C",
  "name": "Heathcote-Dietrich",
  "margin": 63,
  "companies": 5,
  "active": true,
  "nif": "59716826C",
  "type": "Partner",
  "phone": "579090212",
  "contract": null,
  "codes": [
      {
          "id": 133,
          "code": "quia",
          "partnerEmails": [
              {
                  "id": 72,
                  "email": "dakota06@example.org"
              }
          ]
      }
  ],
  "emails": [
      {
          "id": 72,
          "email": "dakota06@example.org"
      }
  ]
},
{
  "id": 239,
  "dni": "62562625B",
  "name": "Schmidt-Ebert",
  "margin": 69,
  "companies": 10,
  "active": true,
  "nif": "62562625B",
  "type": "Partner Supra",
  "phone": "818242597",
  "contract": null,
  "codes": [
      {
          "id": 143,
          "code": "quidem",
          "partnerEmails": [
              {
                  "id": 73,
                  "email": "marion43@example.org"
              },
              {
                  "id": 74,
                  "email": "jovanny85@example.org"
              },
              {
                  "id": 75,
                  "email": "cconnelly@example.com"
              },
              {
                  "id": 76,
                  "email": "hkemmer@example.net"
              },
              {
                  "id": 77,
                  "email": "koepp.alvera@example.com"
              },
              {
                  "id": 78,
                  "email": "hill.michaela@example.org"
              }
          ]
      }
  ],
  "emails": [
      {
          "id": 73,
          "email": "marion43@example.org"
      },
      {
          "id": 74,
          "email": "jovanny85@example.org"
      },
      {
          "id": 75,
          "email": "cconnelly@example.com"
      },
      {
          "id": 76,
          "email": "hkemmer@example.net"
      },
      {
          "id": 77,
          "email": "koepp.alvera@example.com"
      },
      {
          "id": 78,
          "email": "hill.michaela@example.org"
      }
  ]
},
{
  "id": 240,
  "dni": "85809681T",
  "name": "Lemke-Bogan",
  "margin": 6,
  "companies": 3,
  "active": true,
  "nif": "85809681T",
  "type": "Referenciador",
  "phone": "377778385",
  "contract": null,
  "codes": [
      {
          "id": 135,
          "code": "sed",
          "partnerEmails": [
              {
                  "id": 73,
                  "email": "marion43@example.org"
              }
          ]
      }
  ],
  "emails": [
      {
          "id": 73,
          "email": "marion43@example.org"
      }
  ]
},
{
  "id": 241,
  "dni": "48622500H",
  "name": "Cruickshank-Pacocha",
  "margin": 33,
  "companies": 5,
  "active": false,
  "nif": "48622500H",
  "type": "Partner Supra",
  "phone": "774217851",
  "contract": null,
  "codes": [
      {
          "id": 136,
          "code": "porro",
          "partnerEmails": [
              {
                  "id": 74,
                  "email": "jovanny85@example.org"
              }
          ]
      }
  ],
  "emails": [
      {
          "id": 74,
          "email": "jovanny85@example.org"
      }
  ]
},
{
  "id": 242,
  "dni": "49074937E",
  "name": "Nolan, Bernier and Eichmann",
  "margin": 37,
  "companies": 1,
  "active": false,
  "nif": "49074937E",
  "type": "Partner",
  "phone": "677522431",
  "contract": null,
  "codes": [
      {
          "id": 137,
          "code": "ea",
          "partnerEmails": [
              {
                  "id": 75,
                  "email": "cconnelly@example.com"
              }
          ]
      }
  ],
  "emails": [
      {
          "id": 75,
          "email": "cconnelly@example.com"
      }
  ]
},
{
  "id": 243,
  "dni": "92049868L",
  "name": "Torphy-Hayes",
  "margin": 42,
  "companies": 3,
  "active": false,
  "nif": "92049868L",
  "type": "Partner",
  "phone": "003347002",
  "contract": null,
  "codes": [
      {
          "id": 138,
          "code": "autem",
          "partnerEmails": [
              {
                  "id": 76,
                  "email": "hkemmer@example.net"
              }
          ]
      }
  ],
  "emails": [
      {
          "id": 76,
          "email": "hkemmer@example.net"
      }
  ]
},
{
  "id": 244,
  "dni": "18385866N",
  "name": "Collier-Senger",
  "margin": 99,
  "companies": 3,
  "active": false,
  "nif": "18385866N",
  "type": "Referenciador",
  "phone": "708558981",
  "contract": null,
  "codes": [
      {
          "id": 139,
          "code": "doloremque",
          "partnerEmails": [
              {
                  "id": 77,
                  "email": "koepp.alvera@example.com"
              }
          ]
      }
  ],
  "emails": [
      {
          "id": 77,
          "email": "koepp.alvera@example.com"
      }
  ]
},
{
  "id": 245,
  "dni": "44194960F",
  "name": "Macejkovic-Welch",
  "margin": 92,
  "companies": 8,
  "active": false,
  "nif": "44194960F",
  "type": "Referenciador",
  "phone": "601538093",
  "contract": null,
  "codes": [
      {
          "id": 140,
          "code": "vitae",
          "partnerEmails": [
              {
                  "id": 77,
                  "email": "koepp.alvera@example.com"
              }
          ]
      }
  ],
  "emails": [
      {
          "id": 77,
          "email": "koepp.alvera@example.com"
      }
  ]
},
{
  "id": 246,
  "dni": "13262671Z",
  "name": "Cronin-Kessler",
  "margin": 82,
  "companies": 7,
  "active": true,
  "nif": "13262671Z",
  "type": "Partner Supra",
  "phone": "657006227",
  "contract": null,
  "codes": [
      {
          "id": 141,
          "code": "et",
          "partnerEmails": [
              {
                  "id": 78,
                  "email": "hill.michaela@example.org"
              }
          ]
      }
  ],
  "emails": [
      {
          "id": 78,
          "email": "hill.michaela@example.org"
      }
  ]
},

]

public originalData = [...this.tableData];

  // paginador de la tabla
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input()

  // establece el valor del filtro para la búsqueda
  set filterValue(value: string) {
    this._filterValue = value;

    if (this.isPartnerRoute) {
      this.applyFilterClient();
    } else if (this.router.url.includes('admin')) {
      this.applyFilter();
    }


  }
  constructor(private clienteService: ClientService,
    private distribuidorService: PartnerService,
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,

    private backendService:BackendService,

    // private changeDetectorRef: ChangeDetectorRef

  ) {
    this.dataSource = new MatTableDataSource();
    this.dataSourceCliente = new MatTableDataSource();
    this.breakpointObserver.observe([
      Breakpoints.XSmall
    ]).subscribe(result => {
      this.isXSmallScreen = result.matches;
    });

  }

  // click en el nombre de un partner
  onNameClick(partnerId: number): void {
    // al hacer click en un partner se almacena su id para cargar su info
    localStorage.setItem('partnerIdClick', partnerId.toString());
    // console.log(partnerId);

    // regirige a la vista del partner para mostrar su info
    this.router.navigate(['/panel/partner']);

  }
  // gestiona la página actual del paginador de distribuidores
  changePage(increment: boolean): void {
    if (increment) {
      this.currentPage++;
    } else {
      this.currentPage--;
    }
    this.fetchDistribuidores(); //carga los datos de esa página
  }

  // gestiona la página actual del paginador de clientes

  changePageClientes(increment: boolean): void {
    if (increment) {
      this.currentPage++;
    } else {
      this.currentPage--;
    }
    this.fetchClientes();
  }
  // actualiza los datos de la tabla después de un cambio
  onDataUpdated(): void {
    this.fetchDistribuidores();
  }
  // redirige a la vista de agregar un nuevo distribuidor
  redirectToNewDistributor() {
    // this.router.navigate(['/admin/addDistri']);
    this.router.navigate(['/panel/partner']);
  }

  ngOnInit() {
    // Verifica si la ruta es para un partner
    this.isPartnerRoute = this.router.url.includes('partner');
    if (this.isPartnerRoute) {
      this.fetchClientes();
      // Verifica si la ruta es para un admin
    } else if (this.router.url.includes('admin')) {
      this.fetchDistribuidores();
      console.log( this.fetchDistribuidores());

    }
  }

  // se ejecuta después de inicializar las vistas hijos
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  // isRouteAdmin(): boolean {
  //   return this.router.url.includes('admin');
  // }

  updateDistribuidor(updatedDistribuidor: DistribuidorElement): void {
    // console.log(updatedDistribuidor);

    // busca el índice del distribuidor actualizado en los datos de la tabla
    const index = this.dataSource.data.findIndex(distribuidor => distribuidor.id === updatedDistribuidor.id);
    // console.log(updatedDistribuidor);
    // findIndex devuelve -1 si no encuentra el elemento
    if (index !== -1) {
      // Actualiza los datos del distribuidor
      this.dataSource.data[index] = updatedDistribuidor;

      this.dataSource._updateChangeSubscription(); // Actualiza la tabla para mostrar los cambios
    }
  }


  // abre el modal de asignar distribuidor
  openAsignarDistribuidorModal(distribuidor: DistribuidorElement): void {
    const dialogRef = this.dialog.open(AsignarDistribuidorModalComponent, {
      width: '600px',
      data: {
        // distribuidor: distribuidor, distribuidor seleccionado
        distribuidor: distribuidor,
        // Pasa la referencia del componente de la tabla desde el que se abre el diálogo
        //le da acceso a los distribuidores como datos porque hay que mostrar todos sus codigos y nombres
        tableComponent: this,
        allDistribuidors: this.dataSource.data
      },
    });
    // console.log(distribuidor);
  }


  // modal para editar los codigos
  openEditCodigoDistribuidorModal(code: CodigoDistribuidor, partner: DistribuidorElement): void {
    const dialogRef = this.dialog.open(EditarCodigoModalComponent, {
      width: '600px',
      data: {
        codigoDistribuidor: code,
        distribuidor: partner,
        // tableComponent: this,
      },
    });
     // Subscribe al evento de actualización de datos
    dialogRef.componentInstance.dataUpdated.subscribe(() => {
      this.onDataUpdated(); // Actualiza los datos al recibir una actualización
    });

  }
  // alternar si un cliente está acitvado o desactivado
  toggleClienteActive(cliente: ClienteElement): void {
    const updatedCliente = { ...cliente, active: !cliente.active }; //copia del cliente con el estado activo invertido
    const url = `http://localhost:8080/public/api/clients/${updatedCliente.id}`;
    const payload = { active: updatedCliente.active };

    this.backendService.toggleClienteActive(url, payload).subscribe(
      (response) => {
        console.log('Cliente active field toggled successfully');
        this.updateDataSourceactive(updatedCliente);
        cliente.active = !cliente.active;// para mostrar el cambio en la tabla
      },
      (error) => {
        console.error(error);
        console.log('Error toggling Cliente active field');
      }
    );
  }
  //  abre el modal de edición de empresa
  openEditarEmpresaModal(cliente: ClienteElement): void {
    const dialogRef = this.dialog.open(EditarEmpresaModalComponent, {
      data: {
        id: cliente.id,
        name: cliente.name,
        nif: cliente.nif,
      },
    });
    // subscribe al evento después de cerrar el modal
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Actualiza el cliente con los nuevos datos
        this.updateCliente(result);
      }
    });
  }
// TODO: funciona
updateCliente(updatedCliente: { id: number; name: string; nif: string }): void {
  this.backendService.updateCliente(updatedCliente.id, { name: updatedCliente.name, nif: updatedCliente.nif }).subscribe(
    (response) => {
      console.log('Cliente actualizado con éxito');
      this.updateDataSource(updatedCliente); // Actualizar el cliente en la tabla
    },
    (error) => {
      console.error(error);
      console.log('Error updating Cliente');
    }
  );
}
// actualiza los datos en la tabla para mostrar los cambios
  updateDataSource(updatedCliente: { id: number; name: string; nif: string }): void {
    const index = this.dataSource.data.findIndex((cliente) => cliente.id === updatedCliente.id);
    if (index !== -1) {
      this.dataSource.data[index].name = updatedCliente.name;
      this.dataSource.data[index].nif = updatedCliente.nif;
      this.dataSource._updateChangeSubscription(); // Actualiza la tabla
    }
  }
  // Método para actualizar los datos con un cliente activo actualizado
  updateDataSourceactive(updatedCliente: ClienteElement): void {
    const index = this.dataSourceCliente.data.findIndex(c => c.id === updatedCliente.id);
    if (index >= 0) {
      const newData = [...this.dataSourceCliente.data]; // Crear un nuevo array con los datos actuales
      newData[index] = updatedCliente; // Actualiza el elemento en el nuevo array
      this.dataSourceCliente.data = newData; // asigna el nuevo array a la propiedad dataSource.data
      this.dataSourceCliente._updateChangeSubscription(); // Actualiza la tabla
    }
  }

  // gestiona un archivo seleccionado
  onFileSelected(file: File, element: DistribuidorElement): void {
    this.selectedFile = file; //asigna el archivo
    this.uploadFile(element); //Lo sube
  }

  // abre el pdf en una nueva pestaña del navegador
  openPdf(id: number): void {
    // obtiene los datos del pdf
    this.backendService.getContractData(id).subscribe(
      (response: any) => {
        const base64Data = response.contractData;
        const byteArray = atob(base64Data).split('').map(char => char.charCodeAt(0));
        const blob = new Blob([new Uint8Array(byteArray)], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, '_blank'); //abre el pdf en la pestaña con la url del documento
      },
      (error) => {
        console.error('Error al obtener los datos del contrato:', error);
      }
    );
  }

  // para subir un archivo
  uploadFile(element: DistribuidorElement): void {
    if (!this.selectedFile) {
      console.error('No se ha seleccionado ningún archivo');
      return;
    }

    this.backendService.uploadFile(element.id, this.selectedFile).subscribe(
      (response: any) => {
        console.log('File uploaded successfully');
        element.contract = response.url; // Almacena la URL del PDF en el campo contract del elemento
      },
      (error) => {
        console.error('Error uploading file:', error);
      }
    );
  }
  // filtro de búsqueda a la tabla de distribuidores
  // applyFilter() {
  //   this.dataSource.filterPredicate = (data: any, filter: string) => {
  //     const distribuidorData = data as DistribuidorElement;
  //     // lo paso a minúsuclas para que no importe si escribe ne mayúsculas o minúsculas
  //     const searchString = filter.trim().toLowerCase();
  //     const codigoMatch = distribuidorData.codes.some((codigoDistribuidor: CodigoDistribuidor) => codigoDistribuidor.code.toLowerCase().includes(searchString));
  //     const emailMatch = distribuidorData.emails.some((emailDistribuidor: EmailDistribuidor) => emailDistribuidor.email.toLowerCase().includes(searchString));
  //     const margenMatch = distribuidorData.margin.toString().startsWith(searchString);
  //     const empresasMatch = distribuidorData.companies.toString().startsWith(searchString);

  //     // mira si hay coincidencias en los campos (dentro de los datos de la tabla)
  //     // en el nombre,código, email,margen o empresas
  //     return distribuidorData.name.toLowerCase().includes(searchString)
  //       ||

  //       codigoMatch ||
  //       emailMatch ||
  //       margenMatch ||
  //       empresasMatch;
  //   };
  //   // aplica el filtro
  //   this.dataSource.filter = this._filterValue;


  // }
  applyFilter() {
    const searchString = this._filterValue.trim().toLowerCase();
    if (!searchString) {
      // Reset the data array if the search string is empty
      this.tableData = [...this.originalData]; // Reset to the original unfiltered data
      return;
    }

    this.tableData = this.originalData.filter((data: any) => {
      const distribuidorData = data as DistribuidorElement;

      // Check if any of the properties match the search string
      const nameMatch = distribuidorData.name.toLowerCase().includes(searchString);
      const codigoMatch = distribuidorData.codes.some((codigoDistribuidor: CodigoDistribuidor) => codigoDistribuidor.code.toLowerCase().includes(searchString));
      const emailMatch = distribuidorData.emails.some((emailDistribuidor: EmailDistribuidor) => emailDistribuidor.email.toLowerCase().includes(searchString));
      const margenMatch = distribuidorData.margin.toString().startsWith(searchString);
      const empresasMatch = distribuidorData.companies.toString().startsWith(searchString);

      // Return true if any property matches the search string
      return nameMatch || codigoMatch || emailMatch || margenMatch || empresasMatch;
    });
  }



  // filtro de búsqueda a la tabla de clientes
  applyFilterClient() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      if (!filter) {
        return true;
      }
      const clienteData = data as ClienteElement;
      const searchString = filter.trim().toLowerCase();

      const nameMatch = clienteData.name.toLowerCase().includes(searchString);
      const versionMatch = clienteData.currentVersion.toLowerCase().includes(searchString);


      const activeMatch = clienteData.active.toString().startsWith(searchString);
      const joinDateMatch = clienteData.joinDate && clienteData.joinDate.toLowerCase().includes(searchString);
      //  console.log(clienteData.employees);
      const codigoPromocionalMatch = clienteData.code.code.toLowerCase().includes(searchString);
      const billingMatch = clienteData.billing && clienteData.billing.toLowerCase().includes(searchString);

      const employeesMatch = clienteData.employees.toString().includes(searchString);

      return nameMatch ||
        versionMatch ||
        activeMatch ||
        joinDateMatch ||
        codigoPromocionalMatch ||
        billingMatch ||
        employeesMatch ||
        false;
    };

    this.dataSource.filter = this._filterValue; // Aplica el valor del filtro a los datos de la tabla

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); //va a la primera página del paginador si está disponible
    }

  }
// TODO: funciona bien
// obteniene clientes de la API
  fetchClientes(): void {
    // Obtener el ID del distribuidor del usuario autenticado (del localStorage)
    const distribuidorId = this.auth.getUserPartnerId();
    // Obtiene el ID del distribuidor seleccionado
    const clickedDistribuidorId = localStorage.getItem('partnerIdClick');

    // console.log(clickedDistribuidorId);

    // Obtiene el ID del distribuidor actual
    // Si hemos hecho click en un partner, actualDistribuidorId toma tu id y sino, somos un partner por lo que nos quedamos con nuestro id
    const actualDistribuidorId = clickedDistribuidorId ? parseInt(clickedDistribuidorId, 10) : distribuidorId;

    // actualDistribuidorId siempre tendrá valor ya sea nuestor id o del partner que hemos hecho click
    if (actualDistribuidorId) {
      // obtiene los clientes asociados al distribuidor actual
      this.clienteService.getClientesByDistribuidor(actualDistribuidorId, this.currentPage).subscribe((response: any) => {
        const clientes = response;

        // obtiene los códigos de distribuidor asociados a cada cliente
        const codigoDistribuidorRequests: Observable<any>[] = clientes.map((cliente: any) => {
          return this.clienteService.getCodigoDistribuidorsByCliente(cliente.id);
        });
         // combina las solicitudes para asignar el valor de los códigos
        forkJoin(codigoDistribuidorRequests).subscribe((codigoDistribuidorResponses: any[]) => {
           // mapea los clientes con sus respectivos códigos de distribuidor
          this.dataSource.data = clientes.map((cliente: any, index: number) => {
            const codigoDistribuidor = codigoDistribuidorResponses[index];

            return {
              id: cliente.id,
              name: cliente.name,
              currentVersion: cliente.currentVersion,
              active: cliente.active,
              joinDate: cliente.joinDate,
              nif: cliente.nif,
              billing: cliente.billing,
              employees: cliente.employees,
              leaveDate: cliente.leaveDate,
              referenceId: cliente.referenceId,
              phone: cliente.phone,
              // Hemos añadido el código de distribuidor al cliente
              code: codigoDistribuidor
            };


          });
        });
      });
    }
  }

// fetchDistribuidores(): void {
//   this.distribuidorService.getDistribuidoresWithCodesAndEmails(this.currentPage, this.pageSize)
//     .subscribe((response: any) => {
//       const distribuidores = response;

//       if (Array.isArray(distribuidores) && distribuidores.length > 0) {
//         console.log('Distribuidores:', distribuidores);

//         this.dataSource.data = distribuidores.map((distribuidor: any) => {
//           // console.log('Current distribuidor:', distribuidor);
//            console.log('Codes:', distribuidor.codes);

//           // Extract all email addresses from the 'partnerEmails' array within the 'codes' array
//           const allEmails = distribuidor.codes.flatMap((code: any) => {
//             // console.log('Partner Code:', code.code);
//             // console.log('Partner Emails:', code.partnerEmails);

//             return code.partnerEmails.map((partnerEmail: any) => {
//               // console.log('Email:', partnerEmail.email);
//               return { id: partnerEmail.id, email: partnerEmail.email }; // Return an object with email and id
//             });
//           });

//            console.log('All Emails:', allEmails);

//           return {
//             id: distribuidor.id,
//             dni: distribuidor.dni,
//             name: distribuidor.name,
//             margin: distribuidor.margin,
//             companies: distribuidor.companies,
//             active: distribuidor.active,
//             nif: distribuidor.nif,
//             type: distribuidor.type,
//             phone: distribuidor.phone,
//             contract: distribuidor.contract,
//             codes: (distribuidor.codes || []).map((partnerCode: any) => ({
//               id: partnerCode.id,
//               code: partnerCode.code,
//               partnerEmails: (partnerCode.partnerEmails || []).map((partnerEmail: any) => ({
//                 id: partnerEmail.id,
//                 email: partnerEmail.email
//               }))
//             })),
//             emails: allEmails || [] // Populate the 'emails' array with extracted email addresses
//           };
//         });
//       }
//     });
// }
// fetchDistribuidores(): void {
//   this.distribuidorService.getDistribuidoresWithCodesAndEmails(this.currentPage, this.pageSize)
//     .subscribe((response: any) => {
//       const distribuidores = response;

//       if (Array.isArray(distribuidores) && distribuidores.length > 0) {
//         console.log('Distribuidores:', distribuidores);

//         const formattedData = distribuidores.map((distribuidor: any) => {
//           const allEmails = distribuidor.codes.flatMap((code: any) => {
//             return code.partnerEmails.map((partnerEmail: any) => ({
//               id: partnerEmail.id,
//               email: partnerEmail.email
//             }));
//           });

//           return {
//             id: distribuidor.id,
//             dni: distribuidor.dni,
//             name: distribuidor.name,
//             margin: distribuidor.margin,
//             companies: distribuidor.companies,
//             active: distribuidor.active,
//             nif: distribuidor.nif,
//             type: distribuidor.type,
//             phone: distribuidor.phone,
//             contract: distribuidor.contract,
//             codes: (distribuidor.codes || []).map((partnerCode: any) => ({
//               id: partnerCode.id,
//               code: partnerCode.code,
//               partnerEmails: (partnerCode.partnerEmails || []).map((partnerEmail: any) => ({
//                 id: partnerEmail.id,
//                 email: partnerEmail.email
//               }))
//             })),
//             emails: allEmails || []
//           };
//         });

//         console.log('Formatted Data:', formattedData);

//         // Now 'formattedData' contains the JSON array of objects you can use.
//         // Set it to your dataSource if needed: this.dataSource.data = formattedData;
//       }
//     });
// }
fetchDistribuidores(){
  return this.tableData;
}
}

