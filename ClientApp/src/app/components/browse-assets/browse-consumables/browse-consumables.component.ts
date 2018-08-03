import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../../services/asset/asset.service';
import { MatDialog } from '@angular/material';

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

}
