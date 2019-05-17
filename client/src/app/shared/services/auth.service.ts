import { Injectable } from '@angular/core';
import { User } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // TODO: renew token
  private token = null;

  constructor(private http: HttpClient, private userService: UserService) {}

  register(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/register', user);
  }

  login(user$: User): Observable<{ token: string; user: User }> {
    return this.http
      .post<{ token: string; user: User }>('/api/auth/login', user$)
      .pipe(
        tap(({ token, user }) => {
          localStorage.setItem('auth-token', token);
          this.setToken(token);
          this.userService.setUser(user);
        })
      );
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout() {
    this.setToken(null);
    // TODO: set default user and store locale in user
    localStorage.clear();
    localStorage.setItem('locale', 'en');
  }
}
