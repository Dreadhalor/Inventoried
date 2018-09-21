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
  groups = [];

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
    if (this.loggedIn){
      this.setGroups();
      this.login.next();
    }
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

  setGroups(){
    let token = localStorage.getItem('authorization');
    let payload = this.jwt.decodeToken(token);
    if (payload){
      this.groups = payload.groups;
    }
  }
  hasRole(role: string){
    let groupName = roles[role];
    if (groupName) return this.groups.includes(groupName);
    return false;
  }

  tokenguard(token: string): boolean {
    let payload = this.jwt.decodeToken(token);
    if (payload) return true;
    return false;
  }
  roleguard(token: string, permittedRoles: string[]){
    let payload = this.jwt.decodeToken(token);
    let match = false;
    if (payload){
      let groups = payload.groups;
      for (let i = 0; i < permittedRoles.length; i++){
        if (match) break;
        match = groups.includes(roles[permittedRoles[i]])
      }
      return match;
    }
    return false;
  }

}
