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
    auth.login.asObservable().subscribe(
      login => this.login()
    )
    auth.logout.asObservable().subscribe(
      logout => this.logout()
    )
    if (auth.loggedIn) this.login();
  }

  login(){
    if (this.auth.hasRole('admin')) this.pullHistory();
  }
  logout(){
    this.history = [];
    this.dataChange.next();
  }

  pullHistory(){
    this.http.get<any[]>(
      Globals.request_prefix + 'history/pull_all'
    )
    .subscribe(
      history => {
        history.sort(this.sortHistoryFxn).reverse();
        this.history = history;
        this.dataChange.next();
      },
      error => {}
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