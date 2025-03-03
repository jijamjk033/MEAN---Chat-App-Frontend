import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginResponse, ResponseModel, User } from '../models/responseModel';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private apiKey = 'http://localhost:3030/api/user';
  private user: User | null = null;
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  googleLogin(userData: object): Observable<ResponseModel<LoginResponse>> {
    console.log(userData);
    return this.http.post<ResponseModel<LoginResponse>>(`${this.apiKey}/login`, userData)
  }

  private loadUser() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const userData = sessionStorage.getItem('LoggedUser');
      if (userData) {
        this.userSubject.next(JSON.parse(userData));
      }
    }
  }

  setUser(user: User) {
    this.userSubject.next(user);
  }

  getUser() {
    return this.userSubject.value;
  }

  searchUsers(email:string, query: string): Observable<ResponseModel<User[]>> {
    return this.http.get<ResponseModel<User[]>>(`${this.apiKey}/searchUser?q=${query}`);
  }

  logout() {
    sessionStorage.removeItem('LoggedUser');
    this.userSubject.next(null);
  }

}
