import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private baseUrl = 'http://localhost:8080/public';

  constructor(private http: HttpClient) { }

  getClients(): Observable<any> {
    return this.http.get(`${this.baseUrl}/clients`);
  }

  getClient(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/clients/${id}`);
  }

  getDistribudors(): Observable<any> {
    return this.http.get(`${this.baseUrl}/partners`);
  }

  getDistribudor(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/partners/${id}`);
  }


  // Nuevo añadido desde Table component

  toggleClienteActive(url: string, payload: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/merge-patch+json',
      }),
    };
    return this.http.patch(url, payload, httpOptions);
  }

  updateCliente(id: number, payload: { name: string; nif: string }): Observable<any> {
    const url = `${this.baseUrl}/api/clients/${id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/merge-patch+json',
      }),
    };
    return this.http.patch(url, payload, httpOptions);
  }



  getContractData(id: number): Observable<any> {
    return this.http.get(`http://localhost:8080/public/getContract/${id}`);
  }

  uploadFile(elementId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('contract', file);

    return this.http.post(`http://localhost:8080/public/uploadContract/${elementId}`, formData);
  }


  // Nuevo añadido desde asignar-distribuidor-modal.component.ts

  updateDistribuidor(id: number, patchData: any): Observable<any> {
    return this.http.patch(`http://localhost:8080/public/api/partners/${id}`, patchData, {
      headers: {
        'Content-Type': 'application/merge-patch+json',
      },
      withCredentials: true,
    });
  }

  createPartnerCode(code: string, partnerId: number): Observable<any> {
    return this.http.post(`http://localhost:8080/public/partnerCode`, { code, partner: `/public/api/partners/${partnerId}` });
  }

  updatePartnerCode(codeId: number, code: string): Observable<any> {
    return this.http.patch(`http://localhost:8080/public/partnerCode/${codeId}`, { code });
  }

  deletePartnerCode(codeId: number): Observable<any> {
    return this.http.delete(`http://localhost:8080/public/partnerCode/${codeId}`);
  }

  uploadContract(partnerId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('contract', file);

    return this.http.post(`http://localhost:8080/public/uploadContract/${partnerId}`, formData, {
      withCredentials: true,
    });
  }

    // Nuevo añadido desde nuevo-distribuidor.component.ts
    createClient(clientData: any): Observable<any> {
      return this.http.post('http://localhost:8080/public/clients', clientData);
    }


    createClientVersion(clientId: number, version: string): Observable<any> {
      const clientVersionData = {
        joinDate: new Date().toLocaleDateString('en-GB'),
        client: `/public/api/clients/${clientId}`,
        version: version
      };

      return this.http.post('http://localhost:8080/public/clientVersion', clientVersionData);
    }


    updateClient(clientId: number, versionClientId: number): Observable<any> {
      const updatedClientData = {
        clientVersions: [`/public/api/client_versions/${versionClientId}`],
      };

      return this.http.patch(`http://localhost:8080/public/clients/${clientId}`, updatedClientData);
    }

    // Coinciden varios nombres así que añadí "NuevoDistribuidor" a su nombre
    createDistribuidor(distribuidorData: any): Observable<any> {
      return this.http.post('http://localhost:8080/public/partners', distribuidorData);
    }

    createPartnerCodeNuevoDistribuidor(codigoDistribuidorData: any): Observable<any> {
      return this.http.post('http://localhost:8080/public/partnerCode', codigoDistribuidorData);
    }

    createPartnerEmail(emailDistribuidorData: any): Observable<any> {
      return this.http.post('http://localhost:8080/public/partnerEmail', emailDistribuidorData);
    }

    createUser(usuarioData: any): Observable<any> {
      return this.http.post('http://localhost:8080/public/user', usuarioData);
    }

    createClientNuevoDistribuidor(clienteData: any): Observable<any> {
      return this.http.post('http://localhost:8080/public/clients', clienteData);
    }

    createClientVersionNuevoDistribuidor(versionClienteData: any): Observable<any> {
      return this.http.post('http://localhost:8080/public/clientVersion', versionClienteData);
    }

    updateClienteNuevoDistribuidor(updatedClienteData: any, clientId: number): Observable<any> {
      return this.http.patch(`http://localhost:8080/public/clients/${clientId}`, updatedClienteData);
    }

    updateCodigoDistribuidor(updatedCodigoDistribuidorData: any, codigoDistribuidorId: number): Observable<any> {
      return this.http.patch(`http://localhost:8080/public/partnerCode/${codigoDistribuidorId}`, updatedCodigoDistribuidorData);
    }

    updateDistribuidorNuevoDistribuidor(updatedDistribuidorData: any, distribuidorId: number): Observable<any> {
      return this.http.patch(`http://localhost:8080/public/partners/${distribuidorId}`, updatedDistribuidorData);
    }

}
