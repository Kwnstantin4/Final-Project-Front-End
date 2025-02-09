import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root', 
})
export class AuthService {
  private userData: any = null;
  private userSubject = new BehaviorSubject<any>(null);

  constructor() {
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.userData = JSON.parse(savedUser);
      this.userSubject.next(this.userData);
    }
  }

  getUser(): Observable<any> {
    return this.userSubject.asObservable(); 
  }

  login(user: any) {
    this.userData = user;
    localStorage.setItem('user', JSON.stringify(user)); 
    this.userSubject.next(user); 
  }

  logout() {
    this.userData = null;
    localStorage.removeItem('user'); 
    this.userSubject.next(null); 
    
  }
}

