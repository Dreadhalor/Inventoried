import { EditConsumableComponent } from './../edit-consumable/edit-consumable.component';
import { MultiAssigned } from './../../../models/interfaces/MultiAssigned';
import { Component, OnInit, Inject } from '@angular/core';
import { InfoService } from '../../../services/info/info.service';
import { AssetService } from '../../../services/asset/asset.service';
import { AssignmentService } from '../../../services/assignment/assignment.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { EditAssignmentComponent } from '../edit-assignment/edit-assignment.component';
import { Globals } from '../../../globals';
import { SubjectService } from '../../../services/subject/subject.service';

@Component({
  selector: 'view-assignments',
  templateUrl: './view-assignments.component.html',
  styleUrls: ['./view-assignments.component.scss']
})
export class ViewAssignmentsComponent implements OnInit {

  multiassigned: MultiAssigned;
  assignmentId;

  viewAssignmentTabIndex: number = 0;

  constructor(
    private is: InfoService,
    private assets: AssetService,
    private assignments: AssignmentService,
    private dialog: MatDialog,
    private sb: SubjectService,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.refreshMultiAssigned(data.id);
  }

  ngOnInit() {
  }

  refreshMultiAssigned(id){
    this.multiassigned = this.assignments.getMultiAssigned(id);
  }

  getOther(aId: string, maId: string){
    return this.assignments.getMultiAssigned(this.assignments.getAssignment(aId).getOther(this.multiassigned.id));
  }

  openViewAssignment(assignmentId){
    this.assignmentId = assignmentId;
    this.viewAssignmentTabIndex = 1;
  }
  viewAssignmentButtonClicked(assignmentId){
    this.openViewAssignment(assignmentId);
  }

  checkinButtonClicked(){
    this.assignments.checkin(this.assignmentId);
    this.goBack();
  }
  viewAssetButtonClicked(){
    let id = this.multiassigned.id;
    this.sb.viewAsset.next(id);
  }

  goBack(){ this.viewAssignmentTabIndex = 0; }
  

}
