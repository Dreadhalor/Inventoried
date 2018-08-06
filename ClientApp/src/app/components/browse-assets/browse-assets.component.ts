import { InfoService } from '../../services/info/info.service';
import { Globals } from '../../globals';
import { AddAssetComponent } from '../modals/add-asset/add-asset.component';
import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../services/asset/asset.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'browse-assets',
  templateUrl: './browse-assets.component.html',
  styleUrls: ['./browse-assets.component.scss']
})
export class BrowseAssetsComponent implements OnInit {

  constructor(
    private assets: AssetService,
    private is: InfoService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openAddAsset(){
    const dialogRef = this.dialog.open(AddAssetComponent, Globals.dialogConfig);
  }

}
