import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Consumable } from '../../../models/classes/consumable';
import { AssignmentService } from '../../../services/assignment/assignment.service';
import { AssetService } from '../../../services/asset/asset.service';
import { InfoService } from '../../../services/info/info.service';
import { ICheckoutData } from '../../../models/interfaces/ICheckoutData';
import { ModalService } from '../../../services/modal/modal.service';

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
    private ms: ModalService,
    @Inject(MAT_DIALOG_DATA) private data: any
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

  editButtonClicked(){
    this.state = consumableModalState.editing;
  }
  cancelButtonClicked(){
    this.state = consumableModalState.default;
  }
  saveButtonClicked(){
    this.save();
    this.state = consumableModalState.default;
  }
  checkoutButtonClicked(){
    this.openCheckout();
  }
  openCheckout(){
    let data: ICheckoutData = {
      assetId: this.consumable.id,
      userId: null
    };
    this.ms.openCheckout(data);
  }
  openViewAssignments(){
    let data = {
      id: this.consumable.id
    };
    this.ms.openViewAssignments(data);
  }
  viewAssignmentsButtonClicked(){
    this.openViewAssignments();
  }

  get default(){
    return this.state == consumableModalState.default;
  }
  get editing(){
    return this.state == consumableModalState.editing;
  }

  get validQuantity(){
    return this.editedConsumable.quantity >= this.consumable.assignmentIds.length;
  }

}

enum consumableModalState {
  default = 0,
  editing = 1
}
