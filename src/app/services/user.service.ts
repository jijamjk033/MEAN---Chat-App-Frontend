import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse, ResponseModel, User } from '../models/responseModel';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private apiKey = 'http://localhost:3030/api/user';
  private user: User | null = null;


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
      this.user = userData ? JSON.parse(userData) : null;
    }
  }

  getUser() {
    return this.user;
  }

  searchUsers(query: string): Observable<ResponseModel<User[]>> {
    return this.http.get<ResponseModel<User[]>>(`${this.apiKey}/searchUser${query}`);
  }

  logout() {
    sessionStorage.removeItem('LoggedUser');
    this.user = null;
  }

}
