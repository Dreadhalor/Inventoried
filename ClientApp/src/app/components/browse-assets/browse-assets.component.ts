import { InfoService } from 'src/app/services/info/info.service';
import { Globals } from 'src/app/globals';
import { AddAssetComponent } from '../modals/add-asset/add-asset.component';
import { Component, OnInit } from '@angular/core';
import { AssetService } from 'src/app/services/asset/asset.service';
import { MatDialog } from '@angular/material';
import { AssignmentService } from 'src/app/services/assignment/assignment.service';

@Component({
  selector: 'browse-assets',
  templateUrl: './browse-assets.component.html',
  styleUrls: ['./browse-assets.component.scss'],
})
export class BrowseAssetsComponent implements OnInit {

  constructor(
    private assets: AssetService,
    private is: InfoService,
    private assignments: AssignmentService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openAddAsset(){
    const dialogRef = this.dialog.open(AddAssetComponent, Globals.dialogConfig);
  }

}
