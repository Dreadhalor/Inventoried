import { OnDestroy } from '@angular/core';
import { HistoryService } from './../../services/history.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['id', 'timestamp', 'agent', 'table', 'operation', 'info'];
  dataSource  = new MatTableDataSource(this.hs.history);
  subscription = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSizeOptions = [15, 25, 50];

  constructor(
    private hs: HistoryService
  ) { }

  ngOnInit() {
    this.hs.pullHistory();
    this.subscription = this.hs.dataChange.asObservable().subscribe(
      next => {
        this.dataSource = new MatTableDataSource(this.hs.history);
        this.dataSource.paginator = this.paginator;
      }
    )
    if (this.dataSource) this.dataSource.paginator = this.paginator;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  stringify(thing){return JSON.stringify(thing);}

}
