import { InfoService } from '../../services/info/info.service';
import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../services/asset/asset.service';
import { AssignmentService } from '../../services/assignment/assignment.service';
import { ModalService } from '../../services/modal/modal.service';

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
    private ms: ModalService
  ) { }

  ngOnInit() {
  }

  openAddAsset(){
    this.ms.openAddAsset();
  }

}
