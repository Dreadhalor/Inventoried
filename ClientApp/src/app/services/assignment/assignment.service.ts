import { UserService } from '../user/user.service';
import { AssetService } from '../asset/asset.service';
import { Injectable } from '@angular/core';
import { Assignment } from '../../models/assignment';

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

  private _assignments = [];
  get assignments(){ return this._assignments; }
  set assignments(val){ this._assignments = val; }

  constructor(
    private assets: AssetService,
    private us: UserService
  ) {
    AssignmentService.initAssignments.forEach((assignment, index) => this.assignments.push(
      this.checkout(
        new Assignment(
          '' + (index + 1),
          assignment,
          index + 1,
          '3 Aug 2018',
          '20 Aug 2018'
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
      this.us.unassign(this.assignments[assignmentIndex]);
      this.assets.unassign(this.assignments[assignmentIndex]);
    }
    this.assignments.splice(assignmentIndex,1);
  }

  getAssignment(id){
    return this.assignments.find(match => match.id == id);
  }
  getAsset(id){
    let assignment = this.getAssignment(id);
    if (assignment){
      return this.assets.getDurable(assignment.assetId);
    }
    return null;
  }
  getAssetText(id){
    let assignment = this.getAssignment(id);
    if (assignment){
      let asset = this.assets.getDurable(assignment.assetId);
      if (asset){
        return asset.categoryVal + ' ' + asset.serialNumber;
      }
    }
    return '';
  }

}
