import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient, private router: Router) {}

  signup(user: any): Observable<string> {
    return this.http.post(`${this.baseUrl}/signup`, user, { responseType: 'text' });
  }     

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      map((response: any) => {
        // ✅ Save token, userId, and username to localStorage
        this.saveToken(response.token, response.userId, response.username);
        return response;
      })
    );
  }

  updateUser(updatedUser: any): Observable<string> {
    return this.http.put(`${this.baseUrl}/update`, updatedUser, {
      headers: this.getAuthHeaders(),
      responseType: 'text',
    });
  }

  deleteUser(): Observable<string> {
    return this.http.delete(`${this.baseUrl}/delete`, {
      headers: this.getAuthHeaders(),
      responseType: 'text',
    });
  }

  // ✅ Save token, userId, and username
  saveToken(token: string, userId: number, username: string) {
    localStorage.setItem('jwt', token);
    localStorage.setItem('userId', userId.toString());
    localStorage.setItem('username', username);
  }

  // ✅ Get token
  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  // ✅ Get userId
  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? Number(userId) : null;
  }

  // ✅ Get username
  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  // ✅ Get authentication headers
  getAuthHeaders() {
    const token = this.getToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // ✅ Logout: Clears all saved user data
  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}