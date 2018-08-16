import { Consumable } from '../../models/classes/consumable';
import { AssignmentService } from '../../services/assignment/assignment.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Durable } from '../../models/classes/durable';
import { AssetService } from '../../services/asset/asset.service';
import { Asset } from '../../models/classes/asset';
import { ModalService } from '../../services/modal/modal.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss']
})
export class DirectoryComponent implements OnInit {

  displayedColumns: string[] = ['id', 'fullName', 'email', 'assignments'];
  dataSource = new MatTableDataSource(this.us.users);

  constructor(
    private us: UserService,
    private assets: AssetService,
    private assignments: AssignmentService,
    private ms: ModalService
  ) { }

  ngOnInit() {
  }

  openEditAsset(asset: Asset){
    if (asset instanceof Durable) this.openEditDurable(asset);
    else if (asset instanceof Consumable) this.openEditConsumable(asset);
  }

  openEditDurable(durable: Durable){
    let data = {id: durable.id};
    this.ms.openEditDurable(data);
  }
  openEditConsumable(consumable: Consumable){
    let data = {id: consumable.id};
    this.ms.openEditConsumable(data);
  }

}
