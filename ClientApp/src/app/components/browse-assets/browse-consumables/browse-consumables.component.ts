import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
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
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openEditConsumable(consumable: Consumable){
    let options = Globals.dialogConfig;
    Object.assign(options,{data: consumable});
    const dialogRef = this.dialog.open(EditConsumableComponent, options);
  }

}
