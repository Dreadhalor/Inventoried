import { SubjectService } from './../../../services/subject/subject.service';
import { ViewAssignmentsComponent } from './../view-assignments/view-assignments.component';
import { Component, OnInit, Inject, ViewChild, ElementRef, TemplateRef, OnDestroy } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { CheckoutComponent } from '../checkout/checkout.component';
import { Globals } from '../../../globals';
import { Consumable } from '../../../models/classes/consumable';
import { AssignmentService } from '../../../services/assignment/assignment.service';
import { AssetService } from '../../../services/asset/asset.service';
import { InfoService } from '../../../services/info/info.service';
import { ICheckoutData } from '../../../models/interfaces/ICheckoutData';
import { Subscriber, Subject, Subscription } from '../../../../../node_modules/rxjs';

@Component({
  selector: 'edit-consumable',
  templateUrl: './edit-consumable.component.html',
  styleUrls: ['./edit-consumable.component.scss']
})
export class EditConsumableComponent implements OnInit, OnDestroy {

  consumable: Consumable;
  editedConsumable: Consumable;

  constructor(
    private is: InfoService,
    private assets: AssetService,
    private assignments: AssignmentService,
    private dialog: MatDialog,
    private sb: SubjectService,
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
  ngOnDestroy(){
    //this.subscription.unsubscribe();
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
    let options = Globals.dialogConfig;
    let data: ICheckoutData = {
      assetId: this.consumable.id,
      userId: null
    };
    Object.assign(options, {data: data});
    this.dialog.open(CheckoutComponent, options);
  }
  openViewAssignments(){
    let options = Globals.dialogConfig;
    let data = {id: this.consumable.id};
    Object.assign(options, {data: data});
    this.dialog.open(ViewAssignmentsComponent, options);
  }
  viewAssignmentsButtonClicked(){
    this.openViewAssignments();
  }

  openSelf(){
    let options = Globals.dialogConfig;
    let data = this.consumable;
    Object.assign(options, {data: data});
    this.dialog.open(EditConsumableComponent, options);
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
