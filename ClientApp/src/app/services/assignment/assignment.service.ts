import { MultiAssigned } from './../../models/interfaces/MultiAssigned';
import { UserService } from '../user/user.service';
import { AssetService } from '../asset/asset.service';
import { Injectable } from '@angular/core';
import { Assignment } from '../../models/classes/assignment';
import { Asset } from '../../models/classes/asset';
import { Durable } from '../../models/classes/durable';
import { Consumable } from '../../models/classes/consumable';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  public static initAssignments = [
    'test@test.com',
    'ohboy@test.com',
    'thisisreal@test.com',
    'admin@test.com'
  ]

  private _assignments: Assignment[] = [];
  get assignments(){ return this._assignments; }
  set assignments(val){ this._assignments = val; }

  constructor(
    private assets: AssetService,
    private us: UserService
  ) {
    AssignmentService.initAssignments.forEach((email, index) => this.assignments.push(
      this.checkout(
        new Assignment(
          (index + 1).toString(),
          email,
          index + 1,
          'August 3rd 2018',
          'August 19th 2018'
        )
      )
    ));
  }

  createNewAssignmentAndCheckout(userId, assetId, checkoutDate, dueDate){
    this.checkout(
      new Assignment(
        undefined,
        userId,
        assetId,
        checkoutDate,
        dueDate
      )
    );
  }
  checkout(assignment: Assignment){
    if (assignment){
      this.us.assign(assignment);
      this.assets.assign(assignment);
    }
    this.assignments.push(assignment);
    return assignment;
  }
  checkin(assignmentId){
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
