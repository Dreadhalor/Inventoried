import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../../services/asset/asset.service';
import { Durable } from '../../../models/classes/durable';
import { EditDurableComponent } from '../../modals/edit-durable/edit-durable.component';
import { Globals } from '../../../globals';

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
    let data = {id: durable.id};
    Object.assign(options, {data: data});
    this.dialog.open(EditDurableComponent, options);
  }

}
