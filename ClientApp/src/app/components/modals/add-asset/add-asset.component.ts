import { KeyValuePair } from 'src/app/models/keyValuePair';
import { Component, OnInit } from '@angular/core';
import { InfoService } from 'src/app/services/info/info.service';
import { AssetService } from 'src/app/services/asset/asset.service';

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