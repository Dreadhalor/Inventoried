import { InfoService } from '../../../services/info/info.service';
import { Asset } from '../../../models/asset';
import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { AssetService } from '../../../services/asset/asset.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { KeyValuePair } from '../../../models/keyValuePair';

@Component({
  selector: 'edit-asset-modal',
  templateUrl: './edit-asset-modal.component.html',
  styleUrls: ['./edit-asset-modal.component.scss']
})
export class EditAssetModalComponent implements OnInit {

  asset: Asset;
  editedAsset: Asset;

  constructor(
    private is: InfoService,
    private assets: AssetService,
    @Inject(MAT_DIALOG_DATA) private data: Asset
  ) {
    this.asset = data;
    this.editedAsset = data.copy();
    this.tags = this.editedAsset.tags.map(pair => pair.toACM());
  }

  @Output() open_checkout = new EventEmitter<any>();

  state: assetModalState = assetModalState.default;
  tags = [];

  ngOnInit() {
  }

  save(){
    this.editedAsset.tags = this.tags.map(tag => KeyValuePair.ACMToKVP(tag)),
    this.editedAsset.repair();
    this.assets.saveAsset(this.editedAsset);
  }

  editButtonPressed(){
    this.state = assetModalState.editing;
  }
  cancelButtonPressed(){
    this.state = assetModalState.default;
  }
  saveButtonPressed(){
    this.save();
    this.state = assetModalState.default;
  }
  checkoutButtonPressed(){
    /*this.open_checkout.emit({
      asset_uuid: this.asset.uuid
    });*/
  }
  checkinButtonPressed(){
    //this.assets.checkin(this.asset.uuid);
  }

  get default(){
    return this.state == assetModalState.default;
  }
  get editing(){
    return this.state == assetModalState.editing;
  }

}

enum assetModalState {
  default = 0,
  editing = 1
}