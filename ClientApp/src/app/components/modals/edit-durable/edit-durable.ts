import { InfoService } from '../../../services/info/info.service';
import { Durable } from '../../../models/durable';
import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { AssetService } from '../../../services/asset/asset.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { KeyValuePair } from '../../../models/keyValuePair';

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
    @Inject(MAT_DIALOG_DATA) private data: Durable
  ) {
    this.durable = data;
    this.editedDurable = data.copy();
  }

  @Output() open_checkout = new EventEmitter<any>();

  state: durableModalState = durableModalState.default;

  ngOnInit() {
  }

  save(){
    this.editedDurable.repair();
    this.assets.saveDurable(this.editedDurable);
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
    /*this.open_checkout.emit({
      asset_uuid: this.asset.uuid
    });*/
  }
  checkinButtonPressed(){
    //this.durables.checkin(this.asset.uuid);
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