import { Assignment } from '../../../../models/classes/assignment';
import { Component, OnInit, Inject, Input } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AssignmentService } from '../../../../services/assignment.service';
import { AssetService } from '../../../../services/asset.service';

import * as moment from 'moment';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'edit-assignment-content',
  templateUrl: './edit-assignment-content.component.html',
  styleUrls: ['./edit-assignment-content.component.scss']
})
export class EditAssignmentContentComponent implements OnInit {

  
  private _assignmentId : string;
  @Input() get assignmentId() : string {
    return this._assignmentId;
  }
  set assignmentId(v : string) {
    this._assignmentId = v;
    this.refreshAssignments(v);
  }
  

  
  private _assignment : Assignment;
  public get assignment() : Assignment {
    return this._assignment;
  }
  public set assignment(v : Assignment) {
    this._assignment = v;
  }
  
  editedAssignment: Assignment;

  checkoutDate: moment.Moment;
  dueDate: moment.Moment;
  dayStringFormat: string = 'dddd, MMMM Do YYYY';
  dateStringFormat: string = 'MMM Do YYYY';

  constructor(
    private assets: AssetService,
    private users: UserService,
    private assignments: AssignmentService
  ) {
    //this.refreshAssignments(this.assignmentId);
  }

  ngOnInit() {
  }

  formatDate(dateString, fromFormat, toFormat){
    return moment(dateString,fromFormat).format(toFormat);
  }

  refreshAssignments(id){
    this.assignment = this.assignments.getAssignment(id);
    if (this.assignment) this.editedAssignment = this.assignment.copy();
  }

}
