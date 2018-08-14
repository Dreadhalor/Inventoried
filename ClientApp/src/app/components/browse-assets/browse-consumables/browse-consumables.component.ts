import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { Consumable } from '../../../models/classes/consumable';
import { AssetService } from '../../../services/asset/asset.service';
import { Globals } from '../../../globals';
import { EditConsumableComponent } from '../../modals/edit-consumable/edit-consumable.component';

@Component({
  selector: 'browse-consumables',
  templateUrl: './browse-consumables.component.html',
  styleUrls: ['./browse-consumables.component.scss']
})
export class BrowseConsumablesComponent implements OnInit {

  constructor(
    private assets: AssetService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openEditConsumable(consumable: Consumable){
    let options = Globals.dialogConfig;
    let data = {id: consumable.id};
    Object.assign(options, {data: data});
    this.dialog.open(EditConsumableComponent, options);
  }

}
