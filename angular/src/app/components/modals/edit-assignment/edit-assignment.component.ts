import { Assignment } from '../../../models/classes/assignment';
import { Component, OnInit, Inject } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AssignmentService } from '../../../services/assignment.service';
import { AssetService } from '../../../services/asset.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Asset } from '../../../models/classes/asset';

import * as moment from 'moment';

@Component({
  selector: 'edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.scss']
})
export class EditAssignmentComponent implements OnInit {

  assignmentId;
  get assignmentName(){
    let assignment = this.assignments.getAssignment(this.assignmentId);
    if (!assignment) return '';
    let asset = this.assets.getAsset(assignment.assetId);
    if (!asset) return '';
    return asset.name;
  }

  constructor(
    private assets: AssetService,
    private assignments: AssignmentService,
    @Inject(MAT_DIALOG_DATA) private data){
      this.assignmentId = data.id;
  }

  ngOnInit(){}

  checkinButtonClicked(){
    this.assignments.checkin(this.assignmentId);
  }

}
