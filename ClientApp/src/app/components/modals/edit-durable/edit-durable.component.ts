import { AssignmentService } from '../../../services/assignment/assignment.service';
import { InfoService } from '../../../services/info/info.service';
import { Durable } from '../../../models/durable';
import { Component, OnInit, Inject } from '@angular/core';
import { AssetService } from '../../../services/asset/asset.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Globals } from '../../../globals';
import { CheckoutComponent } from '../checkout/checkout.component';

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

  editButtonPressed(){
    this.state = durableModalState.editing;
  }
  cancelButtonPressed(){
    this.state = durableModalState.default;
  }
  saveButtonPressed(){
    this.save();
    this.state = durableModalState.default;
  }
  checkoutButtonPressed(){
    this.openCheckout();
  }
  openCheckout(){
    let options = Globals.dialogConfig;
    Object.assign(options,{data: {durableId: this.durable.id}});
    const dialogRef = this.dialog.open(CheckoutComponent, options);
  }
  checkinButtonPressed(){
    this.assignments.checkin(this.editedDurable.assignmentId);
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