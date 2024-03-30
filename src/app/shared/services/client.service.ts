import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseUrl = 'http://localhost:8080/public';

  constructor(private http: HttpClient) { }

  
  getClientesByDistribuidor(distribuidorId: number, currentPage: number): Observable<any> {
    const url = `${this.baseUrl}/partnerClients/${distribuidorId}/${currentPage}`;
    return this.http.get(url);
  }
  getClientes(pageIndex: number = 1, pageSize: number = 50): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/clients?page=${pageIndex}&itemsPerPage=${pageSize}`);
  }
  // Add a new method to fetch a single CodigoDistribuidor by its ID
  getCodigoDistribuidor(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/partner_codes/${id}`);
  }
  private processCliente(cliente: any): any {
    // Extract the ID from the relation field (IRI)
    const codigoId = this.extractIdFromIri(cliente.codigo);

    return { ...cliente, codigo: codigoId };
  }

  public extractIdFromIri(iri: string): number {
    const parts = iri.split('/');
    return parseInt(parts[parts.length - 1], 10);
  }
  getCodigoDistribuidorsByCliente(clienteId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/clientCode/${clienteId}`);
  }
}