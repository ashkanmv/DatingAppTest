import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { User } from '../_models/User';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
  })
  export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  helper = new JwtHelperService();
  decodedToken : any;
  currentUser : User;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http : HttpClient,private router : Router) { }

  updateCurrentUrl(photoUrl : string){
    this.photoUrl.next(photoUrl);
  }

  onLogin(user : User){
    return this.http.post(this.baseUrl + 'login' , user).pipe(
      map((response:any)=> {
        const user = response;
        if(user){
          localStorage.setItem('token' , user.token);
          localStorage.setItem('user', JSON.stringify(user.user))
          this.decodedToken = this.helper.decodeToken(user.token);
          this.currentUser = user.user;
          this.updateCurrentUrl(this.currentUser.photoUrl)
        };
      }))
  }

  onRegister(user : User){
    return this.http.post(this.baseUrl + 'register' , user)
  };

  loggedIn(){
    const token = localStorage.getItem('token');
    return !this.helper.isTokenExpired(token);
  }
}
