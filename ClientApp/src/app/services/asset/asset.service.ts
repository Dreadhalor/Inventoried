import { InfoService } from '../info/info.service';
import { Injectable } from '@angular/core';
import { Durable } from '../../models/durable';
import { Consumable } from '../../models/consumable';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  public static initDurables: Durable[] = [
    new Durable(undefined, 'sdfewagw', 3, 2, 'This is a thing', undefined, undefined, undefined),
    new Durable(undefined, 'g34h6765', 1, 4, 'Hello, world!', undefined, undefined, undefined),
    new Durable(undefined, 'e5yhgfhg', 5, 1, 'Ughhhhhh', undefined, undefined, undefined),
    new Durable(undefined, '87fgh49y', 2, 5, 'Ooga booga shoeshine', undefined, undefined, undefined),
    new Durable(undefined, 'df6890gh', 4, 3, 'Two households, both alike in dignity, In fair Verona, where we lay our scene, From ancient grudge break to new mutiny, Where civil blood makes civil hands unclean.', undefined, undefined, undefined),
  ]

  _durables: Durable[] = [];
  get durables(){ return this._durables; }
  set durables(val: Durable[]){ this._durables = val; }

  _consumables: Consumable[] = [];
  get consumables(){ return this._consumables; }
  set consumables(val: Consumable[]){ this._consumables = val; }

  public addAssetTabIndex = 0;
  public browseAssetsTabIndex = 0;

  constructor(
    private infoService: InfoService
  ) {
    AssetService.initDurables.forEach(durable => {
      this.addDurable(durable);
    })
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
