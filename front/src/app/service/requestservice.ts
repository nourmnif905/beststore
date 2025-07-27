import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private baseUrl = 'http://localhost:3000'; // adapte si ton backend change

  constructor(private http: HttpClient) {}

 

get(endpoint: string, params?: any): Observable<any> {
  let httpParams = new HttpParams();
  if (params) {
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, value);
      }
    });
  }

  return this.http.get(`${this.baseUrl}/${endpoint}`, { params: httpParams });
}


  post(endpoint: string, data: any) {
    return this.http.post(`${this.baseUrl}/${endpoint}`, data);
  }

  put(endpoint: string, data: any) {
    return this.http.put(`${this.baseUrl}/${endpoint}`, data);
  }

  delete(endpoint: string) {
    return this.http.delete(`${this.baseUrl}/${endpoint}`);
  }
}
