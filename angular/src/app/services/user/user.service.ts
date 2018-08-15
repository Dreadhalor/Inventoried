import { Injectable } from '@angular/core';
import { User } from '../../models/classes/user';
import { Assignment } from '../../models/classes/assignment';
import { Globals } from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _users = [];
  get users(){ return this._users; }
  set users(val){ this._users = val; }

  pendingAssignments = [];

  constructor() {
    Globals.initUsers.forEach(user => this.addUser(new User(user,undefined)));
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