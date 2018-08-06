import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AssetService } from '../../../services/asset/asset.service';

@Component({
  selector: 'durable-select',
  templateUrl: './durable-select.component.html',
  styleUrls: ['./durable-select.component.scss']
})
export class DurableSelectComponent implements OnInit {

  @ViewChild('popoverContent') popoverContent: ElementRef;

  durableId;

  get durable(){
    return this.assets.getDurable(this.durableId);
  }

  constructor(
    private assets: AssetService
  ) { }

  ngOnInit() {
  }

  getPopoverContent(){
    if (this.durableId) return this.popoverContent;
    return null;
  }

}
