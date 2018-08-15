import { Consumable } from './../../../models/classes/consumable';
import { Asset } from '../../../models/classes/asset';
import { Component, OnInit, EventEmitter, ElementRef, ViewChild, Input, Output } from '@angular/core';
import { AssetService } from '../../../services/asset/asset.service';
import { Durable } from '../../../models/classes/durable';
import { Globals } from '../../../globals';

@Component({
  selector: 'asset-select',
  templateUrl: './asset-select.component.html',
  styleUrls: ['./asset-select.component.scss']
})
export class AssetSelectComponent implements OnInit {

  @ViewChild('popoverContent') popoverContent: ElementRef;

panelWidth = '275px';
  
  private _assetIds : string[];
  @Input() get assetIds() : string[] { return this._assetIds; }
  @Output() assetIdsChange = new EventEmitter<string[]>();
  set assetIds(v : string[]) {
    this._assetIds = v;
    this.assetIdsChange.emit(v);
  }
  


  @Input() shouldFilter = false;

  get allAssets(){
    return [this.assets.durables, this.assets.consumables];
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

  filter(dictionary: Asset[][], selectedAssetIds: string[]){
    let durables: Durable[] = dictionary[0] as Durable[];
    let consumables: Consumable[] = dictionary[1] as Consumable[];
    durables = durables.filter(match => !match.available);
    durables = durables.filter(match => !selectedAssetIds.includes(match.id));
    consumables = consumables.filter(
      match => match.assignmentIds.length + Globals.countInArray(selectedAssetIds,match.id) < match.quantity
    );
    let result = (durables as Asset[]).concat(consumables as Asset[]);
    return result;
  }
  
}
