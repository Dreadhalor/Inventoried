import { ICheckoutData } from '../../../models/interfaces/ICheckoutData';
import { AssignmentService } from '../../../services/assignment.service';
import { Component, OnInit, Inject } from '@angular/core';
import { AssetService } from '../../../services/asset.service';
import { MAT_DIALOG_DATA } from '@angular/material';

import * as moment from 'moment';

import { ModalService } from '../../../services/modal.service';
import { UserService } from '../../../services/user.service';
import { Assignment } from '../../../models/classes/assignment';

@Component({
  selector: 'checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {

  checkoutDate: moment.Moment;
  dueDate: moment.Moment;
  isIndeterminate = false;
  validDates;

  dateRangePickerFormat: string = 'dddd, MMM Do YYYY';
  dayStringFormat: string = 'dddd, MMMM Do YYYY';
  dateStringFormat: string = 'MMM Do YYYY';

  assetIds: string[] = [];
  userId = null;

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

  checkoutButtonClicked(){
    let toCheckout = this.assetIds.map(id =>
      new Assignment({
        id: undefined,
        userId: this.userId,
        assetId: id,
        checkoutDate: this.checkoutDate,
        dueDate: (this.isIndeterminate) ? null : this.dueDate
      })
    )
    this.assignments.checkout(toCheckout);
  }

  readyToCheckout(){
    return this.validDates && this.userId && this.assetIds.length > 0;
  }

}
