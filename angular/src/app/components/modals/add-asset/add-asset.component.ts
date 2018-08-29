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
    private is: InfoService,
    private assets: AssetService
  ) { }

  ngOnInit() {
  }

  durableSubmitButtonClicked(durableForm: AddDurableComponent){
    let durables = durableForm.makeDurables();
    durables.forEach(durable => this.assets.addDurable(durable));
  }

  consumableSubmitButtonClicked(consumableForm: AddConsumableComponent){
    this.assets.addConsumable(consumableForm.makeConsumable());
  }

}