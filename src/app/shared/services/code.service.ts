import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CodeService {
  private readonly apiUrl = 'http://localhost:8080/public/getActiveCodes';
  private readonly countActiveCodesUrl = 'http://localhost:8080/public/countActiveCodes';
  constructor(private http: HttpClient) {}

  fetchCodigos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getCountActiveCodes(): Observable<number> {
    return this.http.get<number>(this.countActiveCodesUrl);
  }
}