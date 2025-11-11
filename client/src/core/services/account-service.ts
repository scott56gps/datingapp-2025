import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCredentials, RegisterCredentials, User } from '../../types/user';
import { tap } from 'rxjs';

/* Injectable means that we can inject this into another component or service or class in the project */
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null); // Since we don't have a 'default' user, we specify that it is OK to have null as a type here.

  baseUrl = 'https://localhost:5001/api/';

  register(credentials: RegisterCredentials) {
    return this.http.post<User>(this.baseUrl + 'account/register', credentials).pipe(
      tap((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  /** Here, we make an API call to our backend */
  login(credentials: LoginCredentials) {
    return this.http.post<User>(this.baseUrl + 'account/login', credentials).pipe(
      // tap() is used to specify that we wish to do a side-effect with the data
      tap((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
