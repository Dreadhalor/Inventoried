import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { AssetService } from "../../../services/asset.service";
import { ModalService } from "../../../services/modal.service";
import { Durable } from "../../../models/classes/durable";


@Component({
  selector: 'browse-durables',
  templateUrl: './browse-durables.component.html',
  styleUrls: ['./browse-durables.component.scss']
})
export class BrowseDurablesComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = [
    'serialNumber',
    'category',
    'manufacturer',
    'notes',
    'tags',
    'availability',
    'active'
  ];
  dataSource = new MatTableDataSource(this.assets.durables);
  subscription = null;

  constructor(
    private assets: AssetService,
    private ms: ModalService
  ) { }

  ngOnInit() {
    this.subscription = this.assets.assetsEdited.asObservable().subscribe((edited) => {
      this.dataSource = new MatTableDataSource(this.assets.durables);
    })
  }
  ngOnDestroy(){
    if (this.subscription) this.subscription.unsubscribe();
  }

  openEditDurable(durable: Durable){
    let data = {id: durable.id};
    this.ms.openEditDurable(data);
  }

}
