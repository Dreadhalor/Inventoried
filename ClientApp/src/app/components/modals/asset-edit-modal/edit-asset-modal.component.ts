import { InfoService } from '../../../services/info/info.service';
import { Asset } from '../../../models/asset';
import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AssetService } from '../../../services/asset/asset.service';

@Component({
  selector: 'edit-asset-modal',
  templateUrl: './edit-asset-modal.component.html',
  styleUrls: ['./edit-asset-modal.component.scss']
})
export class EditAssetModalComponent implements OnInit {

  asset: Asset;
  editedAsset: Asset;
  
  modal: NgbModalRef = null;
  options = {
    centered: true,
    beforeDismiss: () => {
      this.reset(false);
      return true;
    }
  };

  constructor(
    private is: InfoService,
    private assets: AssetService,
    private ms: NgbModal
  ) { }

  @ViewChild('content') content: ElementRef;

  @Output() open_checkout = new EventEmitter<any>();

  state: assetModalState = assetModalState.default;
  tags = [];

  ngOnInit() {
  }

  reset(reload: boolean){
    this.state = assetModalState.default;
  }
  save(){
    //this.assets.saveAsset(this.asset);
  }

  open(asset: Asset){
    this.asset = asset;
    this.editedAsset = asset.copy();
    this.tags = this.editedAsset.tags.map(pair => pair.toACM());
    this.show(this.content);
  }

  show(content) {
    this.modal = this.ms.open(content, this.options);
  }

  onSubmit(){
    this.reset(false);
    this.modal.close();
    this.modal = null;
  }

  editButtonPressed(){
    this.state = assetModalState.editing;
  }
  cancelButtonPressed(){
    this.state = assetModalState.default;
    this.reset(true);
  }
  saveButtonPressed(){
    this.save();
    this.state = assetModalState.default;
  }
  checkoutButtonPressed(){
    this.reset(false);
    this.modal.close();
    this.modal = null;
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