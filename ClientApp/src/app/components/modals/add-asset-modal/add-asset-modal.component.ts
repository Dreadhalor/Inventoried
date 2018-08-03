import { KeyValuePair } from '../../../models/keyValuePair';
import { Component, OnInit } from '@angular/core';
import { InfoService } from '../../../services/info/info.service';
import { AssetService } from '../../../services/asset/asset.service';
import { Asset } from '../../../models/asset';
import { IAutoCompleteModel } from '../../../models/IAutoCompleteModel';

@Component({
  selector: 'add-asset-modal',
  templateUrl: './add-asset-modal.component.html',
  styleUrls: ['./add-asset-modal.component.scss']
})
export class AddAssetModalComponent implements OnInit {

  serialNumber: string = "";
  categoryId: number = 0;
  manufacturerId: number = 0;
  notes: string = "";
  tags: IAutoCompleteModel[] = [];
  active: boolean = true;
  
  constructor(
    private is: InfoService,
    private assets: AssetService
  ) { }

  ngOnInit() {
  }

  makeAsset(){
    return new Asset(
      undefined,
      this.serialNumber,
      this.categoryId,
      this.manufacturerId,
      this.notes,
      undefined,
      this.tags.map(tag => KeyValuePair.ACMToKVP(tag)),
      this.active
    );
  }

  durableSubmitButtonPressed(){
    let newAsset = new Asset(
      undefined,
      this.serialNumber,
      this.categoryId,
      this.manufacturerId,
      this.notes,
      undefined,
      this.tags.map(tag => KeyValuePair.ACMToKVP(tag)),
      this.active
    );
    this.assets.addAsset(newAsset);
  }

  consumableSubmitButtonPressed(){
    let newAsset = new Asset(
      undefined,
      this.serialNumber,
      this.categoryId,
      this.manufacturerId,
      this.notes,
      undefined,
      this.tags.map(tag => KeyValuePair.ACMToKVP(tag)),
      this.active
    );
    this.assets.addAsset(newAsset);
  }

}