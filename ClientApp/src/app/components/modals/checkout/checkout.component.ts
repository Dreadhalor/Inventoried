import { AssignmentService } from 'src/app/services/assignment/assignment.service';
import { Component, OnInit, Inject } from '@angular/core';
import { AssetService } from 'src/app/services/asset/asset.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Durable } from 'src/app/models/durable';

import * as moment from 'moment';

@Component({
  selector: 'checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {

  tabIndex: number = 0;
  setTabIndex(v: number){ this.tabIndex = v; }

  pickedFromDate: NgbDateStruct;
  pickedToDate: NgbDateStruct;
  dayStringFormat: string = 'dddd, MMMM Do YYYY';
  dateStringFormat: string = 'MMMM Do YYYY';

  userId;
  durableId;
  consumableId;
  consumableIds = [];

  get from(){ return moment(this.momentFormat(this.pickedFromDate)); }
  get fromString(){ return this.from.format(this.dayStringFormat); }
  get to(){ return moment(this.momentFormat(this.pickedToDate)); }
  get toString(){ return this.to.format(this.dayStringFormat); }
  get duration(){ return this.to.diff(this.from,'days'); }
  get selectedAssetType(){
    switch(this.tabIndex){
      case 0: return 'Durable';
      case 1: return 'Consumable';
      default: return '';
    }
  }

  constructor(
    private assets: AssetService,
    private assignments: AssignmentService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  ngOnInit() {
    this.userId = this.data.userId;
    this.durableId = this.data.durableId;
  }

  momentFormat(date: NgbDateStruct){
    return {
      year: date.year,
      month: date.month - 1,
      day: date.day
    };
  }

  checkoutButtonClicked(){
    let checkoutDate = this.from.format(this.dateStringFormat);
    let dueDate = this.to.format(this.dateStringFormat);
    this.assignments.createNewAssignmentAndCheckout(this.userId, this.durableId, checkoutDate, dueDate);
  }

  readyToCheckout(){
    return this.pickedFromDate && this.pickedToDate && this.userId && this.durableId;
  }

}
