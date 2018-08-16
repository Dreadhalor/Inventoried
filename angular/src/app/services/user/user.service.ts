import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/classes/user';
import { Assignment } from '../../models/classes/assignment';
import { Globals } from '../../globals';
import { SeedValues } from '../seedvalues';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _users = [];
  get users(){ return this._users; }
  set users(val){ this._users = val; }

  pendingAssignments = [];

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
      this.http.get(Globals.request_prefix + 'getAllUsers').subscribe(
        (users: any) => {
          users.forEach(user => this.addUser(user));
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

  assign(assignment: Assignment){
    if (assignment){
      let user = this.getUser(assignment.userId);
      if (user) user.assign(assignment.id);
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
