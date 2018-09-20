import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Globals } from '../globals';
import { Subject } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  history: any = [];
  dataChange = new Subject<any>();

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {
    this.pullHistory();
  }

  pullHistory(){
    this.http.get<any[]>(
      Globals.request_prefix + 'history/pull_all'
      )
    .subscribe(
      (history: any[]) => {
        history.sort(this.sortHistoryFxn).reverse();
        this.history = history;
        this.dataChange.next();
      },
      error => console.log(error)
    )
  }

  sortHistoryFxn(histA, histB){
    let timestampA = moment(histA.timestamp, Globals.historyFormat);
    let timestampB = moment(histB.timestamp, Globals.historyFormat);
    if (timestampA.isBefore(timestampB)) return -1;
    if (timestampA.isAfter(timestampB)) return 1;
    return 0;
  }
}