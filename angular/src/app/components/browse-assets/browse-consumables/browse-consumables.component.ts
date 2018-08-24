import { Component, OnInit } from '@angular/core';
import { Consumable } from '../../../models/classes/consumable';
import { AssetService } from '../../../services/asset/asset.service';
import { Globals } from '../../../globals';
import { EditConsumableComponent } from '../../modals/edit-consumable/edit-consumable.component';
import { ModalService } from '../../../services/modal/modal.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'browse-consumables',
  templateUrl: './browse-consumables.component.html',
  styleUrls: ['./browse-consumables.component.scss']
})
export class BrowseConsumablesComponent implements OnInit {

  displayedColumns: string[] = [
    'label',
    'category',
    'manufacturer',
    'notes',
    'tags',
    'checkedOut',
    'owned'
  ];
  dataSource = new MatTableDataSource(this.assets.consumables);

  subscription = null;

  constructor(
    private assets: AssetService,
    private ms: ModalService
  ) { }

  ngOnInit() {
    this.subscription = this.assets.assetsEdited.asObservable().subscribe((edited) => {
      this.dataSource = new MatTableDataSource(this.assets.consumables);
    })
  }
  ngOnDestroy(){
    if (this.subscription) this.subscription.unsubscribe();
  }

  openEditConsumable(consumable: Consumable){
    let data = {id: consumable.id};
    this.ms.openEditConsumable(data);
  }

}
