import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { CheckoutComponent } from '../checkout/checkout.component';
import { Globals } from '../../../globals';
import { Consumable } from '../../../models/consumable';
import { AssignmentService } from '../../../services/assignment/assignment.service';
import { AssetService } from '../../../services/asset/asset.service';
import { InfoService } from '../../../services/info/info.service';

@Component({
  selector: 'edit-consumable',
  templateUrl: './edit-consumable.component.html',
  styleUrls: ['./edit-consumable.component.scss']
})
export class EditConsumableComponent implements OnInit {

  consumable: Consumable;
  editedConsumable: Consumable;

  constructor(
    private is: InfoService,
    private assets: AssetService,
    private assignments: AssignmentService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: Consumable
  ) {
    this.refreshConsumables(data.id);
  }

  _state: consumableModalState = consumableModalState.default;
  get state(){ return this._state; }
  set state(val: consumableModalState){
    if (val == consumableModalState.default
      && this.consumable) this.refreshConsumables(this.consumable.id);
    this._state = val;
  }

  ngOnInit() {
  }

  save(){
    this.editedConsumable.repair();
    this.assets.saveConsumable(this.editedConsumable);
    this.refreshConsumables(this.consumable.id);
  }
  refreshConsumables(id){
    this.consumable = this.assets.getConsumable(id);
    if (this.consumable) this.editedConsumable = this.consumable.copy();
  }

  editButtonPressed(){
    this.state = consumableModalState.editing;
  }
  cancelButtonPressed(){
    this.state = consumableModalState.default;
  }
  saveButtonPressed(){
    this.save();
    this.state = consumableModalState.default;
  }
  checkoutButtonPressed(){
    this.openCheckout();
  }
  openCheckout(){
    let options = Globals.dialogConfig;
    Object.assign(options,{data: {consumableId: this.consumable.id}});
    const dialogRef = this.dialog.open(CheckoutComponent, options);
  }
  checkinButtonPressed(){
    //this.assignments.checkin(this.editedConsumable.assignmentId);
  }

  get default(){
    return this.state == consumableModalState.default;
  }
  get editing(){
    return this.state == consumableModalState.editing;
  }

}

enum consumableModalState {
  default = 0,
  editing = 1
}
