/*
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { isLocalStorageAvailable } from '../../shared/environment.utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost/unimart_pasabuy/api';
  private tokenKey = 'jwt';
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object, private router: Router) {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      if (token) {
        this.currentUserSubject.next(this.decodeToken(token).data);
      }
    }
  }

  userLogin(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, data)
     .pipe(
        catchError(this.handleError)
      );
  }

  userSignUp(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/signup`, data)
     .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      switch (error.status) {
        case 401:
          errorMessage = 'Invalid username or password.';
          break;
        case 404:
          errorMessage = 'No user matched.';
          break;
        default:
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }


  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId) && isLocalStorageAvailable()) {
      localStorage.setItem(this.tokenKey, token);
      this.currentUserSubject.next(this.decodeToken(token).data);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId) && isLocalStorageAvailable()) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  getCollage(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/getImage`)
      .pipe(
        catchError(this.handleError)
      );
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.isTokenExpired(token) : false;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId) && isLocalStorageAvailable()) {
      localStorage.removeItem(this.tokenKey);
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']); 
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Decode the JWT token
  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Invalid token format:', e);
      return null;
    }
  }
  
  // Check if the token is expired
  private isTokenExpired(token: string): boolean {
    const decodedToken = this.decodeToken(token);
    if (decodedToken && decodedToken.exp) {
      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(decodedToken.exp);
      return expirationDate < new Date();
    }
    return true;
  }

  // userid getter
  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }
}*/

import { Inject, Injectable , PLATFORM_ID} from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { catchError, Observable, throwError, tap } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost/unimart_pasabuy';
  private userData: any;

  constructor(
              private http: HttpClient,
              @Inject(PLATFORM_ID) private platformId: Object,
              private router: Router
  
    ) { }

    //LOGIN
    login(email: string, password: string, rememberMe: boolean): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      return this.http.post<any>(`${this.apiUrl}/login`, {email, password}, {headers})
      .pipe(
        tap(res => {
          if (res && res.data && res.data.jwt) {
            const token = res.data.jwt;

            if (isPlatformBrowser(this.platformId)) {
              console.log('Login response:', res);
              if (rememberMe) {
                localStorage.setItem('jwt', token);
              } else {
                sessionStorage.setItem('jwt', token);
              }
              this.saveUserData();
            }else {
              throw new Error('Invalid Login Response');
            }
          }
        }),
         catchError(error => {
        console.error('Login Failed:', error);

        // Log the response text
        if (error.error && error.error.text) {
          console.error('Response Text:', error.error.text);
        }

        return throwError(() => error);
      })
    );
}

  setToken(token: string, rememberMe: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
     if (rememberMe) {
      localStorage.setItem('jwt', token); 
    } else {
      sessionStorage.setItem('jwt', token); 
    }
  }
}
    //SAVE USER DATA
    saveUserData(): void {
      let token = '';

    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt') || '';
    }
  
    if (token) {
      const decodedToken: any = jwtDecode(token);
      if (decodedToken && decodedToken.data) {
        this.userData = decodedToken.data;
        console.log("User data saved:", this.userData);
        sessionStorage.setItem('userId', this.userData.id.toString());
      } else {
        console.error("Invalid user data:", decodedToken);
      }
    } else {
      console.error("JWT not found.");
    }
  }

    //SIGN UP
    signUp(username: string, email: string, password: string): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
  
      return this.http.post<any>(`${this.apiUrl}/signup`, { username, email, password }, { headers })
        .pipe(
          tap(res => {
            if (res && res.data && res.data.jwt) {
              const token = res.data.jwt;
  
              if (isPlatformBrowser(this.platformId)) {
                console.log('Sign-Up response:', res);
                sessionStorage.setItem('jwt', token);
                this.saveUserData();
              } else {
                throw new Error('Invalid Sign-Up Response');
              }
            }
          }),
          catchError(error => {
            console.error('Sign-Up Failed:', error);
            if (error.error && error.error.text) {
              console.error('Response Text:', error.error.text);
            }
            return throwError(() => error);
          })
        );
    }
  
    //GET CURRENT USER  
    getCurrentUser(): any {
      if (isPlatformBrowser(this.platformId)) {
        const userId = sessionStorage.getItem('userId');
        if (userId) {
          console.log('Retrieved user ID from sessionStorage:', userId); 
          return { id: Number(userId) }; 
        } else {
          console.log('No user ID found in sessionStorage.'); 
          return null;
        }
      }
      console.log('Platform is not browser. Unable to retrieve user ID.');
      return null;
    }
    
    //LOGOUT
    logout(): void {
      if (isPlatformBrowser(this.platformId)) {
        sessionStorage.removeItem('jwt');
        sessionStorage.removeItem('userId');
        this.router.navigate(['/login']);
      }
    }
    
    isAuthenticated(): boolean {
      if (isPlatformBrowser(this.platformId)) {
        const token = sessionStorage.getItem('jwt');
        return !!token;
      }
      return false;
    }
  }
