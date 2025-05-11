import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private baseUrl = 'http://localhost:8080/api/expenses';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllExpenses(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  // getExpenseByService.getAuthHeaders(),
  //   });
  // }

  // getExpenseById(id: any): Observable<any> {
  // return this.http.get<any>(`${this.baseUrl}/${id}` , {
  //   headers: this.authService.getAuthHeaders(),
  // });

  getExpensesOfUser(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/expenses/user`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  createExpense(expense: any): Observable<any> {
    return this.http.post(this.baseUrl, expense, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }
}
