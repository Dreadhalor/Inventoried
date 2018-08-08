import { AssignmentService } from '../../../services/assignment/assignment.service';
import { Component, OnInit, Inject } from '@angular/core';
import { AssetService } from '../../../services/asset/asset.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Durable } from '../../../models/durable';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import * as moment from 'moment';

@Component({
  selector: 'checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  animations: [
    trigger('heroState', [
      state('inactive', style({
        backgroundColor: '#eee',
        transform: 'scale(1)'
      })),
      state('active',   style({
        backgroundColor: '#cfd8dc',
        transform: 'scale(1.1)'
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ])
  ]
})
export class CheckoutComponent implements OnInit {

  pickedFromDate: NgbDateStruct;
  pickedToDate: NgbDateStruct;
  dayStringFormat: string = 'dddd, MMMM Do YYYY';
  dateStringFormat: string = 'MMMM Do YYYY';

  userId;
  durableId;
  consumableIds = [];

  state;
  toggleState() {
    this.state = this.state === 'active' ? 'inactive' : 'active';
  }

  get from(){ return moment(this.momentFormat(this.pickedFromDate)); }
  get fromString(){ return this.from.format(this.dayStringFormat); }
  get to(){ return moment(this.momentFormat(this.pickedToDate)); }
  get toString(){ return this.to.format(this.dayStringFormat); }
  get duration(){ return this.to.diff(this.from,'days'); }

  constructor(
    private assets: AssetService,
    private assignments: AssignmentService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  ngOnInit() {
    this.userId = this.data.userId;
    this.durableId = this.data.durableId;
  }

  getSelectedCheckoutType(){
    if (this.durableId) return 'Durable';
    else return 'Consumable'
  }
  getUnselectedCheckoutType(){
    if (this.durableId) return 'Consumable';
    else return 'Durable'
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
