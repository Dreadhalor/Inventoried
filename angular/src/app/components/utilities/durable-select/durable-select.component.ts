import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { AssetService } from '../../../services/asset.service';
import { Durable } from '../../../models/classes/durable';

@Component({
  selector: 'durable-select',
  templateUrl: './durable-select.component.html',
  styleUrls: ['./durable-select.component.scss']
})
export class DurableSelectComponent implements OnInit {

  @ViewChild('popoverContent') popoverContent: ElementRef;

  _durableId;
  @Input() get durableId(){ return this._durableId; }
  @Output() durableIdChange = new EventEmitter<any>();
  set durableId(val){
    this._durableId = val;
    this.durableIdChange.emit(val);
  }

  @Input() shouldFilter = false;

  get durables(){
    return this.filterByAvailable(this.assets.durables);
  }

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

  filterByAvailable(toFilter: Durable[]){
    if (this.shouldFilter) return toFilter.filter(durable => !durable.available);
    return toFilter;
  }

}
