import { EditConsumableComponent } from './../edit-consumable/edit-consumable.component';
import { MultiAssigned } from './../../../models/interfaces/MultiAssigned';
import { Component, OnInit, Inject } from '@angular/core';
import { InfoService } from '../../../services/info/info.service';
import { AssetService } from '../../../services/asset/asset.service';
import { AssignmentService } from '../../../services/assignment/assignment.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ModalService } from '../../../services/modal/modal.service';

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
    private ms: ModalService,
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
    let data = {
      id: this.multiassigned.id
    };
    this.ms.openEditConsumable(data);
  }

  goBack(){ this.viewAssignmentTabIndex = 0; }
  

}
