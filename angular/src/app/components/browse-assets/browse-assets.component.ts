import { Component, OnInit } from "@angular/core";
import { AssetService } from "../../services/asset.service";
import { InfoService } from "../../services/info.service";
import { AssignmentService } from "../../services/assignment.service";
import { ModalService } from "../../services/modal.service";


@Component({
  selector: 'browse-assets',
  templateUrl: './browse-assets.component.html',
  styleUrls: ['./browse-assets.component.scss'],
})
export class BrowseAssetsComponent implements OnInit {

  constructor(
    public assets: AssetService,
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
