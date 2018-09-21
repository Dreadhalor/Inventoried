import { HttpClient } from '@angular/common/http';
import { Globals } from './../globals';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

const roles = require('../../assets/config.json').roles;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn = false;

  login = new Subject<void>();
  logout = new Subject<void>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwt: JwtHelperService
  ) {
    this.setLoggedIn(false);
  }

  setLoggedIn(redirect: boolean){
    this.loggedIn = !!localStorage.getItem('authorization');
    if (this.loggedIn) this.login.next();
    else this.logout.next();
    if (redirect){
      if (this.loggedIn) this.router.navigateByUrl('/browse-assets');
      else this.router.navigateByUrl('/login');
    }
  }

  logIn(user: string, pass: string){
    return this.authenticate(user, pass)
      .then((token: string) => {
        localStorage.setItem('authorization', token);
        this.setLoggedIn(true);
        return token;
      })
  }
  logOut(){
    localStorage.removeItem('authorization');
    this.setLoggedIn(true);
  }

  authenticate(user: string, pass: string){
    let body = {
      username: user,
      password: pass
    }
    return new Promise((resolve, reject) => {
      this.http.post(Globals.request_prefix + 'users/authenticate', body)
        .subscribe(
          authenticated => resolve(authenticated),
          error => reject(error)
        )
    })
  }

  roleguard(token: string, role: string){
    let payload = this.jwt.decodeToken(token);
    let groups = payload.groups;
    return groups.includes(roles[role]);
  }

}
