import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private baseUrl = 'http://localhost:3000'; // adapte si ton backend change

  constructor(private http: HttpClient) {}

  get(endpoint: string, params?: any) {
    return this.http.get(`${this.baseUrl}/${endpoint}`, { params });
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
