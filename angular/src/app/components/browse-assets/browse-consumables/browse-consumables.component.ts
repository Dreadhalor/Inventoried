import { Component, OnInit } from '@angular/core';
import { Consumable } from '../../../models/classes/consumable';
import { AssetService } from '../../../services/asset/asset.service';
import { Globals } from '../../../globals';
import { EditConsumableComponent } from '../../modals/edit-consumable/edit-consumable.component';
import { ModalService } from '../../../services/modal/modal.service';

@Component({
  selector: 'browse-consumables',
  templateUrl: './browse-consumables.component.html',
  styleUrls: ['./browse-consumables.component.scss']
})
export class BrowseConsumablesComponent implements OnInit {

  constructor(
    private assets: AssetService,
    private ms: ModalService
  ) { }

  ngOnInit() {
  }

  openEditConsumable(consumable: Consumable){
    let data = {id: consumable.id};
    this.ms.openEditConsumable(data);
  }

}
