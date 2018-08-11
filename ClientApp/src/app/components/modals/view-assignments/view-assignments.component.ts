import { MultiAssigned } from './../../../models/interfaces/MultiAssigned';
import { Component, OnInit, Inject } from '@angular/core';
import { InfoService } from '../../../services/info/info.service';
import { AssetService } from '../../../services/asset/asset.service';
import { AssignmentService } from '../../../services/assignment/assignment.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { EditAssignmentComponent } from '../edit-assignment/edit-assignment.component';
import { Globals } from '../../../globals';

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
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.refreshMultiAssigned(data.id);
  }

  ngOnInit() {
  }

  refreshMultiAssigned(id){
    this.multiassigned = this.assignments.getMultiAssigned(id);
  }

  openViewAssignment(assignmentId){
    this.assignmentId = assignmentId;
    /*
    let options = Globals.dialogConfig;
    let data = {
      id: assignmentId
    }
    Object.assign(options, {data: data});
    const dialogRef = this.dialog.open(EditAssignmentComponent, options);*/
    this.viewAssignmentTabIndex = 1;
  }
  viewAssignmentButtonPressed(assignmentId){
    this.openViewAssignment(assignmentId);
  }

  checkinButtonPressed(){
    this.assignments.checkin(this.assignmentId);
    this.viewAssignmentTabIndex = 0;
  }

  goBack(){ this.viewAssignmentTabIndex = 0; }
  

}
