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

  pickedFromDate: NgbDateStruct;
  pickedToDate: NgbDateStruct;
  dayStringFormat: string = 'dddd, MMMM Do YYYY';
  dateStringFormat: string = 'MMMM Do YYYY';

  get from(){ return moment(this.momentFormat(this.pickedFromDate)); }
  get fromString(){ return this.from.format(this.dayStringFormat); }
  get to(){ return moment(this.momentFormat(this.pickedToDate)); }
  get toString(){ return this.to.format(this.dayStringFormat); }
  get duration(){ return this.to.diff(this.from,'days'); }

  constructor(
    private assets: AssetService,
    private users: UserService,
    private assignments: AssignmentService
  ) {
    //this.refreshAssignments(this.assignmentId);
  }

  ngOnInit() {
  }

  momentFormat(date: NgbDateStruct){
    return {
      year: date.year,
      month: date.month - 1,
      day: date.day
    };
  }

  formatDate(dateString, fromFormat, toFormat){
    return moment(dateString,fromFormat).format(toFormat);
  }
  getDuration(startDate,endDate){
    return moment(endDate,this.dateStringFormat).diff(moment(startDate,this.dateStringFormat),'days');
  }

  refreshAssignments(id){
    this.assignment = this.assignments.getAssignment(id);
    if (this.assignment) this.editedAssignment = this.assignment.copy();
  }

}
