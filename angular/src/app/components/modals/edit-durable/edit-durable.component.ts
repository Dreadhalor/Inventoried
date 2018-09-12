import { Component, OnInit, Inject } from "@angular/core";
import { Durable } from "../../../models/classes/durable";
import { InfoService } from "../../../services/info.service";
import { AssetService } from "../../../services/asset.service";
import { AssignmentService } from "../../../services/assignment.service";
import { ModalService } from "../../../services/modal.service";
import { MAT_DIALOG_DATA } from "@angular/material";
import { ICheckoutData } from "../../../models/interfaces/ICheckoutData";
import { UserService } from "../../../services/user.service";

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
    private users: UserService,
    private ms: ModalService,
    @Inject(MAT_DIALOG_DATA) private data: any
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
  deleteButtonClicked(){
    this.assets.deleteAsset(this.durable);
  }
  saveButtonClicked(){
    this.save();
    this.state = durableModalState.default;
  }
  checkoutButtonClicked(){
    this.openCheckout();
  }
  openCheckout(){
    let data: ICheckoutData = {
      assetId: this.durable.id,
      userId: null
    };
    this.ms.openCheckout(data);
  }
  openViewAssignment(){
    let data = {id: this.durable.assignmentId};
    this.ms.openEditAssignment(data);
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