import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { IUser } from "../models/interfaces/IUser";
import { Globals } from "../globals";
import { User } from "../models/classes/user";
import { Assignment } from "../models/classes/assignment";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _users: User[] = [];
  get users(){ return this._users; }
  set users(val){ this._users = val; }

  pendingAssignments = [];

  dataChange = new Subject<any>();
  public loaded = false;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {
    auth.login.asObservable().subscribe(
      login => this.login()
    )
    auth.logout.asObservable().subscribe(
      logout => this.logout()
    )
    if (auth.loggedIn) this.login();
    else this.loaded = true;
  }

  login(){
    if (this.auth.hasRole('admin')) this.getAllUsers();
  }
  logout(){
    this.flushUsers();
  }

  getAllUsers(){
    this.http.get<IUser[]>(Globals.request_prefix + 'users/get_all_users').subscribe(
      (users) => {
        users.forEach(user => this.addUser(new User(user)));
        this.dataChange.next();
        this.loaded = true;
      },
      error => this.loaded = true
    )
  }
  flushUsers(){
    this.users = [];
    this.dataChange.next();
  }

  addUser(user: User){
    let assignmentIndex = this.pendingAssignments.findIndex(match => match.userId == user.id);
    if (assignmentIndex >= 0){
      user.assign(this.pendingAssignments[assignmentIndex].id);
      this.pendingAssignments.splice(assignmentIndex,1);
    }
    this.users.push(user);
  }

  getUser(id): User {
    return this.users.find(match => match.id == id);
  }
  getUserByName(name: string): User {
    return this.users.find(match => match.name.toLowerCase() == name.toLowerCase());
  }

  assign(assignment: Assignment){
    if (assignment){
      let user = this.getUser(assignment.userId);
      if (user){
        user.assign(assignment.id);
        
      }
      else this.pendingAssignments.push(assignment);
    }
  }
  unassign(assignment: Assignment){
    if (assignment){
      let user = this.getUser(assignment.userId);
      if (user) user.unassign(assignment.id);
      let assignmentIndex = this.pendingAssignments.findIndex(match => match.id == assignment.id);
      if (assignmentIndex >= 0) this.pendingAssignments.splice(assignmentIndex,1);
    }
  }

}
