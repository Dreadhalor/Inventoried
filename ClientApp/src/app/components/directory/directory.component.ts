import { Consumable } from '../../models/classes/consumable';
import { AssignmentService } from '../../services/assignment/assignment.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Globals } from '../../globals';
import { Durable } from '../../models/classes/durable';
import { MatDialog } from '@angular/material';
import { AssetService } from '../../services/asset/asset.service';
import { EditDurableComponent } from '../modals/edit-durable/edit-durable.component';
import { Asset } from '../../models/classes/asset';
import { EditConsumableComponent } from '../modals/edit-consumable/edit-consumable.component';

@Component({
  selector: 'directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss']
})
export class DirectoryComponent implements OnInit {

  constructor(
    private us: UserService,
    private assets: AssetService,
    private assignments: AssignmentService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openEditAsset(asset: Asset){
    if (asset instanceof Durable) this.openEditDurable(asset);
    else if (asset instanceof Consumable) this.openEditConsumable(asset);
  }

  openEditDurable(durable: Durable){
    let options = Globals.dialogConfig;
    Object.assign(options,{data: durable});
    const dialogRef = this.dialog.open(EditDurableComponent, options);
  }
  openEditConsumable(consumable: Consumable){
    let options = Globals.dialogConfig;
    Object.assign(options,{data: consumable});
    const dialogRef = this.dialog.open(EditConsumableComponent, options);
  }

}
