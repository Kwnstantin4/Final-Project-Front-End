import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoggedInUser, LoginCredentials, User } from '../interfaces/user';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginResponse {
  access_token: string;
}
const API_URL = `${environment.apiUrl}/users`;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userLoggedIn = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<LoggedInUser | null>(null); 
  private authToken = new BehaviorSubject<string | null>(localStorage.getItem('access_token'));
  user = this.userSubject.asObservable();


  //http: HttpClient = inject(HttpClient);
  //router: Router = inject(Router);

  constructor(private http: HttpClient, private router: Router) {
    const access_token = localStorage.getItem('access_token');

    if (access_token) {
      try {
        const decodedToken = jwtDecode(access_token) as any;
        console.log("✔ Decoded Token:", decodedToken);

        if (!decodedToken.fullname) {
          console.warn(" Το fullname λείπει από το token! Χρήση name + surname αντί.");
          decodedToken.fullname = `${decodedToken.name} ${decodedToken.surname}`;
        }

        const user: LoggedInUser = {
          fullname: decodedToken.fullname,
          email: decodedToken.email,
        };

        this.userSubject.next(user);
        this.userLoggedIn.next(true);
      } catch (error) {
        console.error(" Σφάλμα αποκωδικοποίησης token:", error);
        this.userSubject.next(null);
      }
    }
  }

  
  isUserLoggedIn() {
    return this.userLoggedIn.asObservable();
  }

  
  getLoggedInUser() {
    return this.userSubject.asObservable();
  }

  getUser() {
    return this.userSubject.value;
  }

  
  notifyUserLogin(user: LoggedInUser) {
    this.userSubject.next(user);
    this.userLoggedIn.next(true);
  }

   
  getAuthToken() {
    return this.authToken.asObservable();
  }

  
  setAuthToken(token: string) {
    localStorage.setItem('access_token', token);
    this.authToken.next(token);
  }

  
  getAuthHeaders() {
    const token = this.authToken.value;
    if (!token) {
      console.warn(" Προσπάθεια αποστολής request χωρίς token!");
      return {};
    }

    console.log("Αποστολή request με token:", token);

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }






  registerUser(user: User) {
    return this.http.post<{ msg: string }>(`${API_URL}`, user)
      .pipe(
        catchError((error) => {
          console.error(' Error registering user:', error);
          return throwError(() => error);
        })
      );
  }

  checkDuplicateUsername(username: string): Observable<{ msg: string }> {
    return this.http.get<{ msg: string }>(`${API_URL}/check-username/${username}`);
  }


  checkDuplicateEmail(email: string) {
    return this.http.get<{ msg: string }>(`${API_URL}/check-email?email=${encodeURIComponent(email)}`)
      .pipe(
        catchError((error) => {
          console.error(' Error checking email:', error);
          return throwError(() => error);
        })
      );
  }

  loginUser(credentials: LoginCredentials) {
    return this.http.post<LoginResponse>(`${API_URL}/login`, credentials)
      .pipe(
        tap((response: LoginResponse) => {
          if (response.access_token) {
            this.setAuthToken(response.access_token); 
            console.log("Token αποθηκεύτηκε επιτυχώς:", response.access_token);
          }
        }),
        catchError((error) => {
          console.error(' Error logging in:', error);
          return throwError(() => error);
        })
      );
  }
  
  

  logoutUser() {
    this.userSubject.next(null);
    this.userLoggedIn.next(false);
    localStorage.removeItem('access_token');
    this.router.navigate(['/user-login']);
  }

  logout() {
    this.logoutUser();
    console.log(" Ο χρήστης αποσυνδέθηκε!");
    
  }
}
