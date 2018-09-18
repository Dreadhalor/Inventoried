import { ICheckoutData } from '../../../models/interfaces/ICheckoutData';
import { AssignmentService } from '../../../services/assignment.service';
import { Component, OnInit, Inject } from '@angular/core';
import { AssetService } from '../../../services/asset.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MAT_DIALOG_DATA } from '@angular/material';

import * as moment from 'moment';
import { ModalService } from '../../../services/modal.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {

  pickedFromDate: NgbDateStruct;
  pickedToDate: NgbDateStruct;
  dateRangePickerFormat: string = 'dddd, MMM Do YYYY';
  dayStringFormat: string = 'dddd, MMMM Do YYYY';
  dateStringFormat: string = 'MMMM Do YYYY';

  assetIds: string[] = [];
  userId = null;

  get from(){ return moment(this.momentFormat(this.pickedFromDate)); }
  get fromString(){ return this.from.format(this.dayStringFormat); }
  get to(){ return moment(this.momentFormat(this.pickedToDate)); }
  get toString(){ return this.to.format(this.dayStringFormat); }
  get duration(){ return this.to.diff(this.from,'days'); }

  constructor(
    private assets: AssetService,
    private us: UserService,
    private assignments: AssignmentService,
    private ms: ModalService,
    @Inject(MAT_DIALOG_DATA) private data: ICheckoutData
  ) {
  }

  ngOnInit() {
    if (this.data.userId) this.userId = this.data.userId;
    if (this.data.assetId) this.assetIds.push(this.data.assetId);
  }


  daterange: any = {};
  options: any = {
    locale: { format: this.dateRangePickerFormat },
    alwaysShowCalendars: false,
    linkedCalendars: false,
    opens: 'center'
  };

  public selectedDate(value: any, datepicker?: any) {
    // this is the date the iser selected
    console.log(value);

    // any object can be passed to the selected event and it will be passed back here
    datepicker.start = value.start;
    datepicker.end = value.end;

    // or manupulat your own internal property
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;
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
    this.assetIds.forEach(
      assetId => this.assignments.createNewAssignmentAndCheckout(this.userId, assetId, checkoutDate, dueDate)
    )
  }

  readyToCheckout(){
    return this.pickedFromDate && this.pickedToDate && this.userId && this.assetIds.length > 0;
  }

}
