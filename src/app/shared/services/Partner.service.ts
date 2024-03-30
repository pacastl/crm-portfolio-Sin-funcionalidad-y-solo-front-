import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private baseUrl = 'http://localhost:8080/public';

  constructor(private http: HttpClient) { }



  getDistribuidores(pageIndex: number = 1, pageSize: number = 50): Observable<any> {
  return this.http.get(`${this.baseUrl}/api/partners?page=${pageIndex}&itemsPerPage=${pageSize}`);
}

  getCodigoDistribuidorsByDistribuidor(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/partnerCodesUsingId/${id}`);
  }

    // Modify the method to accept an array of IDs
    getCodigosDistribuidorsByDistribuidor(ids: number[]): Observable<any> {
      // Create HTTP parameters with the array of IDs
      let params = new HttpParams();
      ids.forEach(id => {
        params = params.append('ids[]', id.toString());
      });

      // Send a single HTTP GET request with the array of IDs
      return this.http.get(`${this.baseUrl}/partnerCodesUsingIds`, { params });
    }
  getCodigoDistribuidor(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/partner_codes/${id}`);
  }
  getEmailDistribuidorsByDistribuidor(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/partnerEmailsUsingId/${id}`);
  }

   // New method to fetch Distribuidores along with their associated CodigoDistribuidors and EmailDistribuidors
   getDistribuidoresWithCodesAndEmails(pageIndex: number = 1, pageSize: number = 50): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/partners-with-codes-and-emails?page=${pageIndex}&itemsPerPage=${pageSize}`);
  }

}
