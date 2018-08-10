import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../../services/asset/asset.service';
import { MatDialog } from '@angular/material';
import { Durable } from '../../../models/classes/durable';
import { Globals } from '../../../globals';
import { EditDurableComponent } from '../../modals/edit-durable/edit-durable.component';

@Component({
  selector: 'browse-durables',
  templateUrl: './browse-durables.component.html',
  styleUrls: ['./browse-durables.component.scss']
})
export class BrowseDurablesComponent implements OnInit {

  constructor(
    private assets: AssetService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openEditDurable(durable: Durable){
    let options = Globals.dialogConfig;
    Object.assign(options,{data: durable});
    const dialogRef = this.dialog.open(EditDurableComponent, options);
  }

}
