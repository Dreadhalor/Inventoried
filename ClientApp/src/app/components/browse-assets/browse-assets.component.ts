import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'browse-assets',
  templateUrl: './browse-assets.component.html',
  styleUrls: ['./browse-assets.component.scss']
})
export class BrowseAssetsComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit() {
  }

  stringify(thing){
    return JSON.stringify(thing);
  }

}
