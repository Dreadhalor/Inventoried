import { KeyValuePair } from '../../../models/keyValuePair';
import { Component, OnInit } from '@angular/core';
import { InfoService } from '../../../services/info/info.service';
import { AssetService } from '../../../services/asset/asset.service';
import { Durable } from '../../../models/durable';
import { IAutoCompleteModel } from '../../../models/IAutoCompleteModel';

@Component({
  selector: 'add-asset',
  templateUrl: './add-asset.component.html',
  styleUrls: ['./add-asset.component.scss']
})
export class AddAssetComponent implements OnInit {
  
  constructor(
    private is: InfoService,
    private assets: AssetService
  ) { }

  ngOnInit() {
  }

  durableSubmitButtonPressed(durableForm){
    this.assets.addDurable(durableForm.makeDurable());
  }

  consumableSubmitButtonPressed(consumableForm){
    this.assets.addConsumable(consumableForm.makeConsumable());
  }

}