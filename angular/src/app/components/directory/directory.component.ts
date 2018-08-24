import { Consumable } from '../../models/classes/consumable';
import { AssignmentService } from '../../services/assignment/assignment.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Durable } from '../../models/classes/durable';
import { AssetService } from '../../services/asset/asset.service';
import { Asset } from '../../models/classes/asset';
import { ModalService } from '../../services/modal/modal.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss']
})
export class DirectoryComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['id', 'fullName', 'email', 'assignments'];
  dataSource  = new MatTableDataSource(this.us.users);
  subscription = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSizeOptions = [15, 25, 50];

  constructor(
    private us: UserService,
    private assets: AssetService,
    private assignments: AssignmentService,
    private ms: ModalService
  ) { }

  ngOnInit() {
    this.subscription = this.us.dataChange.asObservable().subscribe(
      next => {
        this.dataSource = new MatTableDataSource(this.us.users);
        this.dataSource.paginator = this.paginator;
      }
    )
    if (this.dataSource) this.dataSource.paginator = this.paginator;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
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
