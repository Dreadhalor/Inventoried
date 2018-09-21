import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Assignment } from "../models/classes/assignment";
import { AssetService } from "./asset.service";
import { UserService } from "./user.service";
import { Durable } from "../models/classes/durable";
import { Consumable } from "../models/classes/consumable";
import { MultiAssigned } from "../models/interfaces/MultiAssigned";
import { Globals } from '../globals';
import { AuthService } from './auth.service';
import { IAssignment } from '../models/interfaces/IAssignment';


@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  private _assignments: Assignment[] = [];
  get assignments(){ return this._assignments; }
  set assignments(val){ this._assignments = val; }

  constructor(
    private assets: AssetService,
    private us: UserService,
    private http: HttpClient,
    private auth: AuthService
  ){
    auth.login.asObservable().subscribe(
      login => this.login()
    )
    auth.logout.asObservable().subscribe(
      logout => this.logout()
    )
    if (auth.loggedIn) this.login();
  }

  login(){
    this.fetchAssignments();
  }
  logout(){
    this.assignments = [];
  }

  fetchAssignments(){
    this.http.get(
      Globals.request_prefix + 'assignments/get_assignments',
    ).subscribe(
      (assignments: IAssignment[]) => this.assignments = assignments.map(iassignment => new Assignment(iassignment)),
      err => {}
    );
  }

  createNewAssignmentAndCheckout(userId, assetId, checkoutDate, dueDate, isIndeterminate){
    this.checkout(
      new Assignment({
        id: undefined,
        userId: userId,
        assetId: assetId,
        checkoutDate: checkoutDate,
        dueDate: (!isIndeterminate) ? '' : dueDate
      })
    );
  }
  checkoutWithoutPost(assignment: Assignment){
    if (assignment){
      this.us.assign(assignment);
      this.assets.assign(assignment);
    }
    this.assignments.push(assignment);
  }
  checkout(assignment: Assignment){
    this.http.post(
      Globals.request_prefix + 'assignments/create_assignment',
      assignment.asInterface()
    ).subscribe(
      res => this.checkoutWithoutPost(assignment),
      err => console.log(err)
    );
  }
  checkinWithoutPost(assignmentId){
    let assignmentIndex = this.assignments.findIndex(match => match.id == assignmentId);
    if (assignmentIndex >= 0){
      let asset = this.assets.getAsset(this.assignments[assignmentIndex].assetId);
      if (asset instanceof Durable){
        for (let i = this.assignments.length-1; i >= 0; i--){
          if (this.assignments[i].assetId == asset.id){
            this.us.unassign(this.assignments[i]);
            this.assets.unassign(this.assignments[i]);
            this.assignments.splice(i,1);
          }
        }
      } else if (asset instanceof Consumable){
        this.us.unassign(this.assignments[assignmentIndex]);
        this.assets.unassign(this.assignments[assignmentIndex]);
        this.assignments.splice(assignmentIndex,1);
      }
    }
  }
  checkin(assignmentId){
    this.http.post(
      Globals.request_prefix + 'assignments/checkin',
      {assignmentId: assignmentId}
    ).subscribe(
      res => this.checkinWithoutPost(assignmentId),
      err => console.log(err)
    );
  }

  getAssignment(id){
    return this.assignments.find(match => match.id == id);
  }
  getAssetFromAssignmentId(id){
    let assignment = this.getAssignment(id);
    if (assignment){
      return this.assets.getAsset(assignment.assetId);
    }
    return null;
  }
  getAssetText(id){
    let assignment = this.getAssignment(id);
    if (assignment){
      let asset = this.assets.getAsset(assignment.assetId);
      if (asset) return asset.name
    }
    return '';
  }
  getMultiAssigned(id){
    let multiassigned: MultiAssigned = this.assets.getConsumable(id);
    if (multiassigned) return multiassigned;
    multiassigned = this.us.getUser(id);
    if (multiassigned) return multiassigned;
    return null;
  }

}
