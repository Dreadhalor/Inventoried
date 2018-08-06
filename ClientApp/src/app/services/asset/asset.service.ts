import { InfoService } from '../info/info.service';
import { Injectable } from '@angular/core';
import { Durable } from '../../models/durable';
import { Consumable } from '../../models/consumable';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  public static initDurables: Durable[] = [
    new Durable(undefined, 'sdfewagw', 3, 2, 'This is a thing', undefined, [1,3,4], undefined),
    new Durable(undefined, 'g34h6765', 1, 4, 'Hello, world!', undefined, [2,3], undefined),
    new Durable(undefined, 'e5yhgfhg', 5, 1, 'Ughhhhhh', undefined, [5,3], undefined),
    new Durable(undefined, '87fgh49y', 2, 5, 'Ooga booga shoeshine', undefined, [2], undefined),
    new Durable(undefined, 'df6890gh', 4, 3, 'Two households, both alike in dignity, In fair Verona, where we lay our scene, From ancient grudge break to new mutiny, Where civil blood makes civil hands unclean.', undefined, [2,1,4], undefined),
  ]

  _durables: Durable[] = [];
  get durables(){ return this._durables; }
  set durables(val: Durable[]){ this._durables = val; }

  _consumables: Consumable[] = [];
  get consumables(){ return this._consumables; }
  set consumables(val: Consumable[]){ this._consumables = val; }

  public addAssetTabIndex = 0;
  private _browseAssetsTabIndex = 0;
  get browseAssetsTabIndex(){ return this._browseAssetsTabIndex; }
  set browseAssetsTabIndex(val: number){
    this.addAssetTabIndex = val;
    this._browseAssetsTabIndex = val;
  }

  constructor(
    private infoService: InfoService
  ) {
    AssetService.initDurables.forEach(durable => {
      this.addDurable(durable);
    })
  }

  getDurable(id){
    return this.durables.find(match => match.id == id);
  }

  addDurable(durable: Durable){
    durable.injectService(this.infoService);
    this.durables.push(durable);
  }
  saveDurable(durable: Durable){
    let index = this.durables.findIndex(match => match.id == durable.id);
    if (index >= 0) this.durables[index] = durable;
  }

  addConsumable(consumable: Consumable){
    consumable.injectService(this.infoService);
    this.consumables.push(consumable);
  }
  saveConsumable(consumable: Consumable){
    let index = this.consumables.findIndex(match => match.id == consumable.id);
    if (index >= 0) this.consumables[index] = consumable;
  }
}
