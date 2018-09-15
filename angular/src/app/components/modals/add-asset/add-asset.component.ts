import { Component, OnInit } from '@angular/core';
import { InfoService } from '../../../services/info.service';
import { AssetService } from '../../../services/asset.service';
import { AddConsumableComponent } from './add-consumable/add-consumable.component';
import { AddDurableComponent } from './add-durable/add-durable.component';

@Component({
  selector: 'add-asset',
  templateUrl: './add-asset.component.html',
  styleUrls: ['./add-asset.component.scss']
})
export class AddAssetComponent implements OnInit {
  
  constructor(
    public is: InfoService,
    public assets: AssetService
  ) { }

  ngOnInit() {
  }

  durableSubmitButtonClicked(durableForm: AddDurableComponent){
    let durables = durableForm.makeDurables();
    this.assets.addDurables(durables);
  }

  consumableSubmitButtonClicked(consumableForm: AddConsumableComponent){
    this.assets.addConsumable(consumableForm.makeConsumable());
  }

}