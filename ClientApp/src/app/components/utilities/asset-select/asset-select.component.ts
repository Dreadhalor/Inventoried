import { Asset } from '../../../models/classes/asset';
import { Component, OnInit, EventEmitter, ElementRef, ViewChild, Input, Output } from '@angular/core';
import { AssetService } from '../../../services/asset/asset.service';

@Component({
  selector: 'asset-select',
  templateUrl: './asset-select.component.html',
  styleUrls: ['./asset-select.component.scss']
})
export class AssetSelectComponent implements OnInit {

  @ViewChild('popoverContent') popoverContent: ElementRef;

  
  private _assetIds : string[];
  @Input() get assetIds() : string[] { return this._assetIds; }
  @Output() assetIdsChange = new EventEmitter<string[]>();
  set assetIds(v : string[]) {
    this._assetIds = v;
    this.assetIdsChange.emit(v);
  }
  


  @Input() shouldFilter = false;

  get durables(){
    return this.filterByAvailable(this.assets.durables);
  }
  get consumables(){
    return this.filterByAvailable(this.assets.consumables);
  }
  get allAssets(){
    return [this.durables, this.consumables];
  }
  get rowTitles(){ return ['Durables','Consumables']; }

  constructor(
    private assets: AssetService
  ) { }

  ngOnInit() {
  }

  getPopoverContent(){
    //if (this.durableId) return this.popoverContent;
    return null;
  }

  filterByAvailable(toFilter: Asset[]){
    //if (this.shouldFilter) return toFilter.filter(durable => !durable.available);
    return toFilter;
  }
  filterNonMatches(dictionary: Asset[], filter: string){
    let lowercase = filter.toLowerCase();
    return dictionary.filter(asset => asset.name.toLowerCase().includes(lowercase));
  }
  
}
