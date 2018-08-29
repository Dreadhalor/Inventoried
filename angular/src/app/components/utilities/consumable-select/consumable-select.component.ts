import { Component, OnInit, Input, ElementRef, EventEmitter, ViewChild, Output } from '@angular/core';
import { AssetService } from '../../../services/asset.service';
import { Consumable } from '../../../models/classes/consumable';

@Component({
  selector: 'consumable-select',
  templateUrl: './consumable-select.component.html',
  styleUrls: ['./consumable-select.component.scss']
})
export class ConsumableSelectComponent implements OnInit {

  @ViewChild('popoverContent') popoverContent: ElementRef;

  _consumableId;
  @Input() get consumableId(){ return this._consumableId; }
  @Output() consumableIdChange = new EventEmitter<any>();
  set consumableId(val){
    this._consumableId = val;
    this.consumableIdChange.emit(val);
  }

  @Input() shouldFilter = false;

  get consumables(){
    return this.filterByAvailable(this.assets.consumables);
  }

  get consumable(){
    return this.assets.getConsumable(this.consumableId);
  }

  constructor(
    private assets: AssetService
  ) { }

  ngOnInit() {
  }

  getPopoverContent(){
    if (this.consumableId) return this.popoverContent;
    return null;
  }

  filterByAvailable(toFilter: Consumable[]){
    //if (this.shouldFilter) return toFilter.filter(consumable => !consumable.available);
    return toFilter;
  }

}
