import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Globals } from '../globals';
import { Subject } from 'rxjs';

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
    this.http.get(
      Globals.request_prefix + 'history/pull_all',
      {headers: this.auth.getHeaders()})
    .subscribe(
      history => {
        this.history = history;
        this.dataChange.next();
      },
      error => {
        console.log(error);
      }
    )
  }
}
