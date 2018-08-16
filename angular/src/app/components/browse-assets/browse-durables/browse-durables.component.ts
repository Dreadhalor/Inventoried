import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../../services/asset/asset.service';
import { Durable } from '../../../models/classes/durable';
import { ModalService } from '../../../services/modal/modal.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'browse-durables',
  templateUrl: './browse-durables.component.html',
  styleUrls: ['./browse-durables.component.scss']
})
export class BrowseDurablesComponent implements OnInit {

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

  constructor(
    private assets: AssetService,
    private ms: ModalService
  ) { }

  ngOnInit() {
  }

  openEditDurable(durable: Durable){
    let data = {id: durable.id};
    this.ms.openEditDurable(data);
  }

}
