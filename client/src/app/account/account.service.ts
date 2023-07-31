import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../shared/models/user';
import { Router } from '@angular/router';
import { IAddress } from '../shared/models/address';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();
  //access to http server
  constructor(private http: HttpClient, private router: Router) { }

  // method to load the current user using the provided token
  loadCurrentUser(token: string) {
    console.log(token);
    console.log('loadCurrentUser called');
    // check if token is not provided
    if (!token) {
      localStorage.removeItem('token');
      this.currentUserSource.next(null);
      return of(null);
    }
    // set Authorization header with the token
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    // make a GET request to the 'account' endpoint
    return this.http.get(this.baseUrl + 'account', {headers}).pipe(map((user: IUser) => {
      if(user)
      {
        localStorage.setItem('token', user.token);
        this.currentUserSource.next(user);
      }
    }));
  }
  // method to handle user login
  login(values: any) {
    // make a POST request to the 'account/login' endpoint with the provided values
    return this.http.post(this.baseUrl + 'account/login', values).pipe(map((user: IUser) => {
      if (user) {
        localStorage.setItem('token', user.token);
        this.currentUserSource.next(user);
      }
    }));
  }
  //register method
  register(values: any) {
    return this.http.post(this.baseUrl + 'account/register', values).pipe(map((user: IUser) => {
      if (user) {
        localStorage.setItem('token', user.token);
        this.currentUserSource.next(user);
      }
    })
    );
  }
  // method to handle user logout
  logout() {
    // remove the token from local storage and set the current user to null
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  //method used to check if the email exists
  checkIfEmailExists(email: string) {
    return this.http.get(this.baseUrl + 'account/emailexists?email=' + email);
  }

  getUserAddress(){
    return this.http.get<IAddress>(this.baseUrl + 'account/address');
  }

  updateUserAddress(address: IAddress) {
    return this.http.put<IAddress>(this.baseUrl + 'account/address', address);
  }
}
