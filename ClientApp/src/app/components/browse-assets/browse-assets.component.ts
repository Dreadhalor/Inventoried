import { Component, OnInit, EventEmitter } from '@angular/core';
import { AssetService } from '../../services/asset/asset.service';

@Component({
  selector: 'browse-assets',
  templateUrl: './browse-assets.component.html',
  styleUrls: ['./browse-assets.component.scss']
})
export class BrowseAssetsComponent implements OnInit {

  constructor(
    private assets: AssetService
  ) { }

  ngOnInit() {
  }

}
