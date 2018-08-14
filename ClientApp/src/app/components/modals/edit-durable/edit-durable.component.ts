import { CheckoutComponent } from './../checkout/checkout.component';
import { EditAssignmentComponent } from './../edit-assignment/edit-assignment.component';
import { ICheckoutData } from '../../../models/interfaces/ICheckoutData';
import { AssignmentService } from '../../../services/assignment/assignment.service';
import { InfoService } from '../../../services/info/info.service';
import { Durable } from '../../../models/classes/durable';
import { Component, OnInit, Inject } from '@angular/core';
import { AssetService } from '../../../services/asset/asset.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Globals } from '../../../globals';

@Component({
  selector: 'edit-durable',
  templateUrl: './edit-durable.component.html',
  styleUrls: ['./edit-durable.component.scss']
})
export class EditDurableComponent implements OnInit {

  durable: Durable;
  editedDurable: Durable;

  constructor(
    private is: InfoService,
    private assets: AssetService,
    private assignments: AssignmentService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: Durable
  ) {
    this.refreshDurables(data.id);
  }

  _state: durableModalState = durableModalState.default;
  get state(){ return this._state; }
  set state(val: durableModalState){
    if (val == durableModalState.default
      && this.durable) this.refreshDurables(this.durable.id);
    this._state = val;
  }

  ngOnInit() {
  }

  save(){
    this.editedDurable.repair();
    this.assets.saveDurable(this.editedDurable);
    this.refreshDurables(this.durable.id);
  }
  refreshDurables(id){
    this.durable = this.assets.getDurable(id);
    if (this.durable) this.editedDurable = this.durable.copy();
  }

  editButtonClicked(){
    this.state = durableModalState.editing;
  }
  cancelButtonClicked(){
    this.state = durableModalState.default;
  }
  saveButtonClicked(){
    this.save();
    this.state = durableModalState.default;
  }
  checkoutButtonClicked(){
    this.openCheckout();
  }
  openCheckout(){
    let options = Globals.dialogConfig;
    let data: ICheckoutData = {
      assetId: this.durable.id,
      userId: null
    };
    Object.assign(options, {data: data});
    this.dialog.open(CheckoutComponent, options);
  }
  openViewAssignment(){
    let options = Globals.dialogConfig;
    let data = {id: this.durable.assignmentId};
    Object.assign(options, {data: data});
    this.dialog.open(EditAssignmentComponent, options);
  }
  viewAssignmentButtonClicked(){
    this.openViewAssignment();
  }

  get default(){
    return this.state == durableModalState.default;
  }
  get editing(){
    return this.state == durableModalState.editing;
  }

}

enum durableModalState {
  default = 0,
  editing = 1
}