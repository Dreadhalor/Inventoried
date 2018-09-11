import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { IUser } from "../models/interfaces/IUser";
import { Globals } from "../globals";
import { User } from "../models/classes/user";
import { SeedValues } from "./seedvalues";
import { Assignment } from "../models/classes/assignment";
import { HttpClient } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _users = [];
  get users(){ return this._users; }
  set users(val){ this._users = val; }

  pendingAssignments = [];

  dataChange = new Subject<any>();

  constructor(
    private http: HttpClient
  ) {
    this.getAllUsers().then(
      undefined,
      rejected => this.getSeedUsers()
    );
  }

  getAllUsers(){
    return new Promise((resolve, reject) => {
      this.http.get<IUser[]>(Globals.request_prefix + 'users/get_all_users').subscribe(
        (iusers) => {
          iusers.forEach(iuser => this.addUser(new User(iuser)));
          this.dataChange.next();
          resolve();
        },
        (error) => reject()
      )
    })
  }
  getSeedUsers(){
    SeedValues.initUsers.forEach(iuser => this.addUser(new User(iuser)));
  }

  addUser(user: User){
    let assignmentIndex = this.pendingAssignments.findIndex(match => match.userId == user.id);
    if (assignmentIndex >= 0){
      user.assign(this.pendingAssignments[assignmentIndex].id);
      this.pendingAssignments.splice(assignmentIndex,1);
    }
    this.users.push(user);
  }

  getUser(id): User{
    return this.users.find(match => match.id == id);
  }
  getUserName(id): string {
    console.log(id);
    let user = this.getUser(id);
    if (user) return user.name;
    return null;
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
