import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'history-panel',
  templateUrl: './history-panel.component.html',
  styleUrls: ['./history-panel.component.scss']
})
export class HistoryPanelComponent implements OnInit {

  @Input() entry: any;

  constructor() { }

  ngOnInit() {
  }

}
