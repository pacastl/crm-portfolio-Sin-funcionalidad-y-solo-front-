import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatChipInputEvent, MatChipEditedEvent } from '@angular/material/chips';
import { DistribuidorElement } from '../table/table.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, tap, catchError, throwError } from 'rxjs';

export interface EditCodigoDistribuidorModalData {
  code: CodigoDistribuidor;
  distribuidor: DistribuidorElement;
}

export interface CodigoDistribuidor {
  id: number;
  code: string;
  partnerEmails: string[];
}

export interface EmailDistribuidor {
  id: number;
  email: string;
}

@Component({
  selector: 'editar-codigo-modal.ts',
  templateUrl: './editar-codigo-modal.component.html',
  styleUrls: ['./editar-codigo-modal.component.scss']
})



export class EditarCodigoModalComponent implements OnInit {

  clientesCount!: number;
  deletedEmails: EmailDistribuidor[] = [];
  editedEmails: EmailDistribuidor[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  @Output() dataUpdated = new EventEmitter<void>();
  public myForm: FormGroup = this.fb.group({
    partnerName: ['', [Validators.required, Validators.minLength(3)]],
    code: [],
    emails: [],
    numero:[]
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<EditarCodigoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { codigoDistribuidor: CodigoDistribuidor, distribuidor: DistribuidorElement; }

  ) { }

  emails: EmailDistribuidor[] = this.data.distribuidor.emails;
  emailsCodigo:EmailDistribuidor[] = [];
  newEmails: EmailDistribuidor[] = [];
  codigosActivos: CodigoDistribuidor[] = [];

  ngOnInit(): void {
    this.fetchCodigosEmail().subscribe(
      (response) => {
        // console.log(response);
        this.emailsCodigo = response;
      },
      (error) => {
        console.error(error);
      }
    );
    this.fetchCodigosActivos();

    // Set the initial value of the 'code' field
    this.myForm.patchValue({
      code: this.data.codigoDistribuidor.code,
    });
    this.fetchClientesCount(this.data.codigoDistribuidor.id).subscribe(
      (clientesCount) => {
        this.clientesCount = clientesCount;
        this.myForm.patchValue({
          numero: clientesCount
        });
      },

      (error) => {
        console.error(error);
      }
    );
    // console.log(this.clientesCount);

  }

  fetchCodigosEmail(): Observable<any> {
    const url = `http://localhost:8080/public/partnerCodeEmails/${this.data.codigoDistribuidor.id}`;
    return this.http.get<any[]>(url).pipe(
      tap((response) => {
        this.codigosActivos = response;
      }),
      catchError((error) => {
        console.error(error);
        console.log('Error fetching active codigos');
        return throwError(error);
      })
    );
  }
  fetchClientesCount(id: number): Observable<number> {

    return this.http.get<number>(`http://localhost:8080/public/clientsCount/${id}`);
  }
  fetchCodigosActivos(): void {
    const url = 'http://localhost:8080/public/getActiveCodes';
    this.http.get<any[]>(url).subscribe(
      (response) => {
        this.codigosActivos = response;
      },
      (error) => {
        console.error(error);
        console.log('Error fetching active codigos');
      }
    );
  }


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add new email
    if (value) {
      const newEmail: EmailDistribuidor = {
        id: 0, // Set a temporary id for the new chip
        email: value,
      };
      this.emailsCodigo.push(newEmail);
      this.newEmails.push(newEmail);
    }

    // Reset the input value
    if (event.input) {
      event.input.value = '';
    }
  }
  remove(email: EmailDistribuidor): void {
    this.emailsCodigo = this.emailsCodigo.filter(e => e !== email);

    // Add the removed email to the deletedEmails array
    this.deletedEmails.push(email);
  }
  removeDeletedCodigos(): void {
    this.emails = this.emails.filter(code => !this.deletedEmails.includes(code));
  }

  // removeDeletedCodigos(): void {
  //   this.codigos = this.codigos.filter(code => !this.deletedCodigos.includes(code));
  // }
  async deleteRemovedCodigos(): Promise<void> {
    for (const code of this.deletedEmails) {
      await this.http.delete(`http://localhost:8080/public/partnerCode/${code.id}`).toPromise();
    }
  }

  edit(email: EmailDistribuidor, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove email if it no longer has a value
    if (!value) {
      this.remove(email);
      return;
    }

    // Edit existing email
    this.emailsCodigo = this.emailsCodigo.map(e => {
      if (e === email) {
        e.email = value;
        this.editedEmails.push(e); // Add the edited chip to the editedEmails array
      }
      return e;
    });
  }
  async onSubmit(): Promise<void> {
    // Update the Distribuidor data and send a PATCH request to the backend
    const updatedDistribuidor = {
      ...this.data.distribuidor,
      ...this.myForm.value,
    };

    // Create a new object with only the fields you want to send in the PATCH request
    const patchData = {
      name: updatedDistribuidor.name,
      margin: Number(updatedDistribuidor.margin),
      active: updatedDistribuidor.active,
      type: updatedDistribuidor.type,
    };

    this.newEmails.forEach(email => {
      this.http.post(`http://localhost:8080/public/partnerEmail`, {
          //TODO: api platform endpoint
        partnerCodes: [`/public/api/partner_codes/${this.data.codigoDistribuidor.id}`],
        email: email.email
      }).subscribe(
        (response: any) => {
          console.log(`EmailDistribuidor ${response.id} created successfully`);
        },
        (error) => {
          console.log(`Error creating new CodigoDistribuidor`);
        }
      );
    });

    this.editedEmails.forEach(email => {
      console.log(`Updating EmailDistribuidor ${email.id}`); // Add this log
      this.http.patch(`http://localhost:8080/public/partnerEmail/${email.id}`, { email: email.email }).subscribe(
        () => {
          console.log(`EmailDistribuidor ${email.id} updated successfully`);
        },
        (error) => {
          console.log(`Error updating CodigoDistribuidor ${email.id}`);
        }
      );
    });

    this.deletedEmails.forEach(email => {
      console.log(`Deleting EmailDistribuidor ${email.id}`); // Add this log
      this.http.delete(`http://localhost:8080/public/partnerEmail/${email.id}`).subscribe(
        () => {
          console.log(`EmailDistribuidor ${email.id} deleted successfully`);
        },
        (error) => {
          console.log(`Error deleting CodigoDistribuidor ${email.id}`);
        }
      );
    });

    this.dataUpdated.emit();
  }
}

