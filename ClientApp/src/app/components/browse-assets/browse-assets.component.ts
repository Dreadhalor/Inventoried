import { Asset } from '../../models/asset';
import { InfoService } from '../../services/info/info.service';
import { Globals } from '../../globals';
import { AddAssetModalComponent } from '../modals/add-asset-modal/add-asset-modal.component';
import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../services/asset/asset.service';
import { MatDialog } from '@angular/material';
import { EditAssetModalComponent } from '../modals/asset-edit-modal/edit-asset-modal.component';

@Component({
  selector: 'browse-assets',
  templateUrl: './browse-assets.component.html',
  styleUrls: ['./browse-assets.component.scss']
})
export class BrowseAssetsComponent implements OnInit {

  constructor(
    private assets: AssetService,
    private is: InfoService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openAddAsset(){
    const dialogRef = this.dialog.open(AddAssetModalComponent, Globals.dialogConfig);
  }
  openEditAsset(asset: Asset){
    const dialogRef = this.dialog.open(EditAssetModalComponent, {
      width: Globals.dialogConfig.width,
      maxWidth: Globals.dialogConfig.maxWidth,
      data: asset
    });
  }

}
