import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class IncomeService {
  private baseUrl = 'http://localhost:8080/api/incomes';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllIncomes(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  getIncomeById(): Observable<any> {
    // return this.http.get(`${this.baseUrl}/${id}`, {
    return this.http.get(`${this.baseUrl}/user`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  addIncome(income: any): Observable<any> {
    return this.http.post(this.baseUrl, income, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  updateIncome(id: number, updatedIncome: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, updatedIncome, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  deleteIncome(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }
}
