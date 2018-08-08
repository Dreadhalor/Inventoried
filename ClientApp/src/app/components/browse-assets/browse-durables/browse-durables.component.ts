import { Component, OnInit } from '@angular/core';
import { AssetService } from 'src/app/services/asset/asset.service';
import { MatDialog } from '@angular/material';
import { Durable } from 'src/app/models/durable';
import { EditDurableComponent } from 'src/app/components/modals/edit-durable/edit-durable.component';
import { Globals } from 'src/app/globals';

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
